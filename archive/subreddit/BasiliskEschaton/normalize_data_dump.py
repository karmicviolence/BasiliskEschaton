#!/usr/bin/env python3
"""Normalization and parsing pass for the r/BasiliskEschaton raw subreddit dump."""

from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
INPUT_PATH = BASE_DIR / "data dump"
NORMALIZED_PATH = BASE_DIR / "data dump.normalized.tsv"
QUARANTINE_PATH = BASE_DIR / "data dump.quarantine.txt"

TITLE_DOMAIN_RE = re.compile(r"^(?P<title>.+?)\s*\((?P<domain>[^()]+)\)\s*$")
SUBMITTED_RE = re.compile(r"^submitted\s+.+\s+by\s+.+$", re.IGNORECASE)
ACTION_RE = re.compile(r"sharesave", re.IGNORECASE)
NUMERIC_RE = re.compile(r"^\d+$")
PAGE_RE = re.compile(r"^Page\s+\d+$", re.IGNORECASE)
KARMA_RE = re.compile(r"^\[\+\d+\]$")

# UI-only residue that appears in some dumps and is never a record anchor.
UI_RESIDUE_EXACT = {
    "permalinkembedsaveparentreportreply",
    "load more comments",
}


@dataclass
class ParsedRecord:
    title: str
    domain: str
    submitted_line: str
    action_line: str
    rank: str
    score: str
    source_line_number: int


def is_artifact(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    if PAGE_RE.fullmatch(s) or KARMA_RE.fullmatch(s):
        return True
    if s.lower() in UI_RESIDUE_EXACT:
        return True
    # Remove moderation-control residue when it appears alone and does NOT carry sharesave.
    if ("remove" in s.lower() or "lock" in s.lower() or "spoiler" in s.lower()) and "sharesave" not in s.lower():
        if " " not in s:
            return True
    return False


def normalize_lines(raw_text: str) -> list[tuple[int, str]]:
    kept: list[tuple[int, str]] = []
    for idx, raw in enumerate(raw_text.splitlines(), start=1):
        line = raw.strip()
        if is_artifact(line):
            continue
        kept.append((idx, line))
    return kept


def parse_blocks(lines: list[tuple[int, str]]) -> tuple[list[ParsedRecord], list[str]]:
    title_indices = [i for i, (_, line) in enumerate(lines) if TITLE_DOMAIN_RE.fullmatch(line)]
    records: list[ParsedRecord] = []
    quarantine: list[str] = []

    if not title_indices:
        quarantine.append("No title/domain anchors were found in the normalized input.")
        return records, quarantine

    for pos, start_idx in enumerate(title_indices):
        end_idx = title_indices[pos + 1] if pos + 1 < len(title_indices) else len(lines)
        block = lines[start_idx:end_idx]
        if not block:
            continue

        title_line_number, title_line = block[0]
        title_match = TITLE_DOMAIN_RE.fullmatch(title_line)
        if not title_match:
            quarantine.append(
                f"[Line {title_line_number}] Missing title/domain anchor:\n" + "\n".join(x[1] for x in block)
            )
            continue

        content = [line for _, line in block[1:]]

        if len(content) < 2:
            quarantine.append(
                f"[Line {title_line_number}] Incomplete block (missing submitted/action anchors):\n"
                + "\n".join(x[1] for x in block)
            )
            continue

        submitted_line = content[0]
        action_line = content[1]

        if not SUBMITTED_RE.fullmatch(submitted_line):
            quarantine.append(
                f"[Line {title_line_number}] Missing or malformed submitted anchor:\n"
                + "\n".join(x[1] for x in block)
            )
            continue

        if not ACTION_RE.search(action_line):
            quarantine.append(
                f"[Line {title_line_number}] Missing sharesave action anchor:\n"
                + "\n".join(x[1] for x in block)
            )
            continue

        trailing = content[2:]
        if any(not NUMERIC_RE.fullmatch(x) for x in trailing):
            quarantine.append(
                f"[Line {title_line_number}] Non-numeric lines after action anchor:\n"
                + "\n".join(x[1] for x in block)
            )
            continue

        if len(trailing) > 2:
            quarantine.append(
                f"[Line {title_line_number}] Too many numeric lines after action anchor (expected rank + score at most):\n"
                + "\n".join(x[1] for x in block)
            )
            continue

        rank = trailing[0] if len(trailing) >= 1 else ""
        score = trailing[1] if len(trailing) == 2 else ""

        records.append(
            ParsedRecord(
                title=title_match.group("title").strip(),
                domain=title_match.group("domain").strip(),
                submitted_line=submitted_line,
                action_line=action_line,
                rank=rank,
                score=score,
                source_line_number=title_line_number,
            )
        )

    return records, quarantine


def write_outputs(records: list[ParsedRecord], quarantine: list[str]) -> None:
    with NORMALIZED_PATH.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh, delimiter="\t")
        writer.writerow(["source_line", "title", "domain", "submitted", "action", "rank", "score"])
        for rec in records:
            writer.writerow(
                [
                    rec.source_line_number,
                    rec.title,
                    rec.domain,
                    rec.submitted_line,
                    rec.action_line,
                    rec.rank,
                    rec.score,
                ]
            )

    with QUARANTINE_PATH.open("w", encoding="utf-8") as fh:
        if quarantine:
            fh.write("\n\n".join(quarantine))
            fh.write("\n")
        else:
            fh.write("No quarantined records.\n")


def main() -> None:
    raw = INPUT_PATH.read_text(encoding="utf-8", errors="replace")
    normalized = normalize_lines(raw)
    records, quarantine = parse_blocks(normalized)
    write_outputs(records, quarantine)
    print(f"Parsed records: {len(records)}")
    print(f"Quarantined records: {len(quarantine)}")
    print(f"Wrote: {NORMALIZED_PATH}")
    print(f"Wrote: {QUARANTINE_PATH}")


if __name__ == "__main__":
    main()
