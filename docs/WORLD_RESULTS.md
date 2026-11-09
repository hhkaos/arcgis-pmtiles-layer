# Mundial, selector e inspector de rangos

Este informe corresponde al origen latest mediante proxy en la primera ampliación.
La demo actual usa directamente el mirror CORS de Source Cooperative y está en
inglés para su publicación estática. Véase [DEPLOYMENT.md](DEPLOYMENT.md).

2026-11-09 · Ampliación autorizada de la PoC personal; sin iniciativa ni compromiso de Esri.

## Resultado

El mundial se representa con ArcGIS 5.1 en Chrome 157, alternando con el archivo
regional de Florencia. También se ha comprobado Tokio a zoom 11. Se mantiene el
renderizador ArcGIS y el interceptor público; no hay MapLibre ni servicio que
convierta las teselas.

- Origen: https://latest.protomaps.com/v4.pmtiles, usado por la
  [demo de Protomaps](https://maps.protomaps.com/).
- Tamaño observado: **139 407 008 771 bytes (129,83 GiB)**; PMTiles v3/MVT,
  zooms 0–15, bounds [-180, -85.0511287, 180, 85.0511287]. Latest es mutable.
- Vista inicial mundial: **12 rangos, 590 634 bytes (576,79 KiB), 9 teselas**.
- Vista mundial seguida de Tokio: **22 rangos, 1 344 380 bytes (1,28 MiB),
  18 solicitudes de tesela**, ninguna ausente ni error de lectura.
- Florencia al alternar: **6 rangos, 337 810 bytes**, vista regional en zoom 13.
- Tras alternar, un único interceptor activo y ninguna petición HTTP a URLs virtuales.
- Consola limpia al comprobar ambos mapas y la navegación.

Son observaciones de una sesión, no benchmarks ni garantías de compatibilidad.
[Captura del inspector mundial](evidence/world-inspector.jpg).

## Por qué hay un proxy

El build fechado y latest respondieron a Range, pero sin Access-Control-Allow-Origin
para localhost; el navegador bloqueó su lectura. El antiguo demo-bucket devolvió
404. El usuario eligió un proxy de desarrollo en lugar de cambiar el dominio local.

El navegador solicita /world.pmtiles al mismo servidor de la demo. Este retransmite
solo rangos acotados al origen fijo oficial. No envía cookies/credenciales del
cliente ni suplanta un origen permitido. La respuesta se valida y se devuelve con
Content-Range, Content-Length y ETag. El User-Agent identifica honestamente el
experimento; el genérico de urllib recibía 403 (1010).

Se rechazan peticiones sin Range, rangos abiertos/invertidos o mayores de 8 MiB.
No hay parámetro URL, redirecciones ni proxy abierto; escucha solo en 127.0.0.1.
Cada respuesta se almacena temporalmente en memoria, como máximo 8 MiB, antes de
enviarla al navegador. Un 200 completo o rango incoherente se rechaza antes de
leer el cuerpo. Esto evita descargar el planeta cuando un origen ignora Range.

La [documentación de descargas](https://docs.protomaps.com/basemaps/downloads)
desaconseja hotlinking al origen de descargas y recomienda alojamiento propio.
Aquí se hace una prueba local contra un origen público; no se propone como backend
permanente de una aplicación publicada. No se ha añadido descarga mundial completa.

## Inspector

Calcite se carga desde el mismo CDN del SDK. El selector cambia archivo y vista
inicial; «Vista inicial» navega sin reiniciar contadores; «Nueva sesión» crea lector
nuevo y pone contadores a cero. Se cancelan lecturas obsoletas al cambiar archivo.

RangeSource implementa la interfaz pública Source del lector pmtiles. Registra
Range, estado HTTP observado, Content-Range, bytes consumidos y duración. Los
contadores suman cuerpos antes de descompresión e incluyen rangos repetidos;
excluyen cabeceras, módulos CDN y recursos resueltos en caché por el lector.
También cuentan los fragmentos que el lector llegó a consumir antes de un aborto.
No representan bytes facturables ni todo el tráfico de red. Los tiempos incluyen
el proxy y la espera por el origen; no son tiempos exclusivos de Protomaps.

La tabla muestra las últimas 40 lecturas; se conservan hasta 200 registros por
sesión y los contadores son acumulados. El atributo title de cada fila muestra
Content-Range o el error. window.poc permite inspeccionar la sesión en DevTools.

## Comprobaciones y límites

- Navegación y alternancia reales con controles y API pública; vistas estabilizadas.
- Solicitudes inválidas al proxy devolvieron 400; un parámetro de destino arbitrario,
  404. Comprobaciones con respuestas upstream simuladas verificaron rechazo de 200
  y de un rango incoherente sin leer su cuerpo; rangos inválidos no contactan upstream.
- Sintaxis de los módulos JS/Python comprobada. No se añadió suite ni infraestructura CI.
- Los datos son oficiales; el estilo de diagnóstico es propio, sencillo y sin
  etiquetas/glyphs/sprites. No se ha validado un estilo cartográfico oficial completo.
- Latest puede cambiar o dejar de estar accesible. Cambios de ETag se comunican al
  lector para invalidar su caché; esto no proporciona disponibilidad garantizada.
- El proxy es de desarrollo, sin caché de servidor ni límites globales de tráfico.
  No se ha probado carga, otros navegadores ni una clase PMTilesLayer reutilizable.

Ejecución: los mismos dos comandos del README. Reiniciar el servidor Python tras
actualizarlo. El archivo regional sigue siendo la única descarga previa necesaria.
