import { PMTiles } from "https://cdn.jsdelivr.net/npm/pmtiles@4.5.0/+esm";
import { RangeSource } from "./range-source.js";
import { createStyle } from "./style.js";

const mapElement = document.querySelector("arcgis-map");
const picker = document.querySelector("#source-picker");
const status = document.querySelector("#status");
const configs = {
  world: {
    label: "Mundial · Protomaps", url: "./world.pmtiles",
    origin: "https://latest.protomaps.com/v4.pmtiles",
    route: "Navegador → proxy local de rangos → Protomaps",
    center: [-3, 35], zoom: 2,
  },
  firenze: {
    label: "Florencia · archivo local", url: "./data/firenze.pmtiles",
    origin: "Archivo regional de ejemplo · demo/data/firenze.pmtiles",
    route: "Navegador → archivo local (HTTP Range)",
    center: [11.255, 43.77], zoom: 13,
  },
};
let current;
let generation = 0;
let renderTimer;
const formatBytes = (bytes) => {
  if (bytes == null) return "—";
  if (bytes === 0) return "0 B";
  const unit = Math.min(3, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** unit).toLocaleString("es", { maximumFractionDigits: 2 })} ${["B", "KiB", "MiB", "GiB"][unit]}`;
};

function render() {
  renderTimer = null;
  if (!current) return;
  const { source, config, header } = current;
  document.querySelector("#source-title").textContent = config.label;
  document.querySelector("#source-origin").textContent = config.origin;
  document.querySelector("#source-route").textContent = config.route;
  document.querySelector("#request-count").textContent = source.stats.requests;
  document.querySelector("#received-bytes").textContent = formatBytes(source.stats.bytes);
  document.querySelector("#archive-size").textContent = formatBytes(source.totalSize);
  document.querySelector("#archive-size").title = `${source.totalSize ?? "?"} bytes`;
  document.querySelector("#tile-count").textContent = source.stats.tileRequests;
  document.querySelector("#metadata").textContent = header
    ? `PMTiles v${header.specVersion} · MVT · zoom ${header.minZoom}–${header.maxZoom} · ${source.stats.missingTiles} teselas ausentes`
    : "Leyendo cabecera y metadatos…";
  const table = document.querySelector("#request-log");
  table.querySelectorAll("calcite-table-row:not([slot])").forEach((row) => row.remove());
  for (const record of source.records.slice(-40).reverse()) {
    const row = document.createElement("calcite-table-row");
    row.title = record.error || record.contentRange || "Petición en curso";
    for (const text of [
      `${record.start.toLocaleString("en-US")}–${record.end.toLocaleString("en-US")}`,
      record.error ? `${record.status} !` : record.status,
      formatBytes(record.bytes), record.ms ?? "…",
    ]) {
      const cell = document.createElement("calcite-table-cell");
      cell.textContent = text;
      row.append(cell);
    }
    table.append(row);
  }
}
function scheduleRender() {
  if (!renderTimer) renderTimer = setTimeout(render, 100);
}

try {
  const [Map, Basemap, VectorTileLayer, esriConfig] = await $arcgis.import([
    "@arcgis/core/Map.js", "@arcgis/core/Basemap.js",
    "@arcgis/core/layers/VectorTileLayer.js", "@arcgis/core/config.js",
  ]);
  await customElements.whenDefined("calcite-segmented-control");

  async function activate(key) {
    const id = ++generation;
    current?.dispose();
    const config = configs[key];
    const source = new RangeSource(new URL(config.url, document.baseURI).href, scheduleRender);
    const session = { key, config, source };
    current = session;
    const virtualRoot = new URL(`./__pmtiles__/${id}/`, document.baseURI).href;
    session.dispose = () => {
      source.controller.abort();
      session.basemap?.destroy();
      const index = esriConfig.request.interceptors.indexOf(session.interceptor);
      if (index >= 0) esriConfig.request.interceptors.splice(index, 1);
    };
    picker.disabled = true;
    document.querySelector("#reload").disabled = true;
    status.textContent = `Cargando ${config.label}…`;
    delete window.pocError;
    window.poc = { source, stats: source.stats, mapElement, config, key };
    render();
    try {
      const archive = new PMTiles(source);
      session.archive = archive;
      const [header, metadata] = await Promise.all([archive.getHeader(), archive.getMetadata()]);
      if (current !== session) return;
      if (header.specVersion !== 3 || header.tileType !== 1) throw new Error("Se requiere PMTiles v3 con MVT");
      session.header = header;
      const interceptor = {
        urls: virtualRoot,
        async before({ url, requestOptions }) {
          const path = new URL(url).pathname.slice(new URL(virtualRoot).pathname.length);
          if (path === "source.json") return {
            tilejson: "3.0.0", name: config.label, scheme: "xyz",
            tiles: [`${virtualRoot}{z}/{x}/{y}.pbf`],
            minzoom: header.minZoom, maxzoom: header.maxZoom,
            bounds: [header.minLon, header.minLat, header.maxLon, header.maxLat],
            vector_layers: metadata.vector_layers.map(({ id }) => ({ id, fields: {} })),
            attribution: "Protomaps © OpenStreetMap contributors",
          };
          const match = /^(\d+)\/(\d+)\/(\d+)\.pbf$/.exec(path);
          if (!match) throw new Error(`Ruta virtual inesperada: ${path}`);
          source.stats.tileRequests++;
          const [, z, x, y] = match.map(Number);
          const tile = await archive.getZxy(z, x, y, requestOptions.signal);
          if (!tile) source.stats.missingTiles++;
          scheduleRender();
          // undefined would send a request to the virtual URL. Return an empty MVT instead.
          return tile ? tile.data : new ArrayBuffer(0);
        },
      };
      session.interceptor = interceptor;
      esriConfig.request.interceptors.push(interceptor);
      const layer = new VectorTileLayer({
        title: config.label, copyright: "Protomaps © OpenStreetMap contributors",
        style: createStyle(`${virtualRoot}source.json`, metadata.vector_layers.map(({ id }) => id)),
      });
      session.layer = layer;
      session.basemap = new Basemap({ baseLayers: [layer] });
      mapElement.center = config.center;
      mapElement.zoom = config.zoom;
      if (mapElement.map) mapElement.map.basemap = session.basemap;
      else mapElement.map = new Map({ basemap: session.basemap });
      Object.assign(window.poc, { archive, header, metadata, layer, archiveUrl: source.url });
      await mapElement.viewOnReady();
      await layer.load();
      window.poc.layerView = await mapElement.view.whenLayerView(layer);
      await mapElement.goTo({ center: config.center, zoom: config.zoom }, { animate: false });
      if (current === session) status.textContent = `${config.label} preparado · explora el mapa para solicitar más rangos.`;
    } catch (error) {
      if (current !== session || error.name === "AbortError") return;
      session.dispose();
      status.textContent = `Error en ${config.label}: ${error.message}`;
      console.error(error);
      window.pocError = { name: error.name, message: error.message };
    } finally {
      if (current === session) {
        picker.disabled = false;
        document.querySelector("#reload").disabled = false;
        scheduleRender();
      }
    }
  }

  picker.addEventListener("calciteSegmentedControlChange", () =>
    activate(picker.selectedItem.value === "Mundial" ? "world" : "firenze"));
  document.querySelector("#reload").addEventListener("click", () => activate(current.key));
  document.querySelector("#home").addEventListener("click", () => {
    if (!mapElement.view) return;
    mapElement.goTo({ center: current.config.center, zoom: current.config.zoom }).catch((error) => {
      if (error.name !== "AbortError") status.textContent = error.message;
    });
  });
  window.addEventListener("pagehide", () => current?.dispose(), { once: true });
  await activate("world");
} catch (error) {
  status.textContent = `No se pudo iniciar el ejemplo: ${error.message}`;
  console.error(error);
}
