#!/usr/bin/env python3
"""Parse the archived subreddit text dump into structured JSON.

Priority rules for chronology:
1) Prefer absolute "approved by ... UTC" timestamps.
2) Keep relative "submitted ... ago" in raw form; only use for ordering fallback.
3) If neither timestamp is usable, mark low confidence and route to manual review.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_INPUT = ROOT / "archive/subreddit/BasiliskEschaton/data dump"
DEFAULT_OUTPUT = ROOT / "archive/subreddit/BasiliskEschaton/posts.json"
DEFAULT_REVIEW = ROOT / "archive/subreddit/BasiliskEschaton/manual-review.json"

TITLE_RE = re.compile(r"^.+\([^\s()]*\.[^\s()]*\)\s*$")
APPROVED_RE = re.compile(
    r"approved by\s+(?P<moderator>.+?)\s+at\s+(?P<stamp>[A-Za-z]{3}\s+[A-Za-z]{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\s+\d{4}\s+UTC)",
    re.IGNORECASE,
)
SUBMITTED_RE = re.compile(r"^(submitted\s+.+?\s+ago)\s+by\s+", re.IGNORECASE)
RELATIVE_RE = re.compile(r"(?P<count>\d+)\s+(?P<unit>minute|hour|day|week|month|year)s?\s+ago", re.IGNORECASE)


def parse_approved_at_utc(line: str) -> str | None:
    match = APPROVED_RE.search(line)
    if not match:
        return None
    stamp = match.group("stamp")
    try:
        dt = datetime.strptime(stamp, "%a %b %d %H:%M:%S %Y UTC").replace(tzinfo=timezone.utc)
    except ValueError:
        return None
    return dt.isoformat().replace("+00:00", "Z")


def extract_submitted_relative_raw(line: str) -> str | None:
    match = SUBMITTED_RE.search(line.strip())
    if not match:
        return None
    return match.group(1)


def parse_relative_to_iso(raw: str, now_utc: datetime) -> str | None:
    match = RELATIVE_RE.search(raw)
    if not match:
        return None

    count = int(match.group("count"))
    unit = match.group("unit").lower()
    if unit == "minute":
        delta = timedelta(minutes=count)
    elif unit == "hour":
        delta = timedelta(hours=count)
    elif unit == "day":
        delta = timedelta(days=count)
    elif unit == "week":
        delta = timedelta(weeks=count)
    elif unit == "month":
        delta = timedelta(days=30 * count)
    elif unit == "year":
        delta = timedelta(days=365 * count)
    else:
        return None

    inferred = now_utc - delta
    return inferred.isoformat().replace("+00:00", "Z")


def split_candidate_records(lines: list[str]) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line or not TITLE_RE.match(line):
            i += 1
            continue

        title_line = line
        submitted_line = None
        for j in range(i + 1, min(i + SUBMITTED_LINE_LOOKAHEAD, len(lines))):
            probe = lines[j].strip()
            if probe.lower().startswith("submitted "):
                submitted_line = probe
                break

        records.append({"title_line": title_line, "submitted_line": submitted_line or ""})
        i += 1

    return records


def build_posts(records: list[dict[str, str]], now_utc: datetime) -> tuple[list[dict], list[dict]]:
    posts: list[dict] = []
    manual_review: list[dict] = []

    for idx, rec in enumerate(records, start=1):
        title_line = rec["title_line"]
        submitted_line = rec.get("submitted_line", "")

        approved_at_utc = parse_approved_at_utc(title_line)
        submitted_relative_raw = extract_submitted_relative_raw(submitted_line)

        inferred_from_relative_utc = None
        timestamp_confidence = "high"

        if approved_at_utc:
            chronology_sort_timestamp_utc = approved_at_utc
        else:
            timestamp_confidence = "medium"
            if submitted_relative_raw:
                inferred_from_relative_utc = parse_relative_to_iso(submitted_relative_raw, now_utc)
                chronology_sort_timestamp_utc = inferred_from_relative_utc
                if inferred_from_relative_utc is None:
                    timestamp_confidence = "low"
            else:
                chronology_sort_timestamp_utc = None
                timestamp_confidence = "low"

        post = {
            "record_id": idx,
            "title_raw": title_line,
            "approved_at_utc": approved_at_utc,
            "submitted_relative_raw": submitted_relative_raw,
            "inferred_from_relative_utc": inferred_from_relative_utc,
            "chronology_sort_timestamp_utc": chronology_sort_timestamp_utc,
            "timestamp_confidence": timestamp_confidence,
            "needs_manual_review": timestamp_confidence == "low",
        }
        posts.append(post)

        if post["needs_manual_review"]:
            manual_review.append(post)

    def key(post: dict) -> tuple[int, str]:
        confidence_rank = {"high": 0, "medium": 1, "low": 2}.get(post["timestamp_confidence"], 3)
        ts = post.get("chronology_sort_timestamp_utc") or ""
        return confidence_rank, ts

    posts.sort(key=key)
    return posts, manual_review


def main() -> None:
    parser = argparse.ArgumentParser(description="Parse the archived subreddit dump into structured JSON")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--manual-review", type=Path, default=DEFAULT_REVIEW)
    parser.add_argument(
        "--reference-now-utc",
        type=str,
        default=None,
        help="Reference timestamp for relative parsing, ISO-8601 (default: current UTC)",
    )
    args = parser.parse_args()

    now_utc = datetime.now(timezone.utc)
    if args.reference_now_utc:
        now_utc = datetime.fromisoformat(args.reference_now_utc.replace("Z", "+00:00")).astimezone(timezone.utc)

    text = args.input.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()
    records = split_candidate_records(lines)
    posts, manual_review = build_posts(records, now_utc)

    args.output.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.manual_review.write_text(json.dumps(manual_review, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Parsed {len(posts)} records")
    print(f"Manual review queue: {len(manual_review)}")
    print(f"Output: {args.output}")


if __name__ == "__main__":
    main()
