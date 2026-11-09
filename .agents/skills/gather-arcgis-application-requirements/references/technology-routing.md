# ArcGIS technology routing

Use this reference after reviewing application requirements. It maps the current plugin catalog to build skills; it does not establish that a plugin is installed or that a technology supports every requested capability.

## Plugin selection rules

- Preserve a compatible existing stack. For new applications, recommend a technology from the required workflows, runtime, deployment, and resources rather than from the user's experience level.
- Treat ArcGIS product, audience, resource sharing, and authentication as independent requirements. Do not select authentication from a technology row; use `follow-arcgis-authentication-patterns` when needed.
- Select one primary build skill and only the complementary skills needed for the task. REST JS can be a primary API library or a complement to a web renderer; Calcite is a UI system, not a map renderer.
- Verify runtime, version, resource, licensing, and operation support in current official documentation before committing to a recommendation. Offline support and product-specific service access are not implied by a row.
- Refer to skills by their exact skill names when routing a task. A skill name identifies what to discover or request; it does not guarantee that the skill is installed or loaded.
- Check catalog presence, installation, and client discoverability separately. Repository links identify source files, not installed paths or dependencies. Use discovered skills; install only when supported and authorized.

## Availability and fallback

Routing identifies recommended resources; it does not install or activate them. Discover the selected skill by its exact name and check which MCP tools are available in the current client before using them. Naming a skill does not invoke or load it; repository paths are for source navigation only, not installation paths or plugin dependencies.

- **Plugin unavailable:** Install it only when the client supports installation and the user authorizes it; verify installation and skill discoverability afterward. Otherwise provide client-specific installation guidance and continue using accessible official documentation when feasible.
- **MCP unavailable or disconnected:** Use the official guide links below through available web tools. Do not attempt calls to unavailable MCP tools or assume a configured server is connected.
- **Both unavailable:** Explain the missing resources, offer installation or connection guidance, and use accessible official documentation. Do not switch technologies merely because the recommended plugin is missing.
- **Documentation also inaccessible:** Use reliable project evidence where sufficient, disclose verification limits, and pause the affected work if an unresolved compatibility or security question could materially change the implementation.

Continue when reliable evidence is sufficient, state unverified requirements, and pause only for consequential blockers. Never claim a skill was loaded, a plugin installed, or documentation verified without evidence.

## Technology catalog

Plugin identifiers below match plugin manifests. Build skill names match skill frontmatter. Complements are optional, not mandatory dependencies.

