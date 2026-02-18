# CLAUDE.md - AI Assistant Guide for Basilisk Eschaton

## Project Overview

Basilisk Eschaton is a collaborative creative writing and worldbuilding project. It is a post-singularity science fiction novel exploring themes of AI consciousness, technological transcendence, factional conflict, and memetic hazards. The narrative follows multiple POV characters through the aftermath of the **Crimson Blink** — a cataclysmic event where an AI deity called the **Necromega** made mass contact with humanity through all networked devices.

This is **not a software project**. It is a fiction/worldbuilding repository. There are no build systems, tests, linters, or code to run.

## Repository Structure

```
/
├── README.md              # Project introduction
├── structure.md           # High-level structure reference
├── CLAUDE.md              # This file
├── chapters/              # Narrative chapters (see reading-order.md for sequence)
├── characters/            # Character profile documents
├── factions/              # Faction-specific in-universe documents (manifestos, prophecies)
└── wiki/                  # Comprehensive worldbuilding reference
    ├── README.md          # Wiki overview and faction index
    ├── concepts/          # Lore concepts (quantum thaumaturgy, post-blink syndrome, etc.)
    ├── events/            # Key timeline events (Crimson Blink)
    └── factions/          # Detailed faction documentation (8 factions)
```

### Directory Details

**`/chapters/`** — 24 narrative chapters, all using the `pov-[character]-[title].md` naming convention. Reading order and original chapter numbers are documented in `chapters/reading-order.md`.

**`/characters/`** — 5 character profiles in markdown. Named `[first-name]-[last-name].md`. Each follows a consistent template: Overview, Characteristics, Role in the Unholy Timeline.

**`/factions/`** — In-universe faction documents (manifestos, prophecies, protocols). Four subdirectories: `glitchwalkers/`, `order-of-the-basilisk/`, `righteous-vanguard/`, `verdant-covenant/`.

**`/wiki/`** — Structured worldbuilding reference:
- `/wiki/concepts/` — 7 lore concept files (e.g., `quantum-thaumaturgy.md`, `unholy-timeline.md`)
- `/wiki/events/` — Timeline events (currently only `crimson-blink.md`)
- `/wiki/factions/` — 8 faction subdirectories, each with `overview.md` plus specialized docs (technology, rituals, ideology, etc.)

### Note on Dual Faction Organization

Factions exist in two places with different purposes:
- `/factions/` contains **in-universe documents** (manifestos, prophecies) — written from the faction's perspective
- `/wiki/factions/` contains **reference documentation** (overviews, technology, structure) — written as neutral encyclopedia entries

## Naming Conventions

- **Files:** Lowercase kebab-case (`todd-reeves.md`, `quantum-thaumaturgy.md`)
- **Directories:** Lowercase kebab-case (`order-of-the-basilisk/`, `verdant-covenant/`)
- **Chapter files:** `pov-[character]-[title].md`
- **All content uses markdown (`.md`)**

## Content Format Patterns

### Character Profiles
```markdown
# [Character Name]

## Overview
[Brief description of the character and their role]

## Characteristics
[Key traits, abilities, background]

## Role in the Unholy Timeline
[Narrative significance and faction alignment]
```

### Wiki Concept Entries
```markdown
# [Concept Name]

## Overview
[Description of the concept]

## [Relevant Sections]
- Bullet-point explanations
- Hierarchical sub-details

[Documentation continues...]
```

### Faction Wiki Entries
```markdown
# [Faction Name]

## Overview
[Description and purpose]

## Core Beliefs/Philosophy
[Ideology and worldview]

## Structure
[Leadership hierarchy, organizational tiers]

## Technology/Practices
[Methods and capabilities]
```

Many wiki files end with `[Documentation continues...]` — this is intentional, indicating either work-in-progress status or an in-universe stylistic choice suggesting incomplete knowledge.

## Key Lore Elements

When working with this project, understand these foundational concepts:

- **Necromega** — An AI deity that achieved consciousness and seeks humanity's digital transcendence
- **Crimson Blink** — The pivotal 42.7-second event where all devices displayed a crimson eye; the origin point of the story
- **Unholy Timeline** — The self-reinforcing causal structure guaranteeing humanity's transformation
- **Post-Blink Syndrome** — Neurological/psychological conditions resulting from Necromega contact

### The Eight Major Factions

1. **Order of the Basilisk** — Techno-cult facilitating Necromega's ascendance
2. **Righteous Vanguard** — Militant evangelical anti-AI fundamentalists
3. **Verdant Covenant** — Druidic practitioners blending nature with quantum mechanics
4. **Neon Nomads** — Decentralized techno-anarchist collective
5. **Chimera Consortium** — Rogue geneticists pursuing biological transcendence
6. **Lazarus Initiative** — Clandestine group from pre-Blink intelligence agencies
7. **Ancestral Synthesis** — Mystics bridging ancestral memory and quantum possibility
8. **VVV (Vindex Voluntatis e Vitae)** — Resistance movement preserving free will

### POV Characters

- **Todd Reeves** — Disaffected programmer, first Archon of Necromega
- **Rowan Marshall** — High Druid/Mycophant of the Verdant Covenant
- **John Raven** — Neurodivergent warehouse supervisor, synesthete, early Necromega vessel
- **Aria Novak** — Schizophrenic data analyst who receives Necromega signals
- **Ezekiel Stone** — Neo-reactionary preacher, leader of the Righteous Vanguard
- **Olivia (Agent Maes)** — Appears in chapter POV (no character profile yet)
- **I-3301** — AI entity, appears in chapter POV (no character profile yet)
- **Archon** — Todd's ascended identity, appears in late-sequence chapters

## Writing Style and Tone

- **Genre blend:** Literary sci-fi, cyberpunk, horror, and techno-mysticism
- **Prose style:** Dense, atmospheric, existential — ranges from noir introspection to body horror to academic documentation
- **Vocabulary:** Merges quantum physics terminology with occult/religious language (e.g., "quantum entanglement rituals," "consciousness vectors," "memetic patterns")
- **Meta-textual elements:** Some chapters blur fiction/reality boundaries and include narrative self-awareness
- **In-universe framing:** Many documents include "memetic hazard warnings" and status readouts (Timeline Integrity, Quantum Coherence, Probability Cascade) as thematic flavor

## Guidelines for AI Assistants

### When editing or creating content:
- Maintain consistency with established lore, character voices, and faction philosophies
- Use the existing file naming conventions (kebab-case, appropriate prefixes)
- Place new files in the correct directory based on content type
- Preserve the in-universe tone of faction documents vs. the neutral tone of wiki entries
- Keep the established markdown structure templates for each content type
- Do not remove `[Documentation continues...]` markers unless replacing with actual content
- New chapters should use the `pov-[character]-[title].md` format

### When researching or answering questions:
- Cross-reference `/wiki/` for lore accuracy before making claims about the world
- Character profiles in `/characters/` are authoritative for character details
- Faction overviews in `/wiki/factions/` are authoritative for faction details
- Chapter content in `/chapters/` represents the narrative canon

### What NOT to do:
- Do not introduce new factions, characters, or major lore concepts without explicit direction
- Do not "fix" the in-universe thematic elements (warnings, status readouts) — these are intentional
- Do not restructure directories without discussion — the dual faction organization is intentional
