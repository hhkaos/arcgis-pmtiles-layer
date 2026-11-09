# Configuration saved with layers and items

When a web map's operational layer references an `itemId`, the SDK loads that portal item and applies its saved configuration to the layer. The web map's own entry for that layer may contain almost nothing while the real configuration lives in the layer item. Reuse these rather than authoring equivalents by hand:

Layers can be `FeatureLayer`, `CSVLayer`, `GeoJSONLayer`, `OGCFeatureLayer`, or other types. Not all types support every property below. Check the loaded layer's API before use.

| Saved on the layer item                   | Loads onto               | Use it for                                         |
| ----------------------------------------- | ------------------------ | -------------------------------------------------- |
| `charts`                                  | `charts`                 | Saved chart definitions for `arcgis-chart`          |
| `attributeTableInfo`                      | `attributeTableTemplate` | Column set and sort order for `arcgis-feature-table` |
| `popupInfo`                               | `popupTemplate`          | Existing popup configuration and title field        |
| `layerDefinition.definitionExpression`    | `definitionExpression`   | The feature subset the app actually shows           |
| `layerDefinition.drawingInfo.labelingInfo` | `labelingInfo`          | Fields the cartographer chose to surface            |
| `featureEffect`                           | `featureEffect`          | A saved emphasis filter                             |

With a service `url` but no `itemId`, the SDK loads the service, not the settings saved in a layer item. It still applies settings saved in the web map, such as `popupInfo`.

Not every layer has saved charts, table settings, or popups. Load the layer, then check each property before use.

A web map also saves each layer's visibility. A layer saved not visible loads and queries normally but draws nothing; the symptom is an app that looks broken with no error.
