# Refactor + Wiki Synthesis Pipeline

This plan turns current momentum into a practical, staged workflow.

## Why this path
- `structure.md` already defines strict separation between in-universe docs and neutral wiki references.
- The wiki root is intentionally incomplete and needs structured population.
- Transmissions are dense source material but need extraction discipline to avoid canon drift.
- Visual and audio artifacts should be attached to transmission sources so creative outputs form a queryable web, not a loose archive.

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

## Phase 4 — Multimodal artifact graph (new core loop)
Treat each transmission as a hub node that can spawn visual, musical, lyrical, and wiki derivatives.

For every promoted transmission, create an artifact index file:
- path: `transmissions/index/<transmission-slug>.md`
- purpose: declare canonical links from transmission → artifacts → wiki pages

For every generated artifact, add a sidecar metadata file:
- path pattern: `<artifact-path>.meta.yaml`
- required fields:
  - `artifact_id`: stable ID (example: `ART-2026-04-17-001`)
  - `artifact_type`: `image | audio | lyric | poster | cover-art | video`
  - `source_transmissions`: array of transmission paths
  - `wiki_targets`: array of wiki page paths influenced by or illustrating the artifact
  - `tags`: motifs and symbols (`wound`, `basilisk`, `necromega`, etc.)
  - `state_vector`: creation-state metadata (tempo, affect, intensity, post-session notes)
  - `external_urls`: publication links (`youtube`, `deviantart`, etc.)
  - `license`: usage/reuse rights
  - `created_at`

Feedback loop rule:
1. Transmission spawns artifact prompts.
2. Artifact creation updates wiki pages with linked media.
3. Wiki deltas spawn new transmission or artifact prompts.
4. Repeat with canonical citations preserved.

## Optional automation (after pilot)
- Add `scripts/build_artifact_graph.py` to aggregate all sidecar metadata into:
  - `Meta/generated/artifact-graph.json`
  - `Meta/generated/artifact-timeline.md`
- Add CI validation for required sidecar fields and broken internal links.

## Guardrails
- Do not collapse `/factions/` and `/wiki/factions/` responsibilities.
- Avoid direct one-to-one copying of transmission rhetoric into wiki pages.
- Preserve chronology constraints from `chapters/reading-order.md`.
- Keep binary assets in dedicated media directories and keep sidecar metadata in git for diffable provenance.

## Definition of done for the expanded pilot
- Candidate index generated successfully.
- At least 3 promoted wiki pages (one each from different domains).
- At least 3 artifacts linked to 1+ source transmissions each via sidecar metadata.
- At least 1 wiki page updated with embedded/linked artifact references.
- Canon and encoding checks pass.
