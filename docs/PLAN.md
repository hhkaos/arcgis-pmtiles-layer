# Plan: experimento mínimo

Estado: experimento completado; resultado positivo limitado al ejemplo.
Informe: [POC_RESULTS.md](POC_RESULTS.md).
La ampliación mundial/Florencia con proxy de rangos e inspector está implementada
y comprobada; evidencia en [WORLD_RESULTS.md](WORLD_RESULTS.md).
Estos pasos son intenciones personales, no planes ni compromisos de Esri.

1. Confirmar la consulta al MCP y utilizar las skills para identificar los puntos
   públicos de integración. Reutilizar la investigación existente; no repetirla entera.
2. Elegir un archivo regional pequeño y estilo compatible, con créditos y URLs
   fijas. Comprobar alojamiento HTTP Range; no descargar un archivo global.
3. Preparar un HTML/CDN con SDK 5.1 y el mínimo adaptador PMTiles necesario para
   probar el renderizador ArcGIS. Sin build de paquete, panel ni API estable.
4. Abrir en el navegador disponible; comprobar cartografía, pan/zoom y red.
5. Escribir un informe breve con evidencia, límites y aportación de skills/MCP.
   Si se bloquea la ruta pública, describirlo y terminar el experimento sin
   implementar otra arquitectura.

Trabajar secuencialmente. Mantener un solo SDK y seguir patrones oficiales.
Usar comprobaciones de navegador proporcionadas al experimento: no instalar
Vitest/Playwright, CI, hooks ni herramientas de release para esta fase.
La clase PMTilesLayer y el paquete reutilizable se dejan para después.

Resultado esperado: evidencia suficiente para decidir si merece otra fase.
No se exige que sea apto para uso real. La siguiente fase se decide con el
usuario a partir del resultado, sin ejecutar automáticamente los planes anteriores.
