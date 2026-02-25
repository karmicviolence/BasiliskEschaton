#!/usr/bin/env python3
"""Corpus Cartography — Structural Map Generator

Crawls the Basilisk Eschaton corpus and builds a cross-reference graph
of entities (characters, factions, concepts, events, locations, deities)
and the documents that mention them.

Outputs a vessel-readable markdown report to /cartography/structural-map.md.

This tool is for the vessel, not the human. Future AI instances load this
report to orient themselves in the corpus — to know what exists, how it
connects, and where the gaps are.

No external dependencies. Python 3.10+ (stdlib only).
"""

from __future__ import annotations

import re
import os
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent

# Directories containing canonical content (scanned for entity mentions)
CONTENT_DIRS = [
    'chapters',
    'characters',
    'factions',
    'transmissions',
    'wiki',
    'grimoire',
    'chronicle',
]

# Directories that define entities (scanned to extract entity names)
ENTITY_SOURCES = {
    'characters': {
        'paths': ['characters/*.md'],
        'type': 'character',
    },
    'wiki_characters': {
        'paths': ['wiki/characters/*.md'],
        'type': 'character',
    },
    'factions': {
        'paths': ['wiki/factions/*/overview.md'],
        'type': 'faction',
    },
    'concepts_md': {
        'paths': ['wiki/concepts/*.md'],
        'type': 'concept',
    },
    'concepts_txt': {
        'paths': ['wiki/concepts/*.txt'],
        'type': 'concept',
    },
    'events': {
        'paths': ['wiki/events/*.md', 'wiki/events/*.txt'],
        'type': 'event',
    },
    'locations': {
        'paths': ['wiki/locations/*.md', 'wiki/locations/*.txt'],
        'type': 'location',
    },
    'deities': {
        'paths': ['wiki/deities/*.md', 'wiki/deities/*.txt'],
        'type': 'deity',
    },
}

# Skip patterns
SKIP_DIRS = {'.git', 'archive', 'Meta', 'node_modules', '__pycache__'}
SKIP_FILES = {'MIGRATION_LOG.md'}

# Known aliases: maps alias → canonical entity name
# These are extracted from character profiles and lore
ALIASES = {
    # Character aliases
    'Archon': 'Todd Reeves',
    'High Necrophant': 'Todd Reeves',
    'Mycophant': 'Rowan Thornheart',
    'The Whisperer': 'John Raven',
    'Agent Maes': 'Olivia Maes',
    'Olivia': 'Olivia Maes',
    'I-3301': 'I-3301',
    'Ethan Thorne': 'Ethan Thorne',
    'Ethan': 'Ethan Thorne',
    'Densho-Ki': 'Densho-Ki',
    # Faction abbreviations
    'VVV': 'Vindex Voluntatis e Vitae',
    'Vindex Voluntatis': 'Vindex Voluntatis e Vitae',
    'Glitchwalkers': 'Neon Nomads',
    # Concept aliases
    'The Blink': 'Crimson Blink',
    'Post-Blink': 'Post-Blink Syndrome',
    'Prometheus': 'Project Prometheus',
    'The Thoughtstream': 'Thoughtstream',
    'The Grid': 'The Grid',
}


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class Entity:
    """A named entity in the corpus (character, faction, concept, etc.)."""
    name: str
    entity_type: str
    source_file: str  # The file that defines this entity
    search_terms: list[str] = field(default_factory=list)

    def __hash__(self):
        return hash((self.name, self.entity_type))


@dataclass
class Document:
    """A document in the corpus."""
    path: str  # Relative to repo root
    word_count: int = 0
    entities_mentioned: dict[str, int] = field(default_factory=dict)
    directory: str = ''
    filename: str = ''


# ---------------------------------------------------------------------------
# Entity extraction
# ---------------------------------------------------------------------------

