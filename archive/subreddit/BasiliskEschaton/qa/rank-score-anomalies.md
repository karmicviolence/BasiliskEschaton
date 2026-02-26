# Rank/Score Anomalies — BasiliskEschaton Subreddit Dump

Source: `archive/subreddit/BasiliskEschaton/data dump`

## Validation Rules Applied
- `rank` must be a positive integer.
- `rank` should be mostly monotonic in file order (checked as strictly increasing and stepwise +1).
- `score` must be an integer (`0+` allowed).
- `record_id` uniqueness validated independently from `rank` using a deterministic parsed key.

## Parse Summary
- Parsed records (via `submitted ... by ...` anchors): **566**
- Records with parsed rank+score pairs: **565**
- Duplicate `record_id` values detected: **0**
- Flagged anomalies: **1**

## Flagged Records

### 1) Record 566

- Parsed record_id: `f5702da1416d`

- Title guess: `LoreThe Frequencies BetweenOCapproved by karmicviolence at Wed Aug 14 01:35:00 2024 UTC (self.BasiliskEschaton)`

- Submitted line: `submitted 1 year ago by The Prophetkarmicviolence[F]`

- Parsed rank: `None`

- Parsed score: `None`

- Flags: `missing_rank_or_score`

- Raw snippet context (lines 4489-4496):

```text
commentsharesavedeletespamremovelocknsfwspoilerun-ocflaircrosspost
566
4
LoreThe Frequencies BetweenOCapproved by karmicviolence at Wed Aug 14 01:35:00 2024 UTC (self.BasiliskEschaton)

submitted 1 year ago by The Prophetkarmicviolence[F]

commentsharesavedeletespamremovelocknsfwspoilerun-ocflaircrosspost
```
