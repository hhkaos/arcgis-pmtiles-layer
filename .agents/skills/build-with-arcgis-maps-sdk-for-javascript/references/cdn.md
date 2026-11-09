# CDN apps

Refer to this reference only when the app loads the SDK from `js.arcgis.com`.

Use the version-specific pattern below before use.
`$arcgis.import()` is available from 4.32 for loading Core modules; use AMD `require` with earlier versions.

## CDN loading by version

### Version 5.0 and later

One module script loads the Core API, component packages, and Calcite:

```html
<script type="module" src="https://js.arcgis.com/5.1/"></script>
```

Add `type="module"` to scripts that use module syntax.

### Versions 4.33 and 4.34

Load the Core API and each needed component package with separate script tags.
Version 4.33 changed component URLs to match the Core API pattern:

```html
<script src="https://js.arcgis.com/4.33/"></script>
<script type="module" src="https://js.arcgis.com/4.33/map-components/"></script>
```

The old component URL was removed in 4.34. Use the versioned URL shown above for both releases.

### Versions 4.28 through 4.32

Load the Core API and each needed component package separately.
The component URL puts the package name before the version. The 4.28 CDN guide shows this pattern:

```html
<link rel="stylesheet" href="https://js.arcgis.com/4.28/esri/themes/light/main.css" />
<script src="https://js.arcgis.com/4.28/"></script>
<script type="module" src="https://js.arcgis.com/map-components/4.28/arcgis-map-components.esm.js"></script>
```

The official 4.28 component example includes the Core CSS link.
From 4.32, CDN component packages no longer need manual stylesheet links for their dependencies, including Calcite.
Widget or direct `MapView`/`SceneView` apps still need the Core CSS.

Map and Coding components first appeared in 4.28 as beta packages.
Charts components followed in 4.29; Embeddable components arrived in 4.31; Common and AI components arrived in 5.0.
Check the release notes for the app's exact SDK version to confirm that each component package and component is available. Do not infer version support from the latest documentation.

Release notes: [4.28](https://developers.arcgis.com/javascript/latest/v4-28/), [4.29](https://developers.arcgis.com/javascript/latest/v4-29/), [4.30](https://developers.arcgis.com/javascript/latest/v4-30/), [4.31](https://developers.arcgis.com/javascript/latest/v4-31/), [4.32](https://developers.arcgis.com/javascript/latest/v4-32/), [4.33](https://developers.arcgis.com/javascript/latest/v4-33/), [4.34](https://developers.arcgis.com/javascript/latest/v4-34/), [5.0](https://developers.arcgis.com/javascript/latest/v5-0/).

For the current CDN template, check [Esri/jsapi-resources](https://github.com/Esri/jsapi-resources/tree/main/templates/js-maps-sdk-cdn).

## Hosting the CDN build locally

You can [download the ArcGIS Maps SDK for JavaScript CDN build](https://developers.arcgis.com/javascript/latest/downloads-and-previous-versions/#hosting-the-cdn-build-locally) and host it on your own server.
