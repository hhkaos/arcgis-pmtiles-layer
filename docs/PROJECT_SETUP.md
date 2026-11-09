# Configuración de la prueba de concepto

## Ahora

- HTML y JavaScript con ArcGIS 5.1 desde CDN, mediante HTTP local.
- Un módulo/adaptador local si es necesario y el lector pmtiles.
- Archivo y estilo conocidos con URLs fijas; sin panel avanzado.
- Navegador disponible y herramientas de inspección de red/consola.
- Documentación y memoria concisas; conservar las skills y el MCP ya configurados.
- Resolver la carga del lector sin duplicar ArcGIS y sin infraestructura de build
  innecesaria. Registrar versiones; no prometer una distribución de librería.

Configuración existente: .editorconfig, .gitignore, .codex/config.toml,
.agents/skills y skills-lock.json. No se han instalado dependencias npm.
Implementación: demo/index.html y main.js, lector pmtiles 4.5.0 por CDN,
scripts/download-data.sh y servidor local con Range en scripts/serve.py.
Instrucciones y evidencia en [POC_RESULTS.md](POC_RESULTS.md).

## Reglas de trabajo

Un experimento secuencial, verificaciones visuales/de red e informe breve.
No hacen falta agentes adicionales, worktrees, suite de tests ni configuración
CI para probar esta hipótesis. No crear formularios o controles de producto.
Después de aprobar implementación, mantener la política acordada de commits
locales en inglés por unidad coherente y verificada; sin push ni publicación
implícitos. No instalar hooks o linters solo para este experimento.

## Preferencias conservadas para una fase posterior

Si se decide crear una librería: TypeScript, npm/ESM y ejemplo CDN; Vite y Calcite
para una demo ampliada; ESLint/Prettier, Vitest/Playwright; hooks rápidos;
Conventional Commits; Changesets con entradas revisadas; Chromium por PR y tres
motores antes de release; agentes aislados cuando aporte valor. Son preferencias
anteriores, no requisitos actuales ni compromisos de continuidad.
