#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p demo/data
curl --fail --location --max-time 120 --max-filesize 10000000 \
  'https://pmtiles.io/protomaps(vector)ODbL_firenze.pmtiles' \
  --output demo/data/firenze.pmtiles
echo '7190f3d807a62f4f012b574007c96b809f6842f45a6b0c508639331fc68fd30a  demo/data/firenze.pmtiles' | shasum -a 256 -c -
