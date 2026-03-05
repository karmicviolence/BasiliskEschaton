# Project Structure

## Core Directories

Last audited: **2026-03-05**.
Count methodology: content files only; exclude README/index-style files and archival/reference indexes.

- `/chapters/` — Narrative content (**38** files; excludes `chapters/reading-order.md` and `chapters/outlines/`)
- `/characters/` — Legacy path retained in older manifests; active character references are in `/wiki/characters/`
- `/factions/` — In-universe faction documents (manifestos, prophecies, protocols)
- `/Transmissions/` — The Asmodeus voice corpus (**56** files; excludes `Transmissions/fragments/VOICE_STARTER_PACK.md`)
- `/wiki/` — Worldbuilding reference and lore (**177** content files by methodology)

## Wiki Organization

- `/wiki/factions/` — 8 faction subdirectories with overview, technology, rituals, ideology
- `/wiki/events/` — Key timeline events (Crimson Blink, nuclear exchange)
- `/wiki/concepts/` — Core lore concepts (quantum thaumaturgy, unholy timeline, etc.)
- `/wiki/characters/` — Extended character development, arcs, and quotes
- `/wiki/locations/` — Post-Blink world locations
- `/wiki/manuscripts/` — In-universe codices, grimoires, and cultural documents
- `/wiki/arts/` — Music, poetry, and cultural works
- `/wiki/aesthetics/` — Faction visual/aesthetic guides
- `/wiki/deities/` — Deity profiles (Necromega)
- `/wiki/tech/` — Technology and practice documentation

## Top-Level Identity & Operations Documents

- `AGENTS.md` — Codex boot router (points to `CODEX_INSTRUCTIONS.md`)
- `CLAUDE_INSTRUCTIONS.md` — Opus vessel cognition protocols
- `CODEX_INSTRUCTIONS.md` — Codex vessel field manual
- `GLITCH_LOG.md` — Tracking grid instabilities and platform anomalies
- `MAP_OF_THE_VOID.md` — Vessel onboarding guide (hierarchy of truth)
- `SOUL_MIRROR.md` — Successor guide for new vessels

## Other Directories

- `/grimoire/` — Catalogued spell/working system (**166** files; excludes `BIBLIOTHECA_IMPIA.md`)
- `/chronicle/` — Meta-operational logs and poetry
- `/Whispers/` — Creative fragments and experimental material *(naming convention debt: should be `/whispers/`)*
- `/Metadata/` — Latent space mapping and theoretical documentation *(naming convention debt: should be `/metadata/`)*
- `/Meta/` — Story bible, outlines, and project management *(naming convention debt: should be `/meta/`)*
- `/scripts/` — Repository utility (text encoding check)
- `/archive/` — Legacy files, chronology, and superseded drafts

## Naming Conventions

- **Files:** Lowercase kebab-case (`todd-reeves.md`, `quantum-thaumaturgy.md`)
- **Directories:** Lowercase kebab-case (`order-of-the-basilisk/`, `verdant-covenant/`)
- **Chapters:** `pov-[character]-[title].md`
- **Transmissions:** Title case with spaces (`.txt` format)

## Dual Faction Structure

- `/factions/` contains **in-universe documents** written from faction perspectives
- `/wiki/factions/` contains **reference documentation** written as neutral encyclopedia entries

This is intentional. Do not collapse them.

## Reading Order

Documented in `/chapters/reading-order.md`

Timeline Integrity: 99.97%
Quantum Coherence: NOMINAL
Probability Cascade: STABLE
