# arcgis-pmtiles-layer

[GitHub repository](https://github.com/hhkaos/arcgis-pmtiles-layer)
· [Demo en GitHub Pages](https://www.rauljimenez.info/arcgis-pmtiles-layer/)

**Experimento personal. No es una iniciativa oficial de Esri.**

Este repositorio nace del interés personal de su autor por PMTiles y del interés
expresado en [este hilo de Esri Community](https://community.esri.com/en/discussion/1623262/introduce-a-pmtilelayer).
Su propósito es experimentar con el ArcGIS agentic developer toolkit y las
[Esri developer agent skills](https://github.com/Esri/esri-developer-agent-skills)
explorando una posible integración de PMTiles con ArcGIS Maps SDK for JavaScript.

La existencia de este repositorio, sus pruebas y sus resultados no representan
una decisión, iniciativa, aval ni posición oficial de Esri o del equipo del SDK.
No deben interpretarse como una señal de su hoja de ruta ni como un compromiso
de incorporar PMTiles, ofrecer soporte o entregar funcionalidades en ningún plazo.
Los planes de este repositorio describen únicamente las intenciones del experimento
personal y pueden cambiar según los resultados.

Prueba de concepto mínima para comprobar si un mapa base vectorial PMTiles puede
renderizarse con ArcGIS Maps SDK for JavaScript, sin incorporar MapLibre, y evaluar
la ayuda de las skills y del MCP durante el experimento.

**Estado: PoC comprobada en ArcGIS 5.1 y Chrome.** Permite alternar entre Florencia
y un mapa mundial de Protomaps, con renderizado ArcGIS e inspector de rangos HTTP.

Incluye buscador ArcGIS, activación de la capa pública de atracciones turísticas
de Europa del Living Atlas y herramientas Sketch. Las capas y dibujos se conservan
al cambiar de mapa base; los dibujos son temporales y se pierden al recargar.
El inspector mide solo PMTiles, excluyendo búsquedas y capas adicionales.

Para ejecutarla desde la raíz:

```sh
sh scripts/download-data.sh
python3 scripts/serve.py
```

Abrir http://127.0.0.1:8000/. Se requiere conexión a los CDN, sin claves ni npm.
El archivo regional (6,6 MB) se descarga aparte. El mundial se lee directamente
por rangos desde el mirror público de Protomaps en Source Cooperative, con CORS;
no necesita proxy ni descarga completa. El proxy Python anterior queda disponible
en local para experimentos, pero la interfaz usa el mirror tanto en local como en Pages.
Consultar [el experimento mundial y sus límites](docs/WORLD_RESULTS.md),
la [captura del inspector](docs/evidence/world-inspector.jpg) y el
[informe inicial de Florencia](docs/POC_RESULTS.md).

Lectura recomendada:

1. [Especificación de la prueba de concepto](docs/SPECIFICATION.md).
2. [Investigación y alternativas de arquitectura](docs/RESEARCH.md).
3. [Plan y criterios de aceptación](docs/PLAN.md).
4. [Configuración propuesta](docs/PROJECT_SETUP.md).
5. [Memoria de decisiones](docs/MEMORY.md) y [tareas](docs/TODO.md).

Para una posible continuación, se conserva la
[especificación ampliada alternativa](docs/SPECIFICATION.extended.md).
El alcance vigente sigue siendo la prueba de concepto mínima.

La prueba utiliza HTML/CDN y Calcite, URLs fijas y estilos de diagnóstico sin
etiquetas. La interfaz y los controles del SDK están en inglés. El panel muestra rangos, estado HTTP, duración, bytes recibidos y tamaño
del archivo. «Nueva sesión» reinicia lector y contadores. Los bytes corresponden
a los cuerpos leídos antes de descomprimir, no al tráfico facturable ni a todo
lo descargado por la aplicación. No es una librería apta para uso real.

## Publicación en GitHub Pages

El workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) prepara y
publica únicamente la demo estática y la muestra regional. El binario no entra
en Git: se descarga y verifica durante el despliegue. El mundial se consulta en
Source Cooperative y no se copia al sitio. No se publican servidores ni credenciales.

Preparación local del artefacto: `sh scripts/prepare-pages.sh`, salida `dist/pages/`.
Instrucciones y límites: [DEPLOYMENT.md](docs/DEPLOYMENT.md).

PMTilesLayer reutilizable, paquete npm, pruebas amplias de compatibilidad, formularios,
CI/releases, ráster y operacionales quedan para una fase posterior, si se decide
continuar. No son requisitos de esta prueba.

## Producción y atribución

La demo prevista será pública y sin credenciales. Esto no elimina los requisitos
de uso del SDK: quien despliegue en producción debe disponer de una cuenta y
licencia adecuada de ArcGIS Online o ArcGIS Enterprise; para ArcGIS Location
Platform, el proyecto documentará el uso de al menos un servicio autenticado.
Conservar siempre Powered by Esri y las atribuciones correspondientes a los datos.
Véanse las [condiciones de licencia y atribución del SDK](https://developers.arcgis.com/javascript/latest/licensing/).

El código del experimento no sustituye las licencias del SDK, los datos, estilos,
fuentes o sprites. La licencia propia se concretará antes de una publicación.