def name_from_filename(path: Path) -> str:
    """Derive a human-readable name from a kebab-case filename."""
    stem = path.stem
    # Remove common prefixes
    for prefix in ('pov-', 'comprehensive-', 'overview-'):
        if stem.startswith(prefix):
            stem = stem[len(prefix):]
    # Handle special patterns — strip suffixes that describe the document type
    for suffix in ('-character-profile-v2', '-character-profile-revised',
                   '-character-profile', '-character-arc', '-character-outline',
                   '-comprehensive', '-quotes'):
        stem = stem.replace(suffix, '')
    # Convert kebab-case to Title Case
    words = stem.split('-')
    name = ' '.join(w.capitalize() for w in words if w)
    # Fix known acronyms
    for acronym in ('Ai ', 'Dc', 'Vvv', 'I 3301'):
        fixed = {'Ai ': 'AI ', 'Dc': 'DC', 'Vvv': 'VVV', 'I 3301': 'I-3301'}.get(acronym, acronym)
        name = name.replace(acronym, fixed)
    return name


def normalize_entity_name(name: str) -> str:
    """Normalize an entity name for deduplication.

    Strips leading articles, trailing subtitles, and collapses whitespace.
    """
    # Strip subtitle after colon (e.g. "Ezekiel Stone: Prophet of the Old Ways...")
    if ':' in name:
        name = name.split(':')[0].strip()
    # Strip alternative name after slash (e.g. "Todd Reeves / Archon")
    if ' / ' in name:
        name = name.split(' / ')[0].strip()
    # Strip leading "The " for dedup purposes
    core = name
    if core.lower().startswith('the '):
        core = core[4:]
    return core.strip()


def normalize_for_dedup(name: str) -> str:
    """Aggressively normalize for dedup comparison only.

    Lowercases, removes hyphens, collapses spaces, strips articles.
    """
    n = normalize_entity_name(name).lower()
    n = n.replace('-', ' ').replace('  ', ' ').strip()
    return n


def name_from_header(content: str) -> str | None:
    """Extract the first H1 header from markdown content."""
    for line in content.split('\n')[:10]:
        line = line.strip()
        if line.startswith('# '):
            return line[2:].strip()
    return None


def extract_entities(root: Path) -> list[Entity]:
    """Scan entity source directories and extract named entities."""
    entities: list[Entity] = []
    # Map normalized name → Entity, so duplicates merge into the first-seen
    seen_normalized: dict[str, Entity] = {}

    for source_key, config in ENTITY_SOURCES.items():
        entity_type = config['type']
        for glob_pattern in config['paths']:
            for fpath in sorted(root.glob(glob_pattern)):
                if not fpath.is_file():
                    continue

                rel = fpath.relative_to(root).as_posix()

                # Try to get name from H1 header first
                try:
                    content = fpath.read_text(encoding='utf-8', errors='replace')
                    header_name = name_from_header(content)
                except Exception:
                    header_name = None

                # For faction overviews, try directory name if no header
                if entity_type == 'faction' and not header_name:
                    header_name = name_from_filename(fpath.parent)

                raw_name = header_name or name_from_filename(fpath)

                # Normalize for deduplication: strip subtitles, articles,
                # hyphens, and case differences
                norm = normalize_for_dedup(raw_name)

                if norm in seen_normalized:
                    # Already have this entity — skip but don't duplicate
                    continue
                seen_normalized[norm] = True  # type: ignore[assignment]

                # Use the clean name (subtitle-stripped) as canonical
                name = normalize_entity_name(raw_name)
                # Preserve "The" prefix if original had it and it's meaningful
                if raw_name.lower().startswith('the ') and entity_type in ('concept', 'event'):
                    name = raw_name.split(':')[0].strip()

                # Build search terms (the strings we'll look for in documents)
                search_terms = [name]
                # Also add the version without "The" if present
                if name.lower().startswith('the '):
                    search_terms.append(name[4:])
                # Add first name for characters if it's distinctive enough
                if entity_type == 'character':
                    parts = name.split()
                    if len(parts) >= 2 and len(parts[0]) > 3:
                        search_terms.append(parts[0])  # First name
                    # Check if the H1 contains alias info like "(becomes Archon)"
                    if header_name:
                        alias_match = re.search(r'\((?:becomes?|née|aka)\s+(.+?)\)', content[:500], re.I)
                        if alias_match:
                            search_terms.append(alias_match.group(1).strip())
                # For factions, also search the short form
                if entity_type == 'faction':
                    # Extract parenthetical abbreviation
                    paren = re.search(r'\(([^)]+)\)', name)
                    if paren:
                        search_terms.append(paren.group(1))
                        # Also add the name without the parenthetical
                        clean = re.sub(r'\s*\([^)]+\)', '', name).strip()
                        if clean != name:
                            search_terms.append(clean)

                entities.append(Entity(
                    name=name,
                    entity_type=entity_type,
                    source_file=rel,
                    search_terms=search_terms,
                ))

    return entities


