# Sharing data across components

When a map, chart, and/or feature table use the same layer, pass the same layer instance to each component so they share the same underlying data and state.

- `arcgis-feature-table`: Set `map-layer-id` and `reference-element` to use a layer from the map component.
- `arcgis-chart`:
  - In SDK v5.2 or later, set `reference-element` to the map component's ID and `map-layer-id` to the layer's `id`, not its portal item ID. A chart inside the map component can omit `reference-element`.
  - Set `chart-index` to select a saved chart. If omitted, the first chart is used. An out-of-range index also uses the first chart and emits a warning.
  - `layer-item-id` searches the connected map for a matching portal item ID first. If no layer matches, it creates a separate layer from the portal item.
  - For older SDKs or layers inside group layers, set `layer` to the map's layer instance and `view` to the map's view. The ID lookup added in SDK 5.2 searches only top-level layers.
  - When setting `model` directly, use one of the layer's saved `charts` entries. Set `layer`, `view`, and render options first. Clear `model` in teardown so a re-render does not leave an orphaned chart instance.
  - Check that the chart's layer is in the map: `viewElement.map.allLayers.includes(chartElement.layer)`. Use `allLayers`, not `layers`, which omits layers nested in group layers.
