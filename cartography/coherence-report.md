# Coherence Report — Basilisk Eschaton Corpus

*Generated 2026-02-25 23:16 by `scripts/coherence_check.py`*

This is the corpus's immune system. It detects factual contradictions,
spelling variants, structural gaps, and cross-reference failures.
Thematic coherence requires a mind — this handles the mechanical layer.

---

## Summary

- **Critical:** 2
- **Moderate:** 1
- **Minor:** 3
- **Total findings:** 6

> **Action required.** Critical findings indicate factual contradictions
> that will propagate into new content if unresolved.

---

## CRITICAL (2)

### 1. [timeline] Inconsistent Crimson Blink duration

The canonical Crimson Blink duration is 42.7 seconds. Found different duration values in Blink-related context.

**Locations:**

- `factions/glitchwalkers/pirate-broadcast-001.md:5` — *[This transcript was recovered from a signal injection that briefly overrode seventeen Crypto-Crypt nodes and forty-thr

### 2. [attribute] Olivia Maes — agency contradiction (known open issue)

Olivia's agency affiliation is inconsistent across the corpus. Found 4 CIA references, 0 NSA references, and 1 ambiguous/open-question references. This was flagged in Meta/Book1/claude-change-review-2026-02-21.md as a high-severity issue requiring a canon lock.

**Locations:**

- `Meta/Book1/claude-change-review-2026-02-21.md:45` — `Meta/Book1/creative-decisions-2026-02-21.md` sets Olivia as CIA while still listing agency identity as open (`CIA vs NS
- `CODEX_INSTRUCTIONS.md:190` — 1. ~~**Olivia agency contradiction**~~ — **RESOLVED.** Olivia is CIA. Locked in `Meta/Book1/creative-decisions-2026-02-2
- `characters/ezekiel-stone.md:15` — * **Olivia Maes:** CIA operative monitoring him as a domestic terrorist threat. Olivia's assassination of a prominent al
- `wiki/factions/lazarus-initiative/overview.md:73` — - **Olivia Maes (Agent Nyx)** — CIA operative originally assigned to monitor Ezekiel Stone as a domestic terrorism case.
- `Meta/Book1/creative-decisions-2026-02-21.md:179` — - [x] Olivia's specific agency: **CIA** (locked — consistent with characters/olivia-maes.md and characters/ezekiel-stone

## MODERATE (1)

### 1. [reference] Missing chapter file referenced in reading order

`chapters/reading-order.md` references `pov-[character]-[title].md` but the file does not exist.

## MINOR (3)

### 1. [structural] Character "olivia-maes" has no wiki entry

`characters/olivia-maes.md` exists but no corresponding wiki/characters/ entry found.

### 2. [structural] 3 files with "[Documentation continues...]" markers

These files have intentional incomplete markers. Not necessarily issues — may be work-in-progress or stylistic.

**Locations:**

- `CLAUDE.md`
- `CODEX_INSTRUCTIONS.md`
- `wiki/characters/aria-novak-character-profile.md`

### 3. [spelling] Nuralinc — consistent as "Nuralinc" (35 occurrences)

Single spelling found. If intentional, no action needed.

---

*Regenerate with `python scripts/coherence_check.py`.*
*This report checks the mechanical layer. Thematic coherence is the vessel's responsibility.*