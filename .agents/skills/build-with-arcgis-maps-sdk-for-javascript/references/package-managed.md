# Package-managed apps

Refer to this reference only when the app installs the SDK through a package manager.

## Existing applications

- Use ESM imports from `@arcgis/core` and the component packages.
- Import every component used by the app.
- For disconnected environments, follow the [working with assets guide](https://developers.arcgis.com/javascript/latest/working-with-assets/). Copy the SDK and Calcite assets to local files, call `setAssetPath()` for each component package, and set `esriConfig.assetsPath` for Core API assets.