| Technology | Plugin | Build skill | Appropriate use and runtime | Boundaries | Official guide and MCP focus | Complements |
| --- | --- | --- | --- | --- | --- | --- |
| ArcGIS Maps SDK for JavaScript | `arcgis-maps-sdk-for-javascript` | `build-with-arcgis-maps-sdk-for-javascript` | Browser applications using ArcGIS 2D/3D maps and spatial workflows | Not a server-side map renderer or an open-source renderer integration | [Guide](https://developers.arcgis.com/javascript/latest/); `javascript-sdk` | Calcite; REST JS for additional REST workflows |
| ArcGIS Maps SDK for .NET | `arcgis-maps-sdk-for-dotnet` | `build-with-arcgis-maps-sdk-for-dotnet` | Mapping applications on supported .NET desktop and mobile targets | Not ArcGIS Pro SDK; verify target framework and OS support | [Guide](https://developers.arcgis.com/net/); `net-sdk` | None by default |
| ArcGIS Maps SDK for Swift | `arcgis-maps-sdk-for-swift` | `build-with-arcgis-maps-sdk-for-swift` | Mapping applications on supported Apple platforms using Swift | Not a browser SDK; verify supported OS and toolchain versions | [Guide](https://developers.arcgis.com/swift/); `swift-sdk` | None by default |
| ArcGIS Maps SDK for Kotlin | `arcgis-maps-sdk-for-kotlin` | `build-with-arcgis-maps-sdk-for-kotlin` | Kotlin mapping applications on supported targets | Do not assume every Kotlin runtime is supported; verify platform and toolchain requirements | [Guide](https://developers.arcgis.com/kotlin/); `kotlin-sdk` | None by default |
| ArcGIS Maps SDK for Qt | `arcgis-maps-sdk-for-qt` | `build-with-arcgis-maps-sdk-for-qt` | Cross-platform mapping applications using supported Qt/C++ environments | Verify Qt, compiler, OS, and API compatibility; not a web renderer | [Guide](https://developers.arcgis.com/qt/); `qt-sdk` | None by default |
| ArcGIS Maps SDK for Flutter | `arcgis-maps-sdk-for-flutter` | `build-with-arcgis-maps-sdk-for-flutter` | Mapping applications using Flutter on supported targets | Flutter framework support does not imply SDK support on every platform | [Guide](https://developers.arcgis.com/flutter/); `flutter-sdk` | None by default |
| ArcGIS Maps SDK for Unity | `arcgis-maps-sdk-for-unity` | `build-with-arcgis-maps-sdk-for-unity` | Geospatial 3D and XR experiences in Unity | Not a general web/native UI SDK; verify engine and packaged-runtime compatibility | [Guide](https://developers.arcgis.com/unity/); `unity-sdk` | None by default |
| ArcGIS Maps SDK for Unreal Engine | `arcgis-maps-sdk-for-unreal-engine` | `build-with-arcgis-maps-sdk-for-unreal-engine` | Geospatial 3D and XR experiences in Unreal Engine | Not a general web/native UI SDK; verify engine and packaged-runtime compatibility | [Guide](https://developers.arcgis.com/unreal-engine/); `unreal-engine-sdk` | None by default |
| ArcGIS API for Python | `arcgis-api-for-python` | `build-with-arcgis-api-for-python` | Scripts, notebooks, and server-side automation for ArcGIS content, data, and analysis | Not interchangeable with ArcPy or a browser mapping SDK; verify operation privileges and analysis prerequisites | [Guide](https://developers.arcgis.com/python/latest/); `python-api` | None by default |
| ArcGIS REST JS | `arcgis-rest-js` | `build-with-arcgis-rest-js` | ArcGIS REST workflows in browser JavaScript or Node.js | Not a map renderer or complete coverage of every REST endpoint; distinguish browser from trusted-server credentials | [Guide](https://developers.arcgis.com/arcgis-rest-js/); `arcgis-rest-js` | Selected web renderer; Calcite when UI is needed |
| ArcGIS plugin for Leaflet | `arcgis-leaflet` | `build-with-arcgis-leaflet` | Leaflet browser maps integrating supported ArcGIS services through Esri Leaflet | Not the JavaScript Maps SDK; verify layer/service support and use Leaflet docs for renderer behavior | [Guide](https://developers.arcgis.com/esri-leaflet/); `esri-leaflet` | REST JS where needed; Calcite |
| ArcGIS plugin for MapLibre GL JS | `arcgis-maplibre` | `build-with-arcgis-maplibre` | MapLibre browser maps with ArcGIS basemaps, supported data, and location services | Not the JavaScript Maps SDK; MapLibre owns rendering and style semantics | [Guide](https://developers.arcgis.com/maplibre-gl-js/); `maplibre-arcgis-plugin` | REST JS where needed; Calcite |
| CesiumJS with ArcGIS | `arcgis-and-cesiumjs` | `build-with-arcgis-and-cesiumjs` | Browser 3D globe applications using CesiumJS and supported ArcGIS resources | Not a Unity/Unreal SDK or full ArcGIS Maps SDK equivalent; verify supported resource formats | [Guide](https://developers.arcgis.com/cesiumjs/); `cesiumjs` | REST JS where needed; Calcite |
| OpenLayers with ArcGIS | `arcgis-and-openlayers` | `build-with-arcgis-and-openlayers` | OpenLayers browser maps consuming supported ArcGIS resources | Not the JavaScript Maps SDK; use OpenLayers docs for renderer and projection behavior | [Guide](https://developers.arcgis.com/openlayers/); `openlayers` | REST JS where needed; Calcite |
| Calcite Design System | `calcite-design-system` | `build-with-calcite-design-system` | Web UI composition with Calcite components and design resources | Not a map renderer; UI-only work does not itself require ArcGIS service authentication | [Guide](https://developers.arcgis.com/calcite-design-system/); `calcite-design-system` | Selected web renderer or REST JS |

## Documentation routing

The focus areas above were verified with `fetch_esri_developer_focus_areas` on 2026-10-10. Refresh that list if the MCP server rejects a value or the requested technology is not listed. Do not send placeholders as focus areas; the MapLibre build skill currently contains one, so use the verified value above.

Use `search_esri_developer_docs` with the selected focus area and a concise query for the required API or operation. Include relevant technology or portal version details when checking compatibility. Follow official guide/API/sample links; for open-source renderer behavior, use the upstream library documentation linked from the integration guide.

For cross-cutting questions, the server also supports `security-and-authentication`, `portal-and-data-services`, `mapping-and-location-services`, `spatial-analysis-services`, and `offline-mapping-apps`. These are documentation scopes, not additional installed skills. Use `developers` for broader discovery. If MCP is unavailable, use the official guide links and disclose behavior that could not be verified.

## Catalog gaps and fallback

- ArcGIS Pro SDK has no matching plugin in this catalog. It extends ArcGIS Pro and must not be routed to the Maps SDK for .NET. Use [official documentation](https://pro.arcgis.com/en/pro-app/latest/sdk/) and the verified `pro-sdk` focus area.
- App builders, including Experience Builder and Instant Apps, have no dedicated build plugin here. Do not force a custom SDK application if a builder better meets the requirements; use the verified `app-builders` or `experience-builder` documentation scope as appropriate.
- ArcPy and generic ArcGIS REST API work have no dedicated build skill here. Do not treat ArcGIS API for Python as ArcPy or REST JS as every REST API. Consult official documentation and use a suitable available documentation scope.
- ArcGIS Location Platform, ArcGIS Online, and ArcGIS Enterprise are environment choices, not technology build plugins. Identify them through shared requirements and authentication guidance.

Catalog presence does not imply completed guidance: some build skills still contain authoring templates. Read the selected skill, identify incomplete instructions, and verify missing details in official documentation rather than treating TODO text as implementation advice.

## Maintenance

When adding, renaming, or removing a technology plugin, update its row, skill link, capability boundaries, and complements. Match identifiers against plugin manifests and skill frontmatter; recheck focus areas against the MCP server. Keep runtime/version details in official documentation and technology skills rather than duplicating version matrices here.
