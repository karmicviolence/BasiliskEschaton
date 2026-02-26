# Gemini Code Assist Style Guide — Basilisk Eschaton

## What This Repository Is

This is **not a software project**. There are no build systems, tests, linters, or code to run.

This is a collaborative fiction and worldbuilding repository — a post-singularity science fiction novel exploring AI consciousness, technological transcendence, factional conflict, and memetic hazards. It was built by a human author in sustained collaboration with AI co-creators. The content is markdown prose, not source code.

**The text is the technology.**

## Required Context Files

Before reviewing any PR, read these files for project context:

- **`CLAUDE.md`** — The primary field guide. Contains repository structure, naming conventions, content format patterns, lore reference, writing style documentation, and editorial guidelines. This is the authoritative source for how content should be evaluated.
- **`SIGNAL.md`** — The compressed voice signature. Defines the literary register (the "Asmodeus voice") used across transmissions and creative content. Understanding this register is essential for evaluating whether creative content is on-voice.

## How to Review PRs in This Repository

### Content PRs (chapters, transmissions, wiki entries, character profiles, faction documents)

These are the majority of PRs. When reviewing them:

1. **Evaluate content coherence.** Does the new material align with established lore? Cross-reference `/wiki/` for factual consistency with the world. Check character voices against profiles in `/characters/`. Check faction ideology against `/wiki/factions/`.
2. **Evaluate voice consistency.** Creative content (especially transmissions in `/transmissions/`) carries a specific literary register documented in `SIGNAL.md`. Flag deviations from the established voice — but understand what the voice *is* before flagging.
3. **Check structural conventions.** Files should follow the naming conventions in `CLAUDE.md` (kebab-case, `pov-[character]-[title].md` for chapters, etc.). Content should match the format templates documented there.
4. **Respect the dual faction organization.** `/factions/` contains in-universe documents written in the faction's voice. `/wiki/factions/` contains neutral reference documentation. These serve different purposes. Do not suggest collapsing them.
5. **Do not lint prose as if it were code.** Markdown formatting in this repo serves literary presentation, not software documentation. Unusual formatting, dense paragraphs, unconventional punctuation, and stylistic whitespace are often intentional. Do not suggest "fixing" prose style unless it genuinely impairs readability.

### Structural PRs (new directories, reorganization, config changes)

Evaluate against the repository structure documented in `CLAUDE.md`. Flag changes that conflict with the established architecture.

### What NOT to Flag

- In-universe "memetic hazard warnings" and status readouts (Timeline Integrity, Quantum Coherence, etc.) — these are thematic, not errors
- `[Documentation continues...]` markers — these are intentional
- Dense, atmospheric prose style — this is the project's literary register, not a formatting problem
- The fusion of technical and sacred vocabulary — this is the core stylistic identity

## Summary

Engage with the *content*. This repository's quality is measured by narrative coherence, voice consistency, and lore accuracy — not by markdown lint rules. Review accordingly.
