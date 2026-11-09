# Memoria del proyecto

Actualizada: 2026-11-09. Estado: PoC y ampliación mundial/Florencia comprobadas.
Informes en POC_RESULTS.md y WORLD_RESULTS.md. Git ya estaba
inicializado en main antes de implementar. Sin instalación npm ni build.

## Objetivo vigente

Ampliación autorizada: arcgis-search, interruptor para el item público Living
Atlas 00281e52fa0a4d8ea5f58c3a6a779a97 (atracciones OSM de Europa) y arcgis-sketch.
FeatureLayer/GraphicsLayer normales; no soporte operacional PMTiles. Carga diferida
de capa y Sketch; persisten al cambiar mapa base. Ocultar Sketch conserva dibujos;
recargar los pierde. Métricas solo PMTiles. Comprobado: búsqueda Florence, Italy
(6 resultados sin credenciales), 496 entidades en vista, popup original y dibujo
de punto real. Alternancia conserva ambos; consola limpia. MCP accesible.

Tarea posterior autorizada: traducir UI al inglés, enlazar GitHub, commit/push y
GitHub Pages. Remoto confirmado: hhkaos/arcgis-pmtiles-layer (público, permisos admin).
El usuario pidió un origen mundial gratuito antes de elegir un backend nuevo.
Se comprobó https://data.source.coop/protomaps/openstreetmap/v4.pmtiles: público,
sin clave, Range/206, CORS *, cabeceras expuestas; tamaño 134 812 420 554 bytes.
La interfaz usa ese mirror directamente en local y Pages; el proxy antiguo queda
solo para pruebas locales. No se ha añadido backend externo. El mirror es más
antiguo que latest; no prometer disponibilidad ni uso ilimitado.
Artefacto estático dist/pages/ y workflow Pages autorizados, sin suite CI general.
El archivo de Florencia se descarga/verifica en el workflow, no se versiona.
Detalles en DEPLOYMENT.md. Discusión/documentos anteriores en español; UI en inglés.

Ampliación autorizada: mapa mundial oficial, alternancia con Florencia y UI para
desarrolladores con rangos/HTTP/duración/bytes/tamaño. Usuario eligió "vamos a por A":
proxy localhost de rangos con destino fijo. Sustituye ejemplo único/sin panel/sin
proxy; no autoriza la fase de librería reutilizable ni más infraestructura.

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
- Dos mapas base conocidos (Florencia/mundial), estilos de diagnóstico y URLs fijas.
- Ejemplo automático con selector e inspector; sin formularios de URLs ni File.
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

Mundial: https://latest.protomaps.com/v4.pmtiles, origen usado por maps.protomaps.com.
139 407 008 771 bytes observados. Latest y build fechado bloquean localhost por CORS;
demo-bucket antiguo devuelve 404. Proxy /world.pmtiles, sin URL del cliente,
credenciales ni redirects, máximo 8 MiB, exige 206/Content-Range coherente.
User-Agent propio arcgis-pmtiles-personal-poc/0.1; el genérico de urllib devolvía
403 (1010), el identificativo funciona. No suplantar un navegador.

RangeSource instrumenta la interfaz pública Source de pmtiles sin modificar fetch
global. Métricas desde cada selección/nueva sesión, suma de cuerpos antes de
descomprimir, no tráfico total/facturación. Últimas 40 filas, máximo 200 registros.
Calcite desde el mismo CDN ArcGIS; estilo de diagnóstico propio, sin etiquetas.
Primer mundial comprobado: 12 rangos, 590 634 bytes, 9 teselas, ninguna ausente.
Proxy rechaza peticiones sin rango/abiertas/invertidas/>8 MiB (400) y URL arbitraria
en query no tiene ruta (404). Captura: docs/evidence/world-inspector.jpg.
Alternancia verificada: Florencia zoom 13, 337 810 bytes; mundial y Tokio zoom 11,
1 344 380 bytes. Un interceptor activo, cero peticiones virtuales, consola limpia.
Se comprobaron respuestas upstream simuladas 200/incoherentes sin leer cuerpos.
Informe completo: WORLD_RESULTS.md. La ampliación está terminada; no iniciar más
fases sin instrucciones.

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
