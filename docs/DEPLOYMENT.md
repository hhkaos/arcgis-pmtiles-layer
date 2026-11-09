# Run and publish the static demo

Repository: https://github.com/hhkaos/arcgis-pmtiles-layer

GitHub Pages: https://www.rauljimenez.info/arcgis-pmtiles-layer/

This is a personal experiment, not an official Esri initiative, endorsement,
roadmap signal or commitment. The interface is English; the development discussion
and earlier research documents are Spanish.

## Run locally

```sh
sh scripts/download-data.sh
python3 scripts/serve.py
```

Open http://127.0.0.1:8000/. No npm installation or API key is needed. Internet
access is required for ArcGIS 5.1, the PMTiles reader and the worldwide data.

## Map tools

Search uses the SDK default World Geocoding source. Switches enable the public
[Living Atlas attractions item](https://www.arcgis.com/home/item.html?id=00281e52fa0a4d8ea5f58c3a6a779a97)
and arcgis-sketch. Attractions cover Europe and retain their authored scale,
symbols and popups; enabling opens Florence if the view is too far out. Drawings
survive source switches and hiding the toolbar, but disappear on reload. Nothing
is saved to a service. Range metrics exclude search and overlay traffic.

Browser verification (SDK 5.1, Chrome): both basemaps render; Florence, Italy search
returned six results without credentials; attractions and original popup rendered;
a point was drawn and retained across basemap switches. No console warnings/errors.
Evidence: [map tools](evidence/map-tools.jpg).

## Data sources and CORS

- Florence: the verified 6.6 MB regional sample, served from the same origin as
  the demo. Its checksum and attribution are in [demo/data/README.md](../demo/data/README.md).
- Worldwide: https://data.source.coop/protomaps/openstreetmap/v4.pmtiles,
  the public Protomaps mirror on Source Cooperative. It supports HTTP Range,
  Access-Control-Allow-Origin: * and exposed response headers. Both local and
  hosted demos read it directly; no backend or credentials are required.

Observed archive size: 134 812 420 554 bytes. This mirror is an older snapshot,
not the latest daily build; availability and unlimited usage are not guaranteed.
The source recommends hosting your own copy for permanent applications. Preserve
Protomaps/OpenStreetMap attribution and the required Esri attribution.

The original latest.protomaps.com endpoint still blocks the GitHub Pages origin
by CORS. The previous localhost-only Python range proxy remains available at
/world.pmtiles for development, but the static demo does not depend on it.
GitHub Pages cannot execute that proxy.

GitHub Pages inherits the account domain www.rauljimenez.info. The original
hhkaos.github.io project URL redirects there; no account-wide domain was changed.

## Publish

The Pages workflow runs on pushes to main or manual dispatch:

1. Prepare the artifact using scripts/prepare-pages.sh.
2. Download Florence if absent and verify its pinned SHA-256.
3. Package only demo HTML/CSS/JS and the regional archive into dist/pages/.
4. Upload the Pages artifact and deploy it using the GitHub Pages environment.

The artifact has no Python server, secrets, repository internals or worldwide
archive. URLs are relative to the document so the project subpath works.
Build has read-only contents/Pages permissions; deploy has Pages write and OIDC
permissions. No long-lived deployment secret is used.

For a fresh repository, enable Settings → Pages → Source → GitHub Actions.
Inspect the workflow at https://github.com/hhkaos/arcgis-pmtiles-layer/actions.
Re-run it if upstream sample download or Pages provisioning temporarily fails.

This is experimental static hosting, not a production-readiness claim. The SDK,
data and assets retain their own licensing requirements; see the README's
production and attribution notice.
