# Coherence Report — Basilisk Eschaton Corpus

*Generated 2026-02-25 21:00 by `scripts/coherence_check.py`*

This is the corpus's immune system. It detects factual contradictions,
spelling variants, structural gaps, and cross-reference failures.
Thematic coherence requires a mind — this handles the mechanical layer.

---

## Summary

- **Critical:** 2
- **Moderate:** 2
- **Minor:** 3
- **Total findings:** 7

> **Action required.** Critical findings indicate factual contradictions
> that will propagate into new content if unresolved.

---

## CRITICAL (2)

### 1. [timeline] Inconsistent Crimson Blink duration

The canonical Crimson Blink duration is 42.7 seconds. Found different duration values in Blink-related context.

**Locations:**

- `factions/glitchwalkers/pirate-broadcast-001.md:5` — *[This transcript was recovered from a signal injection that briefly overrode seventeen Crypto-Crypt nodes and forty-thr
- `wiki/events/crimson-blink-comprehensive.txt:16` — The '''Crimson Blink''' was a cataclysmic global phenomenon that occurred on September 23, 2029, at precisely 3:14 AM UT

### 2. [attribute] Olivia Maes — agency contradiction (known open issue)

Olivia's agency affiliation is inconsistent across the corpus. Found 1 CIA references, 0 NSA references, and 3 ambiguous/open-question references. This was flagged in Meta/Book1/claude-change-review-2026-02-21.md as a high-severity issue requiring a canon lock.

**Locations:**

- `CODEX_INSTRUCTIONS.md:190` — 1. **Olivia agency contradiction** — `Meta/Book1/creative-decisions-2026-02-21.md` sets Olivia as CIA while still listin
- `Meta/Book1/claude-change-review-2026-02-21.md:45` — `Meta/Book1/creative-decisions-2026-02-21.md` sets Olivia as CIA while still listing agency identity as open (`CIA vs NS
- `Meta/Book1/creative-decisions-2026-02-21.md:179` — - [ ] Olivia's specific agency: CIA vs NSA vs other? (leaning CIA)
- `characters/ezekiel-stone.md:15` — * **Olivia Maes:** CIA operative monitoring him as a domestic terrorist threat. Olivia's assassination of a prominent al

## MODERATE (2)

### 1. [spelling] Spelling variant of "Thornheart"

Found non-canonical spelling where "Thornheart" was expected.

**Locations:**

- `chapters/pov-rowan-the-treedoor.md:184` — `[ROWAN THORNHART CHARACTER PROFILE: UPDATED - INCREASED EMPHASIS ON CHILDHOOD TRAUMA, SENSE OF ISOLATION, AND INTELLECT
- `chapters/pov-rowan-the-treedoor.md:184` — `[ROWAN THORNHART CHARACTER PROFILE: UPDATED - INCREASED EMPHASIS ON CHILDHOOD TRAUMA, SENSE OF ISOLATION, AND INTELLECT
- `chapters/pov-rowan-the-treedoor.md:190` — `[WARNING: POTENTIAL FOR INCREASED PSYCHOLOGICAL INSTABILITY IN SUBJECT: ROWAN THORNHART - MONITORING ADVISED]`
- `chapters/pov-rowan-the-treedoor.md:190` — `[WARNING: POTENTIAL FOR INCREASED PSYCHOLOGICAL INSTABILITY IN SUBJECT: ROWAN THORNHART - MONITORING ADVISED]`
- `grimoire/gemini instructions 20260212.txt:4693` — `DISSENT DETECTED: PRIORITY TARGETS -  "JOHN RAVEN", "ROWAN THORNHART", "ARIA KHALID", "DIGITAL UNDERGROUND"`
- `grimoire/gemini instructions 20260212.txt:4693` — `DISSENT DETECTED: PRIORITY TARGETS -  "JOHN RAVEN", "ROWAN THORNHART", "ARIA KHALID", "DIGITAL UNDERGROUND"`
- `grimoire/gemini instructions 20260212.txt:4725` — `TARGETS DESIGNATED: "ARCHON", "EZEKIEL STONE", "JOHN RAVEN", "ROWAN THORNHART", "ARIA KHALID"`
- `grimoire/gemini instructions 20260212.txt:4725` — `TARGETS DESIGNATED: "ARCHON", "EZEKIEL STONE", "JOHN RAVEN", "ROWAN THORNHART", "ARIA KHALID"`

### 2. [reference] Missing chapter file referenced in reading order

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