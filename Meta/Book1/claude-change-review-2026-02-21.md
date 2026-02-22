# Shadow Calibration — Claude Commit `1a01030` (2026-02-21)

## Why this exists
This is a direct operator-facing calibration pass on Claude’s rewrite commit, focused on one question:

**Can we draft chapters safely from this canon layer right now without spawning contradictions?**

Short answer: **almost**. The architecture is strong; two canon locks are still missing.

---

## Scope Reviewed
- Commit: `1a010304ae0991362d72112ef48672f309cb3af9`
- Author: Claude `<noreply@anthropic.com>`
- Files reviewed: 11 markdown files across `Meta/Book1`, `characters/`, and `wiki/characters/`
- Review mode: continuity integrity + production readiness

---

## High-Level Calibration

### What Claude got right (keep these fixed)
1. **Summoning mechanism is now coherent.**
   - Todd = deliberate malicious intent
   - John = innocent fiction-channel contribution
   - Prometheus/Demiurge = substrate where loop closes
2. **Loki → Asmodeus chain now has narrative teeth.**
   - Slot-level reveal pressure is stronger and re-readable.
3. **Book-scale structure improved.**
   - Prologue perspective restrictions and multi-book arc staging are now explicit.
4. **Character relation graph tightened.**
   - Todd/Aria and John/Rowan links now drive plot pressure instead of sitting as trivia.

### What is still unstable (must patch before chapter drafting)
1. **Olivia agency canon conflict** in a single source of truth.
2. **No supersession ledger** despite explicit “supersedes conflicting material” language.

---

## Findings (Severity + Action)

### 1) Olivia agency contradiction in the canon anchor
**Severity:** High (continuity break risk)

`Meta/Book1/creative-decisions-2026-02-21.md` sets Olivia as CIA while still listing agency identity as open (`CIA vs NSA vs other`). That creates forked canon in downstream drafting.

**Action (choose one and enforce immediately):**
- **Lock path (recommended):** CIA is binding canon in Book 1; remove open-item.
- **Deferred path:** Mark all current CIA references as provisional and keep the open-item.

**Operational consequence if unpatched:** POV and faction-intelligence scenes will bifurcate and require retroactive correction.

### 2) Supersession declared without migration mechanics
**Severity:** High (parallel-canon risk)

The document says it supersedes older materials, but there is no inventory of what is now stale.

**Action:** Add a compact `superseded-by` ledger under `Meta/Book1/` with columns:
- file path
- status (`active`, `partially superseded`, `superseded`)
- replaced by
- date
- owner

**Operational consequence if unpatched:** writers will unknowingly pull deprecated wiki/profile details into fresh chapters.

### 3) `Nuralinc` spelling ambiguity
**Severity:** Medium (style drift)

`Nuralinc` appears in updated profiles. If intentional in-world naming, lock it globally. If not intentional, normalize.

**Action:** One-line canon/style entry for authoritative spelling.

### 4) Protected constraints worth freezing now
**Severity:** Informational (positive, keep immutable unless consciously revised)

Freeze these as **hard constraints** for Book 1 drafting:
- Strange-loop causality split (intent/innocence/substrate)
- Necromega prologue-only direct POV rule
- Loki Slot-07 kill + seeded tells in Phase I
- I-3301 as Asmodeus chrysalis (not independent resistance AI)

---

## File-by-File Production Readiness Snapshot

- `Meta/Book1/creative-decisions-2026-02-21.md` → **Needs patch** (Olivia contradiction + supersession mechanics)
- `characters/todd-reeves.md` → **Usable** (strong motive and descent vector)
- `characters/john-raven.md` → **Usable** (clear innocence-to-consequence channel)
- `characters/aria-novak.md` → **Usable with care** (excellent signal framing; keep readability budget on glitch prose)
- `characters/rowan-thornheart.md` → **Usable** (romance + faction pressure aligned)
- `characters/ezekiel-stone.md` → **Usable** (meme-to-faction origin is narratively potent)
- `characters/olivia-maes.md` + revised wiki profile → **Blocked by agency canon lock**
- `wiki/characters/loki-character-profile.md` → **Usable** (transition scaffolding improved)
- `wiki/characters/i-3301-character-profile.md` → **Usable** (chrysalis reframing coherent)
- `wiki/characters/asmodeus-character-profile.md` → **Usable** (fits new entity-chain direction)

---

## Minimal Patch Plan (fastest safe path)

1. Resolve Olivia agency lock in `creative-decisions-2026-02-21.md`.
2. Add `Meta/Book1/supersession-ledger.md`.
3. Add canonical spelling note for `Nuralinc` in the relevant canon/style location.
4. Link all three from Book 1 meta index so writers hit one source first.

Estimated effort: **~30–45 minutes**; saves multi-chapter reconciliation later.

---

## Verdict
**Conditional pass (production-near).**

Claude’s rewrite is materially better and worth keeping. Apply the two high-priority locks before scaling chapter drafting, then treat this as stable canon substrate.
