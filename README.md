# arcgis-pmtiles-layer

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

**Estado: PoC comprobada en ArcGIS 5.1 y Chrome.** Se representan teselas de un
archivo PMTiles con ArcGIS, mediante un interceptor público y sin MapLibre.

Para ejecutarla desde la raíz:

```sh
sh scripts/download-data.sh
python3 scripts/serve.py
```

Abrir http://127.0.0.1:8000/. Se requiere conexión a los CDN, sin claves ni npm.
El archivo regional (6,6 MB) se descarga aparte. Consultar el
[informe y sus límites](docs/POC_RESULTS.md) y la [captura](docs/evidence/firenze.jpg).

Lectura recomendada:

1. [Especificación de la prueba de concepto](docs/SPECIFICATION.md).
2. [Investigación y alternativas de arquitectura](docs/RESEARCH.md).
3. [Plan y criterios de aceptación](docs/PLAN.md).
4. [Configuración propuesta](docs/PROJECT_SETUP.md).
5. [Memoria de decisiones](docs/MEMORY.md) y [tareas](docs/TODO.md).

Para una posible continuación, se conserva la
[especificación ampliada alternativa](docs/SPECIFICATION.extended.md).
El alcance vigente sigue siendo la prueba de concepto mínima.

La prueba utiliza un HTML con ArcGIS 5.1 desde CDN, el archivo regional de ejemplo
de Florencia de Protomaps y un estilo sencillo con URLs fijas, sin panel avanzado.
Se han comprobado renderizado, navegación y lecturas parciales del archivo;
no es una librería apta para uso real.

PMTilesLayer reutilizable, paquete npm, pruebas amplias de compatibilidad, UI,
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
