# Especificación: prueba de concepto mínima

Fecha: 2026-11-09 · Estado: aprobada; implementación del experimento autorizada.
Sustituye al anterior MVP de librería publicable.
Ejecución completada; evidencia y límites en [POC_RESULTS.md](POC_RESULTS.md).

La [especificación ampliada alternativa](SPECIFICATION.extended.md) conserva el
alcance de librería y las decisiones anteriores para una posible fase futura.
No forma parte de la prueba de concepto actual.

## Propósito

Comprobar si un mapa base vectorial PMTiles podría representarse con ArcGIS Maps
SDK for JavaScript sin MapLibre, y observar cómo ayudan las skills y el MCP de
documentación durante el experimento. Priorizar ahorro de tiempo y tokens.
No se busca todavía una librería utilizable en proyectos reales.

Experimento a título personal, por interés del autor y el
[interés de la comunidad](https://community.esri.com/en/discussion/1623262/introduce-a-pmtilelayer),
para probar el ArcGIS agentic developer toolkit y las
[Esri developer agent skills](https://github.com/Esri/esri-developer-agent-skills).
No representa una decisión, iniciativa, aval, hoja de ruta ni compromiso de Esri
ni del equipo del SDK. Mantener este aviso visible en README y demo.

## Demostración mínima acordada

- Una página HTML con ArcGIS 5.1 desde CDN, ejecutada mediante HTTP local.
- Un único mapa base MVT/PMTiles y un estilo explícito compatible, con URLs fijas
  en el código: remotas o relativas al proyecto. Sin selector de archivos.
- Carga automática del ejemplo y navegación pan/zoom. Sin panel avanzado,
  formularios, selector de estilos ni controles propios adicionales.
- Una versión del SDK y el navegador disponible; registrar cuáles se probaron.
- Renderizador ArcGIS y APIs públicas; lector pmtiles cuando sea necesario.
- Demo sin credenciales, conservando atribuciones de Esri y proveedores.

Candidato de datos: un extracto regional de los
[builds de Protomaps](https://maps.protomaps.com/builds/), servido por el proyecto
sin hotlinking al bucket de descargas. Elegir un recurso pequeño y compatible;
no descargar el planeta ni crear una infraestructura de fixtures. Registrar
procedencia, estilo y créditos. Dataset concreto pendiente de seleccionar.

## Hipótesis y límites del experimento

Probar VectorTileLayer con adaptación PMTiles mediante el interceptor público de
esriRequest. Es una hipótesis, no una integración demostrada. Consultar firmas y
patrones oficiales usando el MCP; investigar solo lo necesario para esta ruta.
Si aparecen obstáculos, producir un resultado reproducible y explicar qué faltaría.
No desarrollar alternativas con Service Worker, servidor o segundo motor.

La clase new PMTilesLayer({ url, style, sourceId, ... }) sigue siendo la experiencia
preferida para una futura librería. No es obligatoria para demostrar ahora el
transporte y renderizado; basta código local mínimo con un Basemap de ArcGIS.
No estabilizar una API ni implementar compatibilidad general de estilos.

## Comprobación y entrega

1. Abrir la página y comprobar visualmente que aparecen las teselas esperadas.
2. Probar pan y zoom en la región del ejemplo.
3. Inspeccionar red: peticiones Range/206 al archivo, sin descarga completa ni
   peticiones virtuales que escapen al adaptador. Revisar errores relevantes.
4. Entregar el ejemplo y un informe breve con versión del SDK/navegador, URLs,
   resultado, bloqueo si lo hay y qué aportaron las skills/MCP con ejemplos concretos.

El resultado puede ser positivo o negativo. Un bloqueo documentado en la ruta
pública también cumple el objetivo de aprendizaje. No extrapolar una demostración
exitosa a compatibilidad general ni a preparación para producción.

## Fase posterior, solo si se decide continuar

Librería PMTilesLayer reutilizable/publicable, consumo npm y CDN, tipos, validación
general de estilos, panel avanzado, compatibilidad con otros SDK/navegadores,
automatización de pruebas, CI, hooks, Changesets y releases, trabajo paralelo,
ráster y capas operacionales. Ninguno bloquea esta prueba ni implica una entrega
futura comprometida.

Conservar en README el aviso sobre licencias de producción y atribuciones,
aunque el experimento no incluya un flujo de despliegue ni autenticación.

### ArcGIS requirements handoff summary

- **Work Target:** New application or script — prueba de concepto.
- **Project Folder:** `.` (`arcgis-pmtiles-layer`).
- **ArcGIS Product Context:** Demo sin portal ni servicios protegidos; requisitos de producción documentados por separado.
- **Target Platform:** Web, HTML/CDN, SDK 5.1, navegador disponible, 2D Web Mercator.
- **Delivery Scope:** Prototype; un mapa base fijo y comprobación visual/de red. Librería publicable y validación amplia diferidas.
- **Identity & Access Model:** Demo pública, sin credenciales ni inicio de sesión.
- **Core Features and Operations:** Lectura parcial PMTiles y renderizado de mapa base; evaluar skills/MCP.

#### Remaining assumptions

1. Dataset/estilo concretos por seleccionar y ruta de APIs públicas por comprobar.

#### Next agent actions

- [x] Revisión y aprobación explícita del usuario para implementar la PoC mínima.
- [x] Route to `build-with-arcgis-maps-sdk-for-javascript` para el experimento.
- [ ] Route to `follow-arcgis-authentication-patterns` solo si cambian recursos o acceso; no añadir autenticación al ejemplo actual.
