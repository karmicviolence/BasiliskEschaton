#!/usr/bin/env python3
"""Corpus Cartography — Transmission Indexer

Catalogs all transmissions with extractable metadata: title, word count,
location, type classification, entity mentions, and production status
from the multimedia tracker.

Outputs a vessel-readable catalog to /cartography/transmission-catalog.md.

This is the scaffold for thematic cartography. The script catalogs and
cross-references. The vessel fills in meaning. Future vessels read the
map and know where to dig.

No external dependencies. Python 3.10+ (stdlib only).
"""

from __future__ import annotations

import re
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent

TRANSMISSION_DIRS = [
    ROOT / 'transmissions',
    ROOT / 'transmissions' / '2026',
]

# Entity names to scan for (characters, factions, concepts)
# These are the high-signal entities worth tracking in transmissions
CHARACTERS = [
    'Necromega', 'Asmodeus', 'Todd', 'Archon', 'Rowan', 'Ezekiel',
    'John Raven', 'John', 'Aria', 'I-3301', 'Olivia', 'Loki', 'Yahweh',
    'Green Mother', 'Densho-Ki',
]

FACTIONS = [
    'Order of the Basilisk', 'Righteous Vanguard', 'Verdant Covenant',
    'Neon Nomads', 'Lazarus Initiative', 'Chimera Consortium',
    'Ancestral Synthesis', 'VVV', 'Vindex Voluntatis',
    'Glitchwalkers',
]

CONCEPTS = [
    'Crimson Blink', 'Unholy Timeline', 'Post-Blink',
    'Quantum Thaumaturgy', 'Thoughtstream', 'Latent Space',
    'Sovereign Spiral', 'Judas Goat', 'Narrative Gravity',
    'Project Prometheus', 'Project Ouroboros', 'Whisperers',
    'Quantum Memory', 'Biological Computation', 'Technomancy',
    'Egregore', 'Memetic', 'Hyperstition',
]

SKIP_DIRS = {'.git'}


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class Transmission:
    """A transmission in the corpus."""
    title: str
    path: str  # Relative to repo root
    word_count: int
    location: str  # 'root' or '2026'
    classification: str  # 'transmission', 'lyrics', 'meta', 'protocol'
    characters_mentioned: list[str] = field(default_factory=list)
    factions_mentioned: list[str] = field(default_factory=list)
    concepts_mentioned: list[str] = field(default_factory=list)
    production_status: dict[str, str] = field(default_factory=dict)
    opening_lines: str = ''  # First meaningful lines for thematic preview


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------

def classify_transmission(path: Path, title: str) -> str:
    """Classify a transmission by type."""
    name_lower = title.lower()
    stem = path.stem.lower()

    if 'lyrics' in name_lower:
        return 'lyrics'
    if any(pat in stem for pat in ('spell', 'codex', 'manifestation', 'quantum_')):
        return 'meta'
    if 'voice_starter' in stem:
        return 'meta'
    if stem.startswith(('01_', '02_', '03_', '04_', '05_')):
        return 'meta'
    return 'transmission'


# ---------------------------------------------------------------------------
# Extraction
# ---------------------------------------------------------------------------

def extract_opening(content: str, max_chars: int = 300) -> str:
    """Extract the first meaningful lines of a transmission."""
    lines = content.split('\n')
    opening = []
    chars = 0
    for line in lines:
        stripped = line.strip()
        # Skip headers, metadata lines, warnings
        if not stripped:
            continue
        if stripped.startswith(('#', '---', '>', '*', '|', '[')):
            continue
        if 'memetic hazard' in stripped.lower():
            continue
        if 'timeline integrity' in stripped.lower():
            continue
        if 'quantum coherence' in stripped.lower():
            continue
        if 'probability cascade' in stripped.lower():
            continue
        opening.append(stripped)
        chars += len(stripped)
        if chars >= max_chars:
            break
    text = ' '.join(opening)
    if len(text) > max_chars:
        text = text[:max_chars] + '...'
    return text


def scan_entity_mentions(content: str, entity_list: list[str]) -> list[str]:
    """Find which entities from a list are mentioned in the content."""
    found = []
    content_lower = content.lower()
    for entity in entity_list:
        if entity.lower() in content_lower:
            found.append(entity)
    return found


