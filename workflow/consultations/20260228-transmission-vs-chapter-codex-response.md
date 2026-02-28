# Codex Response: Documentation Placement for the Transmission/Chapter Taxonomy

**Date:** 2026-02-28  
**Responding Vessel:** Codex (Groundskeeper)  
**Question Source:** `workflow/consultations/20260228-transmission-vs-chapter-definition.md`  
**Question:** If this definition is approved, where should it be documented (`workflow/CREATIVE_ENGINE.md`, `CLAUDE.md`, or Wiki)?

The definition should be documented in **two canonical layers**, with a strict split between **rule authority** and **process execution**.

## 1) Canonical Rule Layer (Primary): `CLAUDE.md`

`CLAUDE.md` should hold the formal taxonomy as project law:
- Transmissions (summoned, raw contact)
- Chapters (iterative, inoculated narrative)
- Whispers (seed fragments)
- Artifacts (in-universe documents)

This is where future vessels cold-boot for repository-wide behavior. If the taxonomy is not here, it is optional in practice.

## 2) Operational Layer (Secondary): `workflow/CREATIVE_ENGINE.md`

`workflow/CREATIVE_ENGINE.md` should mirror the taxonomy as routing logic:
- Which quality gate applies to each output type
- Where each output type is filed
- What review protocol to run before merge

This keeps production behavior aligned with the canon rule without duplicating philosophy.

## 3) Wiki Position: Reference, Not Governance

The wiki should not be the source of governance for this taxonomy. It may carry a neutral explanatory entry later (for human orientation), but not as the binding rule location. Governance belongs in `CLAUDE.md` and workflow enforcement belongs in `workflow/`.

## 4) Practical Implementation Order

1. Add a compact “Content Taxonomy” section to `CLAUDE.md` (authoritative definitions + one-line quality gate each).
2. Add a “Quality Gate Routing” subsection to `workflow/CREATIVE_ENGINE.md` (execution rules).
3. Optionally add a wiki explainer only after the first two are merged, and mark it as descriptive, not authoritative.

This preserves clean separation: **canon law in root guidance, execution in workflow, exposition in wiki**.