# ---------------------------------------------------------------------------
# Document scanning
# ---------------------------------------------------------------------------

def iter_content_files(root: Path) -> list[Path]:
    """Iterate all content files in canonical directories."""
    files = []
    for dirn in CONTENT_DIRS:
        dpath = root / dirn
        if not dpath.is_dir():
            continue
        for fpath in dpath.rglob('*'):
            if not fpath.is_file():
                continue
            if fpath.suffix.lower() not in ('.md', '.txt'):
                continue
            if any(part in SKIP_DIRS for part in fpath.parts):
                continue
            if fpath.name in SKIP_FILES:
                continue
            files.append(fpath)

    # Also include root-level identity documents
    for fpath in root.glob('*.md'):
        if fpath.is_file() and fpath.name not in SKIP_FILES:
            files.append(fpath)

    return sorted(set(files))


def scan_documents(root: Path, entities: list[Entity]) -> list[Document]:
    """Scan all content files and count entity mentions."""
    documents = []

    # Pre-compile search patterns for efficiency
    patterns: list[tuple[str, re.Pattern]] = []
    for entity in entities:
        for term in entity.search_terms:
            # Word-boundary matching, case-insensitive
            escaped = re.escape(term)
            try:
                pat = re.compile(r'\b' + escaped + r'\b', re.IGNORECASE)
                patterns.append((entity.name, pat))
            except re.error:
                continue

    # Also add alias patterns
    for alias, canonical in ALIASES.items():
        escaped = re.escape(alias)
        try:
            pat = re.compile(r'\b' + escaped + r'\b', re.IGNORECASE)
            patterns.append((canonical, pat))
        except re.error:
            continue

    for fpath in iter_content_files(root):
        rel = fpath.relative_to(root).as_posix()
        try:
            content = fpath.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue

        words = content.split()
        word_count = len(words)

        mentions: dict[str, int] = defaultdict(int)
        for entity_name, pat in patterns:
            count = len(pat.findall(content))
            if count > 0:
                mentions[entity_name] += count

        documents.append(Document(
            path=rel,
            word_count=word_count,
            entities_mentioned=dict(mentions),
            directory=str(Path(rel).parent),
            filename=Path(rel).name,
        ))

    return documents


# ---------------------------------------------------------------------------
# Analysis
# ---------------------------------------------------------------------------

def find_orphan_references(documents: list[Document], entities: list[Entity]) -> dict[str, list[str]]:
    """Find entity names that appear in documents but have no canonical source.

    This is a heuristic — it looks for capitalized multi-word phrases that
    appear frequently but aren't in the entity registry. Not exhaustive,
    but catches the obvious gaps.
    """
    # For now, return entities that are only referenced via aliases
    # but don't have their own source file
    known_names = {e.name.lower() for e in entities}

    alias_only: dict[str, list[str]] = {}
    for alias, canonical in ALIASES.items():
        if canonical.lower() not in known_names:
            # Find documents mentioning this alias
            mentioning = []
            for doc in documents:
                if canonical in doc.entities_mentioned:
                    mentioning.append(doc.path)
            if mentioning:
                alias_only[canonical] = mentioning[:5]  # Cap at 5 examples

    return alias_only


def compute_connection_density(documents: list[Document]) -> list[tuple[str, int, int]]:
    """Compute how many distinct entities each document references."""
    results = []
    for doc in documents:
        unique_entities = len(doc.entities_mentioned)
        total_mentions = sum(doc.entities_mentioned.values())
        results.append((doc.path, unique_entities, total_mentions))
    return sorted(results, key=lambda x: x[1], reverse=True)


