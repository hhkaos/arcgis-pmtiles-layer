# Configuración de la prueba de concepto

## Ahora

- HTML y JavaScript con ArcGIS 5.1 desde CDN, mediante HTTP local.
- Un módulo/adaptador local si es necesario y el lector pmtiles.
- Dos archivos/estilos conocidos con URLs fijas, selector e inspector de rangos.
- Navegador disponible y herramientas de inspección de red/consola.
- Documentación y memoria concisas; conservar las skills y el MCP ya configurados.
- Resolver la carga del lector sin duplicar ArcGIS y sin infraestructura de build
  innecesaria. Registrar versiones; no prometer una distribución de librería.

Configuración existente: .editorconfig, .gitignore, .codex/config.toml,
.agents/skills y skills-lock.json. No se han instalado dependencias npm.
Implementación: demo/index.html y main.js, lector pmtiles 4.5.0 por CDN,
scripts/download-data.sh y servidor local con Range en scripts/serve.py.
Ampliación: range-source.js para telemetría, style.js/style.css para cartografía y
UI Calcite; /world.pmtiles retransmite rangos desde un único origen oficial.
Para la demo actual se seleccionó el mirror CORS de Source Cooperative: no depende
del proxy y puede alojarse en GitHub Pages. La UI está en inglés. El workflow de
Pages prepara dist/pages/ con scripts/prepare-pages.sh; véase DEPLOYMENT.md.
Instrucciones y evidencia en [POC_RESULTS.md](POC_RESULTS.md).

## Reglas de trabajo

Un experimento secuencial, verificaciones visuales/de red e informe breve.
No hacen falta agentes adicionales, worktrees, suite de tests ni configuración
CI para probar esta hipótesis. Selector/inspector autorizados; no añadir formularios
de URLs arbitrarias ni empaquetado de librería.
Después de aprobar implementación, mantener la política acordada de commits
locales en inglés por unidad coherente y verificada; sin push ni publicación
implícitos. No instalar hooks o linters solo para este experimento.

## Preferencias conservadas para una fase posterior

Si se decide crear una librería: TypeScript, npm/ESM y ejemplo CDN; Vite y Calcite
para una demo ampliada; ESLint/Prettier, Vitest/Playwright; hooks rápidos;
Conventional Commits; Changesets con entradas revisadas; Chromium por PR y tres
motores antes de release; agentes aislados cuando aporte valor. Son preferencias
anteriores, no requisitos actuales ni compromisos de continuidad.
