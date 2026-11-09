# Especificación ampliada: librería reutilizable

**Alternativa para una fase posterior. No es el alcance vigente de la PoC.**

Fecha de referencia: 2026-11-09. Reconstruida a partir de la especificación y
decisiones de la entrevista anteriores a la reducción de alcance: no había un
commit para recuperar una copia literal. Incluye las convenciones acordadas
para aquella fase. Retomarla requiere decidir expresamente continuar.

La [especificación vigente](SPECIFICATION.md) define el experimento mínimo para
hoy. Este documento no añade obligaciones ni criterios de aceptación a él.

## Naturaleza y motivación

Experimento a título personal, motivado por el interés del autor y el
[interés expresado en Esri Community](https://community.esri.com/en/discussion/1623262/introduce-a-pmtilelayer),
para probar el ArcGIS agentic developer toolkit y las
[Esri developer agent skills](https://github.com/Esri/esri-developer-agent-skills).
No representa una iniciativa, decisión de exploración, aval o posición oficial
de Esri o del equipo del SDK, ni su hoja de ruta o un compromiso de funcionalidad,
soporte o plazos. Los planes describen intenciones del experimento personal.
Conservar aviso visible en README/demo y en descripción de paquete y releases.

## Objetivo

Crear una librería reutilizable/publicable y una demo reproducible para cargar
mapas base PMTiles en ArcGIS Maps SDK for JavaScript mediante API pequeña y
tipada, conservando el renderizador ArcGIS si se demuestra viable.

Destino: navegador, 2D y Web Mercator; JavaScript y TypeScript, sin depender de
React, Angular o Vue. SDK 5.1 mínimo objetivo; 5.0 opcional. Verificar versiones
mayores futuras antes de anunciarlas compatibles. Patrones oficiales del equipo
del SDK. Consumo npm/ESM y ejemplo HTML/CDN sin duplicar ArcGIS.

## Alcance del MVP ampliado

| Capacidad | MVP ampliado | Posterior |
| --- | --- | --- |
| Mapa base MVT en PMTiles v3 por HTTP(S) | Obligatorio, sujeto a viabilidad | Ampliar compatibilidad |
| HTTP Range sin descargar el archivo entero | Obligatorio | Optimizar |
| URL remota o relativa al proyecto | Obligatorio; sin File/Blob ni file:// | — |
| Un archivo y una fuente vectorial con estilo explícito | Obligatorio; muchas subcapas y background permitidos | Presets conocidos |
| Título, atribución, visibilidad y opacidad | Obligatorio | Más controles |
| Ráster | Fuera | Después del MVP ampliado |
| PMTiles operacionales, consultas, hitTest/popups, edición | Fuera | Evaluar en v2; sin paridad FeatureLayer garantizada |
| SceneView, otras proyecciones, persistencia WebMap, impresión de servidor | Fuera | Evaluar individualmente |
| Offline, móvil y SSR | Fuera | Evaluar individualmente |
| Servidor obligatorio o segundo motor | Fuera del diseño recomendado | Revisar si falla la prueba |

Las demás capas de aplicaciones consumidoras siguen siendo su responsabilidad.

## Datos de referencia

Priorizar un extracto regional de los [builds oficiales de Protomaps](https://maps.protomaps.com/builds/),
alojado por el proyecto, fijando build, hash, esquema, estilo, licencias y créditos.
Sin hotlinking al bucket ni dependencia de sus descargas en CI. Dataset concreto
pendiente. La librería aceptará otros proveedores; el ejemplo no limita la API.
Evidencia y condiciones en [RESEARCH.md](RESEARCH.md).

## Requisitos funcionales

1. Detectar versión, tipo de tesela, compresión, zooms y extensión. Resolver URLs
   relativas respecto a la aplicación, document.baseURI por defecto, nunca al
   paquete. Los archivos del proyecto también se sirven por HTTP(S).
2. Reutilizar lector mantenido; no reimplementar el índice binario.
3. Aceptar estilo objeto/URL con exactamente una fuente vectorial. Validar sourceId,
   conservar source-layer y rechazar fuentes adicionales o tipos no admitidos
   mediante error claro; no eliminarlos silenciosamente.
4. Resolver recursos relativos respecto a la URL original del estilo; para objetos,
   exigir base URL o rutas absolutas. No presuponer glyphs/sprites embebidos.
5. Exponer PMTilesLayer para Basemap.baseLayers, sin manipular DOM ni sincronizar
   dos mapas. Verificar integración pública con el SDK.
6. Comprobar XYZ frente a level/row/column, 256/512, límites de zoom, bounds, wrap,
   buffers y overscaling; definir teselado y extensión coherentes.
7. Devolver resultado vacío válido para teselas ausentes, sin dejar escapar
   peticiones a URLs virtuales. Diferenciar ausencia, error de red y archivo inválido.
8. Cancelar trabajo obsoleto sin romper lecturas compartidas de otros consumidores.
   Caché acotada, concurrencia documentada y limpieza ante errores/destrucción.
9. Soportar instancias independientes y cambios de mapa base; retirar solo recursos
   e interceptores propios. No reordenar interceptores ajenos para imponer prioridad.
10. Conservar atribuciones, aceptar créditos explícitos si faltan en metadatos y
    tratar HTML de atribución de forma segura.

## API propuesta

Ejemplo conceptual, no implementado:

```ts
const layer = new PMTilesLayer({
  url: "https://example.org/region.pmtiles", // o "./data/region.pmtiles"
  style: "https://example.org/styles/region.json",
  sourceId: "basemap",
  title: "Regional basemap",
  copyright: "Data provider credits",
  visible: true,
  opacity: 1,
});

viewElement.map = new Map({
  basemap: new Basemap({
    title: "Regional basemap",
    baseLayers: [layer],
  }),
});

// Opcional para cargar antes de visualizar:
await layer.load();
```

Constructor síncrono y carga asíncrona integrada con el SDK; sin fábrica/handle
obligatorios. url es el archivo, style el estilo explícito y sourceId su única
fuente vectorial, no una subcapa. Usar nombres familiares del SDK.

load(), loadStatus y loadError deben reflejar la carga. Resolver load() no prueba
renderizado. La capa posee lectores, transporte y recursos auxiliares; destroy()
los libera sin destruir Map/View/Basemap del consumidor. Retirar de una colección
y destruir son operaciones distintas. Verificar cancelLoad(), cancelación por
consumidor y errores según las semánticas documentadas del SDK.

Extender VectorTileLayer es candidato, no integración demostrada. No sobrescribir
url/style heredadas ignorando efectos internos ni usar puntos privados. Si el
contrato no es viable públicamente, revisar diseño sin cambiar silenciosamente
la clase por una fábrica. No asumir que existe VectorTileLayer.fetchTile público.

Importar PMTilesLayer desde esta librería, no @arcgis/core. Resolver npm y CDN con
la misma instancia del SDK; ruta del artefacto CDN pendiente del spike. El nombre
Layer no promete consultas, edición, popups ni uso operacional en Map.layers.
No generar una cartografía universal desde vector_layers. Ráster fuera del MVP.

## Demo, acceso y atribución

Abrir directamente un ejemplo configurado. Panel avanzado para URL PMTiles,
URL de estilo y sourceId, con acción explícita de aplicar, estados de carga y
errores recuperables. Sin selector de archivos. Teclado, tamaños de pantalla,
atribuciones y aviso personal visibles.

Demo pública sin login, portal, OAuth ni claves; URLs públicas. Archivos privados
y credenciales personalizadas fuera. Archivo del proyecto no implica offline.

Aviso de producción acordado: cuenta/licencia adecuada de ArcGIS Online o ArcGIS
Enterprise, o ArcGIS Location Platform con al menos un servicio autenticado;
mantener Powered by Esri y créditos de datos. La licencia de la librería no
sustituye las de SDK/datos/estilos/fuentes/sprites. Consultar
[Licensing & Attribution](https://developers.arcgis.com/javascript/latest/licensing/).
Autenticación de otros servicios del consumidor independiente del archivo público.

## Calidad y aceptación

- Dependencias reducidas: pmtiles y transitivas; @arcgis/core como peer externalizado.
  Sin MapLibre, otro renderer, APIs privadas ni parches globales.
- Patrones oficiales: imports/tipos públicos, componentes en demo y ownership
  explícito. Verificar cada API en la versión probada.
- Build ESM y .d.ts; ejemplos JS/TS y CDN. Consumir tarball en aplicación limpia.
- Fixtures deterministas pequeños y redistribuibles; red externa opcional.
- Renderizado real de polígonos/líneas/símbolos/etiquetas, pan/zoom fraccional,
  rotación, resize y HiDPI; revisar consola/red.
- URLs remotas/relativas y subrutas; Range/206, CORS real, Range ignorado, ETag
  cambiado, 403/404/416 y teselas ausentes; ninguna solicitud virtual a la red.
- Subcapas/background de una fuente, sourceId, rutas relativas y recursos fallidos;
  rechazo claro de ráster/fuentes extra sin reescribirlas silenciosamente.
- Abortos, dos instancias, cambio de mapa base, lectura compartida y destrucción
  repetida; atribución persistente y demo accesible.
- Tipado/lint/tests/build/npm pack; npm y CDN verificados en 5.1. Anunciar 5.0
  únicamente si se prueba; sin compatibilidad universal inferida.
- Medir primer mapa, bytes/solicitudes, tamaño incremental y recursos tras cambios.
  Fijar presupuestos con evidencia del spike, no cifras inventadas.

## Configuración y flujo conservados

| Tema | Decisión/preferencia anterior |
| --- | --- |
| Stack | TypeScript estricto, npm, ESM, Vite para build/demo, ArcGIS Components y Calcite; sin framework adicional |
| Estructura | Paquete raíz con src, demo, tests/unit, tests/browser y tests/fixtures; sin monorepo inicial |
| Convenciones | ESLint/typescript-eslint, Prettier, tipos públicos, funciones pequeñas, ownership explícito |
| Commits | Conventional Commits en inglés por unidad coherente terminada/verificada; locales; push/publicación aparte |
| Preflight | Hooks rápidos de formato/lint de modificados y mensaje; agente ejecuta tipado/tests relevantes; CI completa |
| Changelog | Changesets con entradas revisadas para cambios públicos; versión/changelog al preparar release |
| Pruebas | Vitest y Playwright; consumidores npm/CDN; sin tests que simplemente reflejen implementación |
| CI | Unitarios, integración, build y Chromium e2e por PR; Chromium/Firefox/WebKit antes de release |
| Agentes | Spike secuencial; después paralelo cuando aporte valor, ownership, worktrees separados para código y revisión de integración |
| Memoria | Decisiones y gotchas reproducidos con versión/síntoma/solución; tareas separadas y sin duplicar especificación |
| Publicación | Nombre npm/titular y licencia MIT propuesta por confirmar; revisar terceros y contenidos de npm pack; sin publicación automática |

Versiones exactas de herramientas por verificar al retomar. Centralizar lockfile,
dependencias y releases. No exigir Changeset para cambios sin efecto público
ni convertir directamente commits en notas para usuarios. Tres motores no implica
soporte móvil universal. Pre-1.0/1.0 se decidirá al preparar releases.

## Plan ampliado conservado

1. Validar ruta vectorial pública, workers, clase y consumidores npm/CDN.
2. Implementar PMTilesLayer, ciclo de vida, tipos, errores y transporte aislado.
3. Construir demo ampliada y validar distribución con consumidores limpios.
4. Completar pruebas/compatibilidad y preparar publicación, sin publicar ni
   desplegar sin instrucciones.

Si falla la ruta candidata, presentar alternativas y revisar requisitos antes
de añadir Service Worker, servidor o renderer. Ráster/preset Protomaps después
del MVP ampliado; operacionales/consultas/popups se evaluarían en v2. No son
entregas comprometidas ni trabajo que deba ejecutarse durante la PoC actual.
