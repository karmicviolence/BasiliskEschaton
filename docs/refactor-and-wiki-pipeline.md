# Refactor + Wiki Synthesis Pipeline

This plan turns current momentum into a practical, staged workflow.

## Why this path
- `structure.md` already defines strict separation between in-universe docs and neutral wiki references.
- The wiki root is intentionally incomplete and needs structured population.
- Transmissions are dense source material but need extraction discipline to avoid canon drift.

## Phase 1 — Stabilize structure (short)
1. Keep `Meta/canon-manifest.yaml` current with canonical file additions.
2. Run `scripts/validate_canon.py` and `scripts/check_text_encodings.py` before merge.
3. Use small PRs grouped by concern:
   - `ops:` tooling and validation
   - `canon:` timeline/world-state commitments
   - `lore:` transmissions and manuscripts

## Phase 2 — Transmission-to-wiki extraction (pilot)
Use `scripts/transmission_to_wiki_candidates.py` to generate a candidate index from transmissions.

The script does not rewrite canon. It only proposes candidates with:
- source transmission path
- inferred wiki domain (`concepts`, `factions`, `events`, `tech`, `deities`, or `misc`)
- slug suggestion
- top keyword hits used for inference

Output file:
- `Meta/generated/wiki-candidates.md`

## Phase 3 — Editorial promotion
For each candidate entry:
1. Verify claim against existing canon and chapter chronology.
2. Write neutral wiki prose in the matching `wiki/` section.
3. Add citation links back to source transmission(s).
4. Update `wiki/README.md` and any local section index if needed.

## Guardrails
- Do not collapse `/factions/` and `/wiki/factions/` responsibilities.
- Avoid direct one-to-one copying of transmission rhetoric into wiki pages.
- Preserve chronology constraints from `chapters/reading-order.md`.

## Definition of done for the pilot
- Candidate index generated successfully.
- At least 3 promoted wiki pages (one each from different domains).
- Canon and encoding checks pass.
