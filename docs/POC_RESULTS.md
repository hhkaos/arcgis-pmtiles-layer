# Resultado de la prueba de concepto

Informe de la primera ejecución de Florencia. La ampliación posterior con mundial,
proxy e inspector está en [WORLD_RESULTS.md](WORLD_RESULTS.md).

2026-11-09 · Experimento personal, sin iniciativa ni compromiso de Esri.

**Resultado positivo para el ejemplo probado:** ArcGIS representa las teselas MVT
leídas de un PMTiles mediante el interceptor público de esriRequest, sin MapLibre,
Service Worker ni servidor que convierta teselas. El servidor local solo sirve
archivos y rangos de bytes.

## Reproducir

Desde la raíz del repositorio:

```sh
sh scripts/download-data.sh
python3 scripts/serve.py
```

Abrir http://127.0.0.1:8000/. Se necesita conexión para los módulos CDN de ArcGIS
y pmtiles. No hay instalación npm, build, credenciales ni servicios autenticados.
El servidor solo escucha en localhost y sirve demo/, no el repositorio entero.
El binario de datos se descarga aparte y se verifica con SHA-256.

## Qué se ha comprobado

- SDK **5.1**, lector **pmtiles 4.5.0**, Chrome **157.0.0.0** en macOS.
- Archivo regional de Florencia: **6 601 156 bytes**, PMTiles v3/MVT/gzip,
  zooms 0–15. Procedencia y hash en [datos del ejemplo](../demo/data/README.md).
- Cartografía real de suelo, agua, edificios y vías, inspeccionada visualmente.
- Zoom mediante el botón del componente (13 → 14) y desplazamiento mediante
  la API pública goTo a [11.27, 43.775]; vuelve a dibujar tras ambos cambios.
- Vista estabilizada con updating=false. Consola sin errores/advertencias en la
  recarga final. Powered by Esri, créditos de datos y aviso personal visibles.
- En la carga inicial: **6 lecturas parciales, 337 810 bytes** del archivo.
  Tras zoom/desplazamiento: **14 lecturas, 781 713 bytes**. Son observaciones de
  esta sesión, no un benchmark ni un presupuesto de rendimiento.
- Solicitudes reales con Range y respuesta **206**. Ejemplo:
  `Range: bytes=3682677-3745968`, `Content-Length: 63292`,
  `Content-Range: bytes 3682677-3745968/6601156`.
- **Cero peticiones de red a /__pmtiles__/**: los datos de TileJSON y MVT se
  resolvieron en el interceptor. En la vista inicial se solicitaron ocho teselas,
  cuatro ausentes fuera de la cobertura del archivo; se devolvieron MVT vacíos.

Evidencia: [captura](evidence/firenze.jpg) y
[cabeceras de una petición parcial](evidence/range-request.txt).

## Integración utilizada

[main.js](../demo/main.js) registra un interceptor limitado a un prefijo virtual
local. Para source.json devuelve TileJSON construido con metadatos del archivo;
para z/x/y.pbf devuelve archive.getZxy().data. VectorTileLayer consume un estilo
explícito y se incorpora a Basemap.baseLayers. La lectura usa el lector oficial;
el renderizado permanece en ArcGIS. Sin modificar fetch ni importar APIs privadas.

## Aportación de las skills y el MCP

- La skill de requisitos permitió reducir el anterior objetivo de librería a una
  hipótesis y una comprobación visual/de red. La PoC conserva el alcance aprobado.
- La skill del SDK y su referencia CDN indicaron la carga unificada de 5.x,
  $arcgis.import y componentes, evitando montar una aplicación con bundler.
- El MCP respondió antes de implementar y aportó la referencia de
  [BeforeInterceptorCallback](https://developers.arcgis.com/javascript/latest/references/core/request/types/):
  devolver datos/promesas evita enviar la petición; devolver undefined la deja
  continuar. Ese detalle fundamenta el adaptador y la respuesta a teselas ausentes.
- Chrome DevTools permitió contrastar cartografía, navegación y HTTP; consultar
  documentación y resolver layer.load() no habrían demostrado el resultado.

Se ha evaluado este flujo de skills/MCP con un ejemplo; no se ha realizado una
comparación de consumo de tokens ni una evaluación completa de todo el toolkit.

## Límites

Solo un archivo/esquema, estilo sencillo, versión del SDK y navegador. No hay
etiquetas, glyphs ni sprites, ni validación general de estilos, archivos privados,
otros orígenes CORS, otras proyecciones o múltiples instancias. El fondo sin datos
a los lados pertenece al recorte regional. La PoC no prueba una clase PMTilesLayer
reutilizable, una API estable ni preparación para producción. El servidor de
desarrollo implementa las peticiones de un solo rango usadas por este ejemplo.

El candidato inicial de datos eran los builds globales de Protomaps; se eligió
su archivo regional de ejemplo ya disponible para evitar extracción y descargas
grandes. Se sirve una copia local, sin hotlinking al bucket de builds.

La hipótesis merece una fase posterior si se desea; no se ha implementado esa
fase. La [especificación ampliada](SPECIFICATION.extended.md) continúa como alternativa.
