# Datos del ejemplo

Ejecutar `sh scripts/download-data.sh` desde la raíz para obtener `firenze.pmtiles`.
El binario se ignora en Git; no se descarga el planeta.

- Fuente: https://pmtiles.io/protomaps(vector)ODbL_firenze.pmtiles
- Ejemplo oficial: https://github.com/protomaps/PMTiles/blob/main/js/examples/maplibre.html
- Tamaño observado: 6 601 156 bytes; PMTiles v3, MVT, gzip, zooms 0–15.
- SHA-256: `7190f3d807a62f4f012b574007c96b809f6842f45a6b0c508639331fc68fd30a`.
- Datos Protomaps / © OpenStreetMap contributors, ODbL:
  https://www.openstreetmap.org/copyright

Se utiliza el archivo regional que Protomaps ya distribuye para ejemplos en vez
de extraer un build global, para reducir el trabajo de esta PoC. El estilo mínimo
de main.js es propio y usa el esquema comprobado en los metadatos del archivo.
