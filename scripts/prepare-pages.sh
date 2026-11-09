#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if [ ! -f demo/data/firenze.pmtiles ]; then
  sh scripts/download-data.sh
fi
echo '7190f3d807a62f4f012b574007c96b809f6842f45a6b0c508639331fc68fd30a  demo/data/firenze.pmtiles' | shasum -a 256 -c -

# Publish only the static demo and the small regional archive, never the repo.
rm -rf dist/pages
mkdir -p dist/pages/data
cp demo/index.html demo/main.js demo/map-tools.js demo/range-source.js demo/style.js demo/style.css dist/pages/
cp demo/data/firenze.pmtiles dist/pages/data/
touch dist/pages/.nojekyll
echo 'GitHub Pages artifact ready: dist/pages/'
