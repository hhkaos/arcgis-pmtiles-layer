// Ordinary SDK layers and components, independent of the PMTiles transport.
export async function setupMapTools(mapElement) {
  const [FeatureLayer, GraphicsLayer] = await $arcgis.import([
    "@arcgis/core/layers/FeatureLayer.js",
    "@arcgis/core/layers/GraphicsLayer.js",
  ]);
  await customElements.whenDefined("calcite-switch");
  const atlasToggle = document.querySelector("#atlas-toggle");
  const sketchToggle = document.querySelector("#sketch-toggle");
  const status = document.querySelector("#tools-status");
  const tools = {};
  window.mapTools = tools;

  atlasToggle.addEventListener("calciteSwitchChange", async () => {
    atlasToggle.disabled = true;
    try {
      if (atlasToggle.checked) {
        status.textContent = "Loading Living Atlas attractions…";
        if (!tools.attractions) {
          tools.attractions = new FeatureLayer({
            portalItem: { id: "00281e52fa0a4d8ea5f58c3a6a779a97" },
            visible: false,
          });
          mapElement.map.add(tools.attractions);
        }
        await tools.attractions.load();
        tools.attractions.visible = true;
        if (mapElement.scale > tools.attractions.minScale) {
          await mapElement.goTo({ center: [11.255, 43.77], zoom: 14 });
        }
        status.textContent = "Living Atlas attractions enabled · Europe, city scales.";
      } else {
        if (tools.attractions) tools.attractions.visible = false;
        status.textContent = "Living Atlas attractions hidden.";
      }
    } catch (error) {
      atlasToggle.checked = false;
      if (tools.attractions) tools.attractions.visible = false;
      status.textContent = `Could not enable attractions: ${error.message}`;
      console.error(error);
    } finally {
      atlasToggle.disabled = false;
    }
  });

  sketchToggle.addEventListener("calciteSwitchChange", async () => {
    sketchToggle.disabled = true;
    try {
      if (sketchToggle.checked && !tools.sketch) {
        tools.sketchLayer = new GraphicsLayer({ title: "Local sketches" });
        mapElement.map.add(tools.sketchLayer);
        tools.sketch = document.createElement("arcgis-sketch");
        tools.sketch.slot = "top-right";
        tools.sketch.layer = tools.sketchLayer;
        tools.sketch.defaultGraphicsLayerDisabled = true;
        mapElement.append(tools.sketch);
        await tools.sketch.componentOnReady();
      }
      if (tools.sketch) {
        if (!sketchToggle.checked) await tools.sketch.cancel();
        tools.sketch.hidden = !sketchToggle.checked;
      }
      status.textContent = sketchToggle.checked
        ? "Sketch enabled · drawings are temporary and stay when switching basemaps."
        : "Sketch toolbar hidden · drawings retained.";
    } catch (error) {
      sketchToggle.checked = false;
      if (tools.sketch) tools.sketch.hidden = true;
      status.textContent = `Could not enable sketch: ${error.message}`;
      console.error(error);
    } finally {
      sketchToggle.disabled = false;
    }
  });
  atlasToggle.disabled = false;
  sketchToggle.disabled = false;
}
