import { PMTiles } from "https://cdn.jsdelivr.net/npm/pmtiles@4.5.0/+esm";

// Fixed example, deliberately not a reusable PMTilesLayer implementation.
const status = document.querySelector("#status");
const mapElement = document.querySelector("arcgis-map");
const archiveUrl = new URL("./data/firenze.pmtiles", document.baseURI).href;
const virtualRoot = new URL("./__pmtiles__/", document.baseURI).href;
const stats = { metadataRequests: 0, tileRequests: 0, missingTiles: 0 };

try {
  const [Map, Basemap, VectorTileLayer, esriConfig] = await $arcgis.import([
    "@arcgis/core/Map.js",
    "@arcgis/core/Basemap.js",
    "@arcgis/core/layers/VectorTileLayer.js",
    "@arcgis/core/config.js",
  ]);
  const archive = new PMTiles(archiveUrl);
  const [header, metadata] = await Promise.all([
    archive.getHeader(),
    archive.getMetadata(),
  ]);
  if (header.specVersion !== 3 || header.tileType !== 1) {
    throw new Error("Este ejemplo requiere PMTiles v3 con teselas MVT.");
  }

  // Public esriRequest API: returning data prevents an actual HTTP request.
  // Whether VectorTileLayer/its workers reach this interceptor is the experiment.
  const interceptor = {
    urls: virtualRoot,
    async before({ url, requestOptions }) {
      const path = new URL(url).pathname.slice(new URL(virtualRoot).pathname.length);
      if (path === "source.json") {
        stats.metadataRequests++;
        return {
          tilejson: "3.0.0",
          name: "Firenze PMTiles",
          scheme: "xyz",
          tiles: [`${virtualRoot}{z}/{x}/{y}.pbf`],
          minzoom: header.minZoom,
          maxzoom: header.maxZoom,
          bounds: [header.minLon, header.minLat, header.maxLon, header.maxLat],
          vector_layers: metadata.vector_layers.map(({ id }) => ({ id, fields: {} })),
          attribution: "Protomaps © OpenStreetMap contributors",
        };
      }
      const match = /^(\d+)\/(\d+)\/(\d+)\.pbf$/.exec(path);
      if (!match) throw new Error(`Ruta virtual inesperada: ${path}`);
      stats.tileRequests++;
      const [, z, x, y] = match.map(Number);
      const tile = await archive.getZxy(z, x, y, requestOptions.signal);
      if (!tile) stats.missingTiles++;
      // Never return undefined: it would let a virtual request reach the network.
      return tile ? tile.data : new ArrayBuffer(0);
    },
  };
  esriConfig.request.interceptors.push(interceptor);

  // Explicit, small style for this archive's known schema; no fonts/sprites needed.
  const style = {
    version: 8,
    sources: { pmtiles: { type: "vector", url: `${virtualRoot}source.json` } },
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#e7eef1" } },
      { id: "earth", type: "fill", source: "pmtiles", "source-layer": "earth",
        paint: { "fill-color": "#f3eddf" } },
      { id: "natural", type: "fill", source: "pmtiles", "source-layer": "natural",
        paint: { "fill-color": "#c9d9ad", "fill-opacity": 0.7 } },
      { id: "landuse", type: "fill", source: "pmtiles", "source-layer": "landuse",
        paint: { "fill-color": "#e2d9c5", "fill-opacity": 0.6 } },
      { id: "water", type: "fill", source: "pmtiles", "source-layer": "water",
        paint: { "fill-color": "#81bbcf" } },
      { id: "buildings", type: "fill", source: "pmtiles", "source-layer": "buildings",
        paint: { "fill-color": "#c4a78d", "fill-outline-color": "#aa8b71" } },
      { id: "roads", type: "line", source: "pmtiles", "source-layer": "roads",
        paint: { "line-color": "#ffffff", "line-width": 1.8 } },
    ],
  };
  const layer = new VectorTileLayer({
    title: "Firenze PMTiles — personal experiment",
    copyright: "Protomaps © OpenStreetMap contributors",
    style,
  });
  mapElement.map = new Map({ basemap: new Basemap({ baseLayers: [layer] }) });

  // Exposed only to inspect the fixed experiment using browser devtools.
  window.poc = { archive, header, metadata, layer, stats, mapElement, archiveUrl };
  await mapElement.viewOnReady();
  await layer.load();
  const layerView = await mapElement.view.whenLayerView(layer);
  window.poc.layerView = layerView;
  status.textContent = "Florencia · ejemplo cargado. Arrastra el mapa o utiliza +/−.";
  mapElement.view.on("layerview-create-error", ({ error }) => {
    console.error(error);
    status.textContent = `Error de representación: ${error.message}`;
  });
  window.addEventListener("pagehide", () => {
    const index = esriConfig.request.interceptors.indexOf(interceptor);
    if (index >= 0) esriConfig.request.interceptors.splice(index, 1);
    layer.destroy();
  }, { once: true });
} catch (error) {
  console.error(error);
  status.textContent = `Experimento bloqueado: ${error.message}`;
  window.pocError = { name: error.name, message: error.message };
}