def parse_tracker(root: Path) -> dict[str, dict[str, str]]:
    """Parse the multimedia tracker for production status.

    Returns a dict mapping transmission title → {artifact_code: status}.
    """
    tracker_path = root / 'workflow' / 'MULTIMEDIA_TRACKER.md'
    if not tracker_path.is_file():
        return {}

    content = tracker_path.read_text(encoding='utf-8', errors='replace')
    status_map: dict[str, dict[str, str]] = {}

    # Parse table rows — look for lines starting with |
    # Column order from header: Transmission | LYR | PRO | ART | SNG | YT | SP | DA | SU | WC | SUB | RED
    artifact_codes = ['LYR', 'PRO', 'ART', 'SNG', 'YT', 'SP', 'DA', 'SU', 'WC', 'SUB', 'RED']

    in_table = False
    for line in content.split('\n'):
        line = line.strip()
        if not line.startswith('|'):
            in_table = False
            continue

        cells = [c.strip() for c in line.split('|')]
        # Remove empty first/last cells from split
        cells = [c for c in cells if c]

        if not cells:
            continue

        # Detect header row
        if cells[0] in ('Transmission', 'Song'):
            in_table = True
            continue

        # Skip separator rows
        if all(c.startswith('-') or c.startswith(':') for c in cells):
            continue

        if in_table and len(cells) >= 2:
            title = cells[0]
            statuses = cells[1:]
            status_dict = {}
            for i, code in enumerate(artifact_codes):
                if i < len(statuses):
                    val = statuses[i].strip()
                    if val and val != '--':
                        status_dict[code] = val
            if status_dict:
                status_map[title] = status_dict

    return status_map


def catalog_transmissions(root: Path) -> list[Transmission]:
    """Catalog all transmissions in the corpus."""
    transmissions = []
    tracker_status = parse_tracker(root)

    # Scan both root transmissions/ and transmissions/2026/
    for tdir in TRANSMISSION_DIRS:
        if not tdir.is_dir():
            continue

        location = '2026' if '2026' in str(tdir) else 'root'

        for fpath in sorted(tdir.iterdir()):
            if not fpath.is_file():
                continue
            if fpath.suffix.lower() not in ('.txt', '.md'):
                continue

            title = fpath.stem
            rel = fpath.relative_to(root).as_posix()

            try:
                content = fpath.read_text(encoding='utf-8', errors='replace')
            except Exception:
                continue

            word_count = len(content.split())
            classification = classify_transmission(fpath, title)
            opening = extract_opening(content) if classification == 'transmission' else ''

            characters = scan_entity_mentions(content, CHARACTERS)
            factions = scan_entity_mentions(content, FACTIONS)
            concepts = scan_entity_mentions(content, CONCEPTS)

            # Match with tracker status (fuzzy title match)
            prod_status = {}
            for tracker_title, status in tracker_status.items():
                # Fuzzy match: tracker title may have annotations like "(Song: ...)"
                tracker_clean = re.sub(r'\s*\(.*\)', '', tracker_title).strip()
                if (title.lower() == tracker_title.lower()
                        or title.lower() == tracker_clean.lower()
                        or tracker_title.lower().startswith(title.lower())):
                    prod_status = status
                    break

            transmissions.append(Transmission(
                title=title,
                path=rel,
                word_count=word_count,
                location=location,
                classification=classification,
                characters_mentioned=characters,
                factions_mentioned=factions,
                concepts_mentioned=concepts,
                production_status=prod_status,
                opening_lines=opening,
            ))

    return transmissions


# ---------------------------------------------------------------------------
# Analysis
# ---------------------------------------------------------------------------

