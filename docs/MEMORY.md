# Memoria del proyecto

Actualizada: 2026-11-09. Estado: PoC implementada y comprobada; resultado positivo
para el único ejemplo. Informe y evidencia en POC_RESULTS.md. Git ya estaba
inicializado en main antes de implementar. Sin instalación npm ni build.

## Objetivo vigente

El usuario reduce el anterior MVP de librería publicable a una prueba de concepto
para comprobar si podría funcionar y evaluar la utilidad de las skills y el MCP.
Ahorrar tiempo de desarrollo y tokens. Esta decisión prevalece sobre la entrevista
anterior; todo lo demás puede esperar a una fase posterior.
La especificación ampliada y convenciones anteriores se conservan en
SPECIFICATION.extended.md, reconstruidas a partir de esta sesión (no había
commits para recuperar una copia literal). Es referencia para una posible fase
futura, no instrucciones para ampliar la PoC actual.

## Confirmado en la entrevista breve

- Una página HTML/CDN con SDK 5.1 y el navegador disponible únicamente.
- Un mapa base vectorial PMTiles y estilo explícito, con URLs fijas en código.
- Ejemplo automático sin panel avanzado, formularios ni selector de archivos.
- HTTP(S), remoto o relativo al proyecto; sin file:// ni File/Blob.
- Comprobación visual de mapa/pan/zoom y red Range/206, e informe breve.
- Si falla la ruta pública, documentar el bloqueo sin desarrollar alternativas.
- No es necesario entregar una PMTilesLayer reutilizable ni estabilizar la API.
- La librería, matriz de compatibilidad, empaquetado y demás quedan para después.

## Requisitos que se mantienen

Experimento a título personal para probar ArcGIS agentic developer toolkit y
Esri developer agent skills, motivado por interés propio y de la comunidad.
Sin iniciativa, aval, decisión de exploración, roadmap ni compromiso de Esri/equipo
SDK. Mantener aviso visible en README/demo y atribuciones de Esri y los datos.

Preferir renderizador ArcGIS y APIs públicas, sin MapLibre ni parches globales.
Una fuente vectorial y un archivo conocido. Protomaps builds como candidato,
con extracto regional propio, sin hotlinking ni descarga global. Demo sin claves;
conservar aviso de requisitos de producción sin añadir servicios autenticados.

## Evidencia y pregunta técnica

MCP de documentación consultado con éxito en esta sesión. Configuración existente:
https://developers-mcpdevext.arcgis.com/mcp (no se ha cambiado). Hay skills locales
de requisitos, SDK y autenticación. Node observado: 22.23.3; npm: 11.6.2.

Hipótesis comprobada para el ejemplo: VectorTileLayer + interceptor público +
pmtiles 4.5.0. SDK 5.1, Chrome 157.0.0.0; suelo/agua/edificios/vías visibles,
zoom por componente y desplazamiento goTo. Range/206 real: 337 810 bytes iniciales
y 781 713 tras navegar, de un archivo de 6 601 156 bytes; cero peticiones a rutas
virtuales. Consola limpia en recarga final. No generalizar el resultado.

Se eligió el ejemplo regional oficial de Florencia en vez de extraer un build
global. Se descarga con script/hash y se sirve localmente. No se versiona el
binario. Estilo propio sencillo, sin glyphs/sprites/etiquetas. Captura y cabeceras
en docs/evidence. Ejecución: sh scripts/download-data.sh; python3 scripts/serve.py;
abrir http://127.0.0.1:8000/. El servidor sirve solo demo/ y escucha en localhost.
RESEARCH.md conserva evidencia previa, no obligaciones.

## Reanudación

SPECIFICATION.md aprobada explícitamente por el usuario el 2026-11-09:
"ya podemos dar SPECIFICATION.md por válida. sigamos". Ejecutar solo el
experimento mínimo ya completado; no volver a pedir aprobación de inicio.
No iniciar la fase ampliada sin que el usuario decida continuar.
La política previa de commits locales verificados se mantiene; no instalar hooks,
CI o release tooling. No publicar ni desplegar sin instrucciones.

Si se decide continuar después, la API preferida es new PMTilesLayer({ url, style,
sourceId, ... }), en Basemap.baseLayers. Preferencias futuras de tooling y flujo
conservadas en PROJECT_SETUP.md; no desarrollarlas durante la PoC.
