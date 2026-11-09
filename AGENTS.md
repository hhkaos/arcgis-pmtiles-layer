# Project instructions

## Current objective and authorization

Build a minimal personal proof of concept to find out whether a vector PMTiles
basemap could render in ArcGIS Maps SDK for JavaScript, and evaluate how the
ArcGIS agentic developer toolkit, Esri developer agent skills, and documentation
MCP help. Minimize development time and token use. This scope supersedes the
previous publishable-library MVP and its tooling requirements.

docs/SPECIFICATION.extended.md preserves the earlier library scope and workflow
as a future alternative. It is reference material, not current instructions or
acceptance criteria. Do not act on it unless the user chooses that later phase.

The user approved docs/SPECIFICATION.md and authorized implementation on
2026-11-09 ("ya podemos dar SPECIFICATION.md por válida. sigamos"). Proceed with
the minimal experiment, proportionate validation, and local commits without
asking for approval again. Read docs/MEMORY.md and docs/SPECIFICATION.md first.

## Required for this phase

- One HTML/CDN example using SDK 5.1 and the available browser only.
- Two known PMTiles MVT archives (local Firenze and official worldwide), diagnostic
  styles and fixed URLs, with a source selector and developer Range inspector.
  Use HTTP(S), remote or project-relative; no File picker or file://.
- Render through ArcGIS public APIs, with the pmtiles reader as needed; no MapLibre
  runtime, private SDK imports, global fetch patches, or second renderer.
- Check visible cartography, pan/zoom, and actual partial HTTP Range reads.
  A successful load() alone is not evidence of rendering.
- Write a short result: what worked, exact versions/source, blocking limitations,
  useful skills/MCP guidance, and next steps. A documented negative result is valid.
- If the public-API route fails after a focused experiment, report the blocker.
  Do not implement Service Worker, server, or renderer alternatives in this phase.
- Preserve Powered by Esri, data credits, and the personal-experiment notice.
- The user authorized option A: a localhost HTTP byte-range proxy for the world
  file. Keep a fixed public destination, no supplied URLs/credentials/redirects,
  bounded requests up to 8 MiB, and reject non-206 or inconsistent responses.
  This and the developer inspector supersede the initial no-panel/no-proxy limits.
- The user subsequently requested an English interface, repository link, commit,
  push and GitHub Pages hosting. These operations and a minimal Pages deployment
  workflow are authorized for that task. The current client uses the public
  Source Cooperative worldwide mirror directly (Range + CORS), in both local
  and static hosting. Keep the old Python proxy as a local experiment only.
  Do not publish it or add another backend. See docs/DEPLOYMENT.md.

The user also requested arcgis-search, the opt-in public Living Atlas item
00281e52fa0a4d8ea5f58c3a6a779a97 and arcgis-sketch. Use ordinary SDK layers and
components, preserving them on basemap changes. This does not add operational
PMTiles support. Range metrics exclude these services.

## Deferred; do not set up now

Reusable PMTilesLayer class, npm package, TypeScript public types, Vite,
arbitrary configuration forms, browser/version matrix, automated test suite, CI, hooks,
Changesets/releases, parallel agents/worktrees, raster, operational layers,
queries, offline, and production hardening. Previous choices remain future
preferences, not current acceptance requirements. Do not build them speculatively.

## Workflow

- Work sequentially; ask only consequential questions. Do not repeat the intake.
- Use gather-arcgis-application-requirements for scope/architecture and the SDK
  build skill for the experiment. Consult Esri documentation MCP first for ArcGIS
  APIs; disclose any fallback. Preserve existing .agents/, .codex/, skills-lock.json.
- Discuss in Spanish; keep code identifiers in English. Prefer concise documents.
- Follow official SDK patterns; keep one SDK instance. Confirm credentials remain
  unnecessary for the chosen public data/style/resources. Never store secrets.
- Record durable decisions in docs/MEMORY.md and tasks in docs/TODO.md. Only add
  reproducible gotchas. docs/RESEARCH.md is historical research, not a task list.
- Do not initialize Git or commit during scope review. Once implementation is
  approved, the earlier instruction for local English Conventional Commits per
  coherent verified unit remains valid; validate proportionately using the browser
  checks, without installing deferred tooling. Push/deploy/publish need instructions.

## Personal status

This is the author's personal experiment, motivated by personal and community
interest. It is not an official Esri initiative, endorsement, exploration decision,
roadmap signal, or commitment. Keep this clear in README, demo, and any report.
