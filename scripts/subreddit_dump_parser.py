#!/usr/bin/env python3
"""Parse the legacy Reddit text dump into a structured CSV.

The input format is the old `archive/subreddit/BasiliskEschaton/data dump` export,
where each post contains an action/moderation line that starts with either:
- `<int> comments` / `<int> comment`
- `comment...` with no leading integer

This parser extracts `comment_count` with explicit rules and preserves the full
raw action line for auditability.
"""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INPUT_PATH = ROOT / "archive" / "subreddit" / "BasiliskEschaton" / "data dump"
OUTPUT_PATH = ROOT / "archive" / "subreddit" / "BasiliskEschaton" / "data-dump-parsed.csv"

# Freshness token examples: `(16 new)`, `(1 new)`
FRESHNESS_TOKEN_RE = re.compile(r"\s*\(\d+\s+new\)\s*", re.IGNORECASE)
# Action/moderator trail markers that should not participate in comment parsing.
ACTION_TRAIL_RE = re.compile(r"sharesave|retry\s+thumb|ignore\s+reports", re.IGNORECASE)
# Rule 1: explicit integer count at the beginning of the line.
LEADING_COUNT_RE = re.compile(r"^\s*(\d+)\s+comments?\b", re.IGNORECASE)
# Rule 2: comment text with no leading integer.
LEADING_COMMENT_RE = re.compile(r"^\s*comments?\b", re.IGNORECASE)


def _normalize_action_prefix(raw_action_line: str) -> str:
    """Remove freshness tokens and trailing action/moderator tokens."""
    no_freshness = FRESHNESS_TOKEN_RE.sub(" ", raw_action_line)
    cut = ACTION_TRAIL_RE.search(no_freshness)
    if cut:
        no_freshness = no_freshness[: cut.start()]
    return no_freshness.strip()


def parse_comment_count(raw_action_line: str) -> int | None:
    """Derive comment_count using explicit parser rules.

    Rules:
    1) If line starts with `<int> comments` or `<int> comment`, use that integer.
    2) If line starts with `comment...` (no integer), use 0.
    3) Ignore parenthetical freshness `(N new)` and trailing action tokens.
    """
    normalized = _normalize_action_prefix(raw_action_line)

    m = LEADING_COUNT_RE.match(normalized)
    if m:
        return int(m.group(1))

    if LEADING_COMMENT_RE.match(normalized):
        return 0

    return None


def parse_dump(input_path: Path) -> list[dict[str, str | int]]:
    lines = input_path.read_text(encoding="utf-8", errors="replace").splitlines()
    rows: list[dict[str, str | int]] = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Heuristic: action line includes "comment" and appears before score/rank lines.
        if "comment" in line.lower():
            action_line = line
            comment_count = parse_comment_count(action_line)
            if comment_count is not None:
                title = ""
                submitted = ""

                # Backtrack to find the nearest submitted/title lines.
                j = i - 1
                while j >= 0 and not lines[j].strip():
                    j -= 1
                if j >= 0 and lines[j].strip().lower().startswith("submitted "):
                    submitted = lines[j].strip()
                    k = j - 1
                    while k >= 0 and not lines[k].strip():
                        k -= 1
                    if k >= 0:
                        title = lines[k].strip()

                rows.append(
                    {
                        "title": title,
                        "submitted_line": submitted,
                        "raw_action_line": action_line,
                        "comment_count": comment_count,
                    }
                )
        i += 1

    return rows


def write_csv(rows: list[dict[str, str | int]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["title", "submitted_line", "raw_action_line", "comment_count"],
        )
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    rows = parse_dump(INPUT_PATH)
    write_csv(rows, OUTPUT_PATH)
    print(f"Parsed {len(rows)} rows -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