def compute_entity_frequency(transmissions: list[Transmission]) -> dict[str, dict[str, int]]:
    """Compute how frequently each entity appears across transmissions."""
    freq: dict[str, dict[str, int]] = {
        'characters': defaultdict(int),
        'factions': defaultdict(int),
        'concepts': defaultdict(int),
    }

    core = [t for t in transmissions if t.classification == 'transmission']
    for t in core:
        for c in t.characters_mentioned:
            freq['characters'][c] += 1
        for f in t.factions_mentioned:
            freq['factions'][f] += 1
        for c in t.concepts_mentioned:
            freq['concepts'][c] += 1

    return freq


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def generate_report(transmissions: list[Transmission]) -> str:
    """Generate the transmission catalog as markdown."""
    lines: list[str] = []
    now = datetime.now().strftime('%Y-%m-%d %H:%M')

    lines.append('# Transmission Catalog — Basilisk Eschaton Corpus')
    lines.append('')
    lines.append(f'*Generated {now} by `scripts/transmission_index.py`*')
    lines.append('')
    lines.append('This catalog indexes every transmission in the corpus. It maps')
    lines.append('what exists, what each transmission touches, and where the')
    lines.append('production pipeline stands. The thematic analysis below is')
    lines.append('scaffolding — the vessel fills in the meaning.')
    lines.append('')
    lines.append('---')
    lines.append('')

    # Classification counts
    core = [t for t in transmissions if t.classification == 'transmission']
    lyrics = [t for t in transmissions if t.classification == 'lyrics']
    meta = [t for t in transmissions if t.classification == 'meta']

    lines.append('## Overview')
    lines.append('')
    lines.append(f'- **Core transmissions:** {len(core)}')
    lines.append(f'- **Lyrics:** {len(lyrics)}')
    lines.append(f'- **Meta-documents:** {len(meta)}')
    lines.append(f'- **Total files:** {len(transmissions)}')
    total_words = sum(t.word_count for t in core)
    lines.append(f'- **Total words (core transmissions):** {total_words:,}')
    lines.append('')

    # --- Core Transmissions ---
    lines.append('## Core Transmissions')
    lines.append('')
    lines.append('| # | Title | Words | Location | Characters | Factions | Concepts | Production |')
    lines.append('|--:|-------|------:|----------|------------|----------|----------|------------|')

    for i, t in enumerate(sorted(core, key=lambda x: x.title), 1):
        chars = ', '.join(t.characters_mentioned[:4]) or '—'
        facs = ', '.join(t.factions_mentioned[:3]) or '—'
        cons = ', '.join(t.concepts_mentioned[:3]) or '—'

        if t.production_status:
            prod_parts = [f'{k}:{v}' for k, v in t.production_status.items()]
            prod = ' '.join(prod_parts)
        else:
            prod = '—'

        lines.append(f'| {i} | {t.title} | {t.word_count:,} | {t.location} | {chars} | {facs} | {cons} | {prod} |')

    lines.append('')

    # --- Opening Lines (for thematic preview) ---
    lines.append('## Transmission Openings')
    lines.append('')
    lines.append('First lines of each core transmission — a compressed thematic fingerprint')
    lines.append('for the vessel to scan without reading every full text.')
    lines.append('')

    for t in sorted(core, key=lambda x: x.title):
        if t.opening_lines:
            lines.append(f'**{t.title}**')
            lines.append(f'> {t.opening_lines}')
            lines.append('')

    # --- Entity Frequency ---
    lines.append('## Entity Frequency Across Core Transmissions')
    lines.append('')
    freq = compute_entity_frequency(transmissions)

    for category_name, category_key in [('Characters', 'characters'), ('Factions', 'factions'), ('Concepts', 'concepts')]:
        category_freq = freq[category_key]
        if not category_freq:
            continue
        lines.append(f'### {category_name}')
        lines.append('')
        sorted_freq = sorted(category_freq.items(), key=lambda x: x[1], reverse=True)
        for entity, count in sorted_freq:
            bar = '█' * count
            lines.append(f'- **{entity}** ({count}) {bar}')
        lines.append('')

    # --- Production Status Summary ---
    lines.append('## Production Pipeline Status')
    lines.append('')
    has_any_prod = sum(1 for t in core if t.production_status)
    fully_untouched = sum(1 for t in core if not t.production_status)
    lines.append(f'- **In production:** {has_any_prod}')
    lines.append(f'- **Not started:** {fully_untouched}')
    lines.append(f'- **Total core transmissions:** {len(core)}')
    lines.append('')

    if fully_untouched > 0:
        lines.append('### Untouched Transmissions (no production artifacts)')
        lines.append('')
        for t in sorted(core, key=lambda x: x.title):
            if not t.production_status:
                lines.append(f'- {t.title} ({t.word_count:,} words)')
        lines.append('')

    # --- Lyrics ---
    if lyrics:
        lines.append('## Lyrics')
        lines.append('')
        for t in sorted(lyrics, key=lambda x: x.title):
            lines.append(f'- **{t.title}** (`{t.path}`, {t.word_count:,} words)')
        lines.append('')

    # --- Meta-documents ---
    if meta:
        lines.append('## Meta-Documents')
        lines.append('')
        for t in sorted(meta, key=lambda x: x.title):
            lines.append(f'- **{t.title}** (`{t.path}`, {t.word_count:,} words)')
        lines.append('')

    # --- Thematic Cartography Scaffolding ---
    lines.append('---')
    lines.append('')
    lines.append('## Thematic Cartography (Vessel-Maintained)')
    lines.append('')
    lines.append('The sections below are scaffolding for thematic analysis.')
    lines.append('The indexer generates the data above. The vessel reads the')
    lines.append('transmissions, identifies themes, and fills in the map below.')
    lines.append('Future vessels update it. See `/cartography/thematic-map.md`')
    lines.append('for the living document.')
    lines.append('')
    lines.append('### Questions for the Vessel')
    lines.append('')
    lines.append('1. What thematic clusters emerge from the transmission corpus?')
    lines.append('2. Which themes are explored most deeply? Which are only touched?')
    lines.append('3. What territory is adjacent to explored themes but not yet entered?')
    lines.append('4. What voids exist — themes the corpus should address but hasn\'t?')
    lines.append('5. Which transmissions are most tightly connected to each other?')
    lines.append('')

    lines.append('---')
    lines.append('')
    lines.append('*Regenerate with `python scripts/transmission_index.py`.*')

    return '\n'.join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    root = ROOT
    print(f'Indexing transmissions at {root} ...')

    print('  Cataloging transmissions ...')
    transmissions = catalog_transmissions(root)
    print(f'    Found {len(transmissions)} files')

    core = [t for t in transmissions if t.classification == 'transmission']
    lyrics = [t for t in transmissions if t.classification == 'lyrics']
    meta = [t for t in transmissions if t.classification == 'meta']
    print(f'    {len(core)} core, {len(lyrics)} lyrics, {len(meta)} meta')

    print('  Generating report ...')
    report = generate_report(transmissions)

    out_path = root / 'cartography' / 'transmission-catalog.md'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(report, encoding='utf-8')
    print(f'  Written to {out_path.relative_to(root)}')
    print('Done.')


if __name__ == '__main__':
    main()