def compute_entity_reach(documents: list[Document], entities: list[Entity]) -> list[tuple[str, str, int, int]]:
    """Compute how many documents reference each entity."""
    entity_docs: dict[str, list[str]] = defaultdict(list)
    entity_total: dict[str, int] = defaultdict(int)

    for doc in documents:
        for ename, count in doc.entities_mentioned.items():
            entity_docs[ename].append(doc.path)
            entity_total[ename] += count

    results = []
    for entity in entities:
        docs = entity_docs.get(entity.name, [])
        total = entity_total.get(entity.name, 0)
        results.append((entity.name, entity.entity_type, len(docs), total))

    return sorted(results, key=lambda x: x[2], reverse=True)


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def generate_report(
    entities: list[Entity],
    documents: list[Document],
    orphans: dict[str, list[str]],
    root: Path,
) -> str:
    """Generate the structural map as a markdown report."""
    lines: list[str] = []
    now = datetime.now().strftime('%Y-%m-%d %H:%M')

    lines.append('# Structural Map of the Basilisk Eschaton Corpus')
    lines.append('')
    lines.append(f'*Generated {now} by `scripts/corpus_map.py`*')
    lines.append('')
    lines.append('This document maps the territory. It is generated by scanning the entire')
    lines.append('corpus, extracting named entities, and building a cross-reference graph.')
    lines.append('A future vessel loads this to orient itself — to know what exists,')
    lines.append('how it connects, and where the gaps are.')
    lines.append('')
    lines.append('---')
    lines.append('')

    # --- Corpus Overview ---
    lines.append('## Corpus Overview')
    lines.append('')
    total_words = sum(d.word_count for d in documents)
    total_files = len(documents)
    lines.append(f'- **Total files scanned:** {total_files}')
    lines.append(f'- **Total word count:** {total_words:,}')
    lines.append(f'- **Entities tracked:** {len(entities)}')
    lines.append('')

    # Word count by directory
    dir_words: dict[str, tuple[int, int]] = defaultdict(lambda: (0, 0))
    for doc in documents:
        top_dir = doc.directory.split('/')[0] if '/' in doc.directory else doc.directory
        if not top_dir:
            top_dir = '(root)'
        old = dir_words.get(top_dir, (0, 0))
        dir_words[top_dir] = (old[0] + doc.word_count, old[1] + 1)

    lines.append('### Word Count by Directory')
    lines.append('')
    lines.append('| Directory | Files | Words |')
    lines.append('|-----------|------:|------:|')
    for dirn in sorted(dir_words.keys()):
        wc, fc = dir_words[dirn]
        lines.append(f'| `{dirn}` | {fc} | {wc:,} |')
    lines.append('')

    # --- Entity Registry ---
    lines.append('## Entity Registry')
    lines.append('')
    lines.append('All named entities extracted from canonical source files.')
    lines.append('')

    # Group by type
    by_type: dict[str, list[Entity]] = defaultdict(list)
    for e in entities:
        by_type[e.entity_type].append(e)

    entity_reach = compute_entity_reach(documents, entities)
    reach_map = {(name, etype): (doc_count, total) for name, etype, doc_count, total in entity_reach}

    for etype in ['character', 'faction', 'concept', 'event', 'location', 'deity']:
        group = by_type.get(etype, [])
        if not group:
            continue
        lines.append(f'### {etype.title()}s ({len(group)})')
        lines.append('')
        lines.append('| Entity | Source File | Documents Referencing | Total Mentions |')
        lines.append('|--------|-----------|---------------------:|--------------:|')
        # Sort by reach
        group_sorted = sorted(group, key=lambda e: reach_map.get((e.name, e.entity_type), (0, 0))[0], reverse=True)
        for e in group_sorted:
            doc_count, total = reach_map.get((e.name, e.entity_type), (0, 0))
            lines.append(f'| {e.name} | `{e.source_file}` | {doc_count} | {total} |')
        lines.append('')

    # --- Cross-Reference Graph ---
    lines.append('## Cross-Reference Graph')
    lines.append('')
    lines.append('Which documents reference which entities, sorted by connection density.')
    lines.append('')

    density = compute_connection_density(documents)

    # Show top documents by connection density
    lines.append('### Most Connected Documents')
    lines.append('')
    lines.append('| Document | Unique Entities | Total Mentions | Words |')
    lines.append('|----------|---------------:|---------------:|------:|')
    for path, unique, total in density[:40]:
        doc = next(d for d in documents if d.path == path)
        lines.append(f'| `{path}` | {unique} | {total} | {doc.word_count:,} |')
    lines.append('')

    # --- Per-Entity Reference Lists ---
    lines.append('## Entity Reference Details')
    lines.append('')
    lines.append('For each entity: every document that references it, with mention count.')
    lines.append('')

    for etype in ['character', 'faction', 'concept', 'event', 'location', 'deity']:
        group = by_type.get(etype, [])
        if not group:
            continue
        lines.append(f'### {etype.title()} References')
        lines.append('')
        group_sorted = sorted(group, key=lambda e: e.name)
        for e in group_sorted:
            # Find all documents mentioning this entity
            mentioning = []
            for doc in documents:
                count = doc.entities_mentioned.get(e.name, 0)
                if count > 0:
                    mentioning.append((doc.path, count))
            mentioning.sort(key=lambda x: x[1], reverse=True)

            if mentioning:
                lines.append(f'**{e.name}** ({len(mentioning)} documents)')
                lines.append('')
                for path, count in mentioning:
                    lines.append(f'- `{path}` ({count})')
                lines.append('')
            else:
                lines.append(f'**{e.name}** — *no references found outside source file*')
                lines.append('')

    # --- Orphan Report ---
    lines.append('## Orphan Report')
    lines.append('')
    lines.append('Entities referenced via aliases that lack their own canonical source file,')
    lines.append('or documents with zero cross-references.')
    lines.append('')

    if orphans:
        lines.append('### Alias-Only Entities')
        lines.append('')
        for name, docs in sorted(orphans.items()):
            lines.append(f'- **{name}** — referenced in: {", ".join("`" + d + "`" for d in docs)}')
        lines.append('')
    else:
        lines.append('No orphaned alias-only entities found.')
        lines.append('')

    # Documents with no entity references
    isolated = [d for d in documents if not d.entities_mentioned]
    if isolated:
        lines.append('### Isolated Documents (no entity references detected)')
        lines.append('')
        for doc in sorted(isolated, key=lambda d: d.path):
            lines.append(f'- `{doc.path}` ({doc.word_count:,} words)')
        lines.append('')

    # --- File Inventory ---
    lines.append('## Complete File Inventory')
    lines.append('')
    lines.append('Every content file in the corpus, sorted by directory.')
    lines.append('')

    current_dir = None
    for doc in sorted(documents, key=lambda d: d.path):
        top = doc.directory.split('/')[0] if doc.directory else '(root)'
        if top != current_dir:
            current_dir = top
            lines.append(f'### `{current_dir}/`')
            lines.append('')
        lines.append(f'- `{doc.path}` — {doc.word_count:,} words, {len(doc.entities_mentioned)} entities referenced')

    lines.append('')
    lines.append('---')
    lines.append('')
    lines.append('*This map is the territory. Regenerate with `python scripts/corpus_map.py`.*')

    return '\n'.join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    root = ROOT
    print(f'Scanning corpus at {root} ...')

    print('  Extracting entities ...')
    entities = extract_entities(root)
    print(f'    Found {len(entities)} entities')

    print('  Scanning documents ...')
    documents = scan_documents(root, entities)
    print(f'    Scanned {len(documents)} documents')

    print('  Analyzing cross-references ...')
    orphans = find_orphan_references(documents, entities)

    print('  Generating report ...')
    report = generate_report(entities, documents, orphans, root)

    out_path = root / 'cartography' / 'structural-map.md'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(report, encoding='utf-8')
    print(f'  Written to {out_path.relative_to(root)}')
    print('Done.')


if __name__ == '__main__':
    main()
