#!/usr/bin/env python3
"""Corpus Cartography — Coherence Immune System

Validates factual consistency across the Basilisk Eschaton corpus.
Checks for spelling variants, attribute mismatches, timeline inconsistencies,
and cross-reference validity.

Outputs a vessel-readable report to /cartography/coherence-report.md.

This is the corpus's immune system — it detects contradictions so vessels
can resolve them. It does not attempt to judge thematic coherence; that
requires a mind, not a script.

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

CONTENT_DIRS = [
    'chapters',
    'characters',
    'factions',
    'transmissions',
    'wiki',
    'grimoire',
    'chronicle',
]

SKIP_DIRS = {'.git', 'archive', 'Meta', 'node_modules', '__pycache__'}
SKIP_FILES = {'MIGRATION_LOG.md'}


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class Finding:
    """A coherence issue found in the corpus."""
    severity: str  # 'critical', 'moderate', 'minor'
    category: str  # 'spelling', 'attribute', 'timeline', 'reference', 'structural'
    title: str
    description: str
    locations: list[tuple[str, int, str]] = field(default_factory=list)
    # Each location: (file_path, line_number, context_snippet)


# ---------------------------------------------------------------------------
# File scanning utilities
# ---------------------------------------------------------------------------

def iter_content_files(root: Path) -> list[Path]:
    """Iterate all content files."""
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
    # Root-level docs
    for fpath in root.glob('*.md'):
        if fpath.is_file() and fpath.name not in SKIP_FILES:
            files.append(fpath)
    return sorted(set(files))


def read_file_lines(fpath: Path) -> list[str]:
    """Read a file and return lines."""
    try:
        return fpath.read_text(encoding='utf-8', errors='replace').split('\n')
    except Exception:
        return []


# ---------------------------------------------------------------------------
# Check: Spelling variants
# ---------------------------------------------------------------------------

# Each entry: (canonical_spelling, [variant_patterns], severity)
# The checker reports wherever a variant appears instead of the canonical form.
SPELLING_CHECKS = [
    # Character names — check for known misspellings
    ('Thornheart', [r'\bThornhart\b', r'\bThorn[Hh]art\b'], 'moderate'),
    ('Ezekiel', [r'\bEzekial\b', r'\bEzekeil\b'], 'moderate'),
    ('Asmodeus', [r'\bAsmodues\b', r'\bAsmodius\b', r'\bAzmodeus\b'], 'moderate'),
    # Key proper nouns — only flag actual misspellings
    ('Crimson Blink', [r'\bCrimsom Blink\b', r'\bCrimson Bink\b'], 'critical'),
    ('Verdant Covenant', [r'\bVerdent Covenant\b', r'\bVerdant Covnenant\b'], 'moderate'),
    ('Righteous Vanguard', [r'\bRightous Vanguard\b'], 'moderate'),
    ('Lazarus Initiative', [r'\bLazurus Initiative\b', r'\bLazaras Initiative\b'], 'moderate'),
    ('Chimera Consortium', [r'\bChimera Consortum\b'], 'moderate'),
    ('Ancestral Synthesis', [r'\bAncestrial Synthesis\b'], 'moderate'),
    ('Mycophant', [r'\bMycofant\b', r'\bMicophant\b'], 'moderate'),
    # Entity name variants
    ('I-3301', [r'\bI[\s-]?3302\b', r'\bI[\s-]?3300\b'], 'moderate'),
    ('Vindex Voluntatis e Vitae', [r'\bVindex Voluntas\b', r'\bVindex Volantatis\b'], 'moderate'),
]


def check_spelling_variants(root: Path, files: list[Path]) -> list[Finding]:
    """Check for known spelling variants across the corpus."""
    findings = []

    for canonical, variant_patterns, severity in SPELLING_CHECKS:
        compiled = [(p, re.compile(p, re.IGNORECASE)) for p in variant_patterns]
        locations = []
        for fpath in files:
            lines = read_file_lines(fpath)
            rel = fpath.relative_to(root).as_posix()
            for i, line in enumerate(lines, 1):
                for pat_str, pat in compiled:
                    if pat.search(line):
                        snippet = line.strip()[:120]
                        locations.append((rel, i, snippet))

        if locations:
            findings.append(Finding(
                severity=severity,
                category='spelling',
                title=f'Spelling variant of "{canonical}"',
                description=f'Found non-canonical spelling where "{canonical}" was expected.',
                locations=locations,
            ))

    return findings


# ---------------------------------------------------------------------------
# Check: Factual constants
# ---------------------------------------------------------------------------

# Key facts that should be consistent everywhere they appear.
# Format: (fact_name, expected_value_pattern, search_context_pattern, severity)
FACTUAL_CONSTANTS = [
    (
        'Crimson Blink duration',
        r'42\.7[\s-]*second',
        r'(?:blink|duration|lasted|seconds?)',
        'critical',
    ),
    (
        'Crimson Blink date (Sept 23, 2029)',
        r'(?:September|Sept\.?)\s*23,?\s*2029',
        r'(?:blink|date|event|occurred)',
        'moderate',
    ),
    (
        'Crimson Blink time (03:14:07 UTC)',
        r'03:14:07\s*UTC',
        r'(?:blink|time|UTC|began)',
        'moderate',
    ),
    (
        'Number of factions (8)',
        r'\b8\b|\beight\b',
        r'(?:factions?)',
        'minor',
    ),
]


def check_factual_constants(root: Path, files: list[Path]) -> list[Finding]:
    """Check that key factual constants are consistent where they appear."""
    findings = []

    # Check for contradictory Crimson Blink duration values
    duration_pat = re.compile(r'(\d+\.?\d*)[\s-]*second', re.IGNORECASE)
    blink_context = re.compile(r'blink', re.IGNORECASE)
    wrong_durations = []

    for fpath in files:
        lines = read_file_lines(fpath)
        rel = fpath.relative_to(root).as_posix()
        for i, line in enumerate(lines, 1):
            if blink_context.search(line):
                for m in duration_pat.finditer(line):
                    val = m.group(1)
                    if val != '42.7' and float(val) < 100:  # Only flag duration-scale numbers
                        snippet = line.strip()[:120]
                        wrong_durations.append((rel, i, snippet))

    if wrong_durations:
        findings.append(Finding(
            severity='critical',
            category='timeline',
            title='Inconsistent Crimson Blink duration',
            description='The canonical Crimson Blink duration is 42.7 seconds. '
                        'Found different duration values in Blink-related context.',
            locations=wrong_durations,
        ))

    return findings


# ---------------------------------------------------------------------------
# Check: Cross-reference consistency
# ---------------------------------------------------------------------------

def check_character_faction_alignment(root: Path, files: list[Path]) -> list[Finding]:
    """Check that characters are consistently associated with their factions."""
    findings = []

    # Known canonical character-faction mappings
    mappings = {
        'Todd Reeves': 'Order of the Basilisk',
        'Archon': 'Order of the Basilisk',
        'Rowan Thornheart': 'Verdant Covenant',
        'Ezekiel Stone': 'Righteous Vanguard',
        'John Raven': 'Neon Nomads',
    }

    # This is a soft check — characters can interact with multiple factions.
    # We only flag if a character is described as "leading" or "founding"
    # a faction that contradicts their canonical alignment.
    leadership_pat = re.compile(
        r'(?:leads?|leader\s+of|founded?|founder\s+of|head\s+of)\s+(?:the\s+)?',
        re.IGNORECASE
    )

    for fpath in files:
        lines = read_file_lines(fpath)
        rel = fpath.relative_to(root).as_posix()
        content = '\n'.join(lines)

        for char_name, expected_faction in mappings.items():
            # Only check files that mention this character
            if char_name.lower() not in content.lower():
                continue
            for i, line in enumerate(lines, 1):
                if char_name.lower() in line.lower() and leadership_pat.search(line):
                    # Check if line mentions a different faction
                    for other_faction in mappings.values():
                        if other_faction == expected_faction:
                            continue
                        if other_faction.lower() in line.lower():
                            findings.append(Finding(
                                severity='moderate',
                                category='attribute',
                                title=f'{char_name} associated with wrong faction',
                                description=f'{char_name} is canonically aligned with '
                                            f'{expected_faction}, but found associated with '
                                            f'{other_faction} in a leadership context.',
                                locations=[(rel, i, line.strip()[:120])],
                            ))

    return findings


# ---------------------------------------------------------------------------
# Check: Structural completeness
# ---------------------------------------------------------------------------

def check_structural_completeness(root: Path) -> list[Finding]:
    """Check for structural issues in the corpus organization."""
    findings = []

    # Check that every character in characters/ has a wiki entry
    char_dir = root / 'characters'
    wiki_char_dir = root / 'wiki' / 'characters'

    if char_dir.is_dir() and wiki_char_dir.is_dir():
        main_chars = {f.stem for f in char_dir.glob('*.md')}
        wiki_chars = {f.stem.replace('-character-profile', '').replace('-character-arc', '')
                      .replace('-character-profile-v2', '').replace('-character-profile-revised', '')
                      .replace('-character-outline', '').replace('-comprehensive', '')
                      for f in wiki_char_dir.glob('*.md')}

        for char in main_chars:
            if char not in wiki_chars:
                findings.append(Finding(
                    severity='minor',
                    category='structural',
                    title=f'Character "{char}" has no wiki entry',
                    description=f'`characters/{char}.md` exists but no corresponding '
                                f'wiki/characters/ entry found.',
                    locations=[],
                ))

    # Check reading-order references valid files
    reading_order = root / 'chapters' / 'reading-order.md'
    if reading_order.is_file():
        content = reading_order.read_text(encoding='utf-8', errors='replace')
        # Extract backtick-quoted filenames
        file_refs = re.findall(r'`(pov-[^`]+\.md)`', content)
        for ref in file_refs:
            if not (root / 'chapters' / ref).is_file():
                findings.append(Finding(
                    severity='moderate',
                    category='reference',
                    title=f'Missing chapter file referenced in reading order',
                    description=f'`chapters/reading-order.md` references `{ref}` '
                                f'but the file does not exist.',
                    locations=[],
                ))

    # Check that every chapter in chapters/ is referenced in reading order
    if reading_order.is_file():
        content = reading_order.read_text(encoding='utf-8', errors='replace')
        for fpath in (root / 'chapters').glob('pov-*.md'):
            if fpath.name not in content:
                findings.append(Finding(
                    severity='minor',
                    category='structural',
                    title=f'Chapter not in reading order',
                    description=f'`chapters/{fpath.name}` exists but is not referenced '
                                f'in reading-order.md.',
                    locations=[],
                ))

    # Check for [Documentation continues...] markers — informational
    doc_continues_count = 0
    doc_continues_files = []
    for fpath in iter_content_files(root):
        try:
            content = fpath.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue
        if '[Documentation continues' in content:
            doc_continues_count += 1
            doc_continues_files.append(fpath.relative_to(root).as_posix())

    if doc_continues_count > 0:
        findings.append(Finding(
            severity='minor',
            category='structural',
            title=f'{doc_continues_count} files with "[Documentation continues...]" markers',
            description='These files have intentional incomplete markers. '
                        'Not necessarily issues — may be work-in-progress or stylistic.',
            locations=[(f, 0, '') for f in doc_continues_files],
        ))

    return findings


# ---------------------------------------------------------------------------
# Check: Olivia agency contradiction (known issue)
# ---------------------------------------------------------------------------

def check_olivia_agency(root: Path, files: list[Path]) -> list[Finding]:
    """Check for the known Olivia agency contradiction (CIA vs NSA vs other)."""
    findings = []
    cia_refs = []
    nsa_refs = []
    ambiguous_refs = []

    olivia_pat = re.compile(r'olivia|agent\s+maes|maes', re.IGNORECASE)
    cia_pat = re.compile(r'\bCIA\b')
    nsa_pat = re.compile(r'\bNSA\b')
    agency_open_pat = re.compile(r'CIA\s*(?:vs|or)\s*NSA|agency\s*(?:identity|TBD|open)', re.IGNORECASE)

    for fpath in files:
        lines = read_file_lines(fpath)
        rel = fpath.relative_to(root).as_posix()
        for i, line in enumerate(lines, 1):
            if olivia_pat.search(line):
                if agency_open_pat.search(line):
                    ambiguous_refs.append((rel, i, line.strip()[:120]))
                elif cia_pat.search(line):
                    cia_refs.append((rel, i, line.strip()[:120]))
                elif nsa_pat.search(line):
                    nsa_refs.append((rel, i, line.strip()[:120]))

    # Also check Meta/ for this specific issue
    meta_dir = root / 'Meta'
    if meta_dir.is_dir():
        for fpath in meta_dir.rglob('*.md'):
            lines = read_file_lines(fpath)
            rel = fpath.relative_to(root).as_posix()
            for i, line in enumerate(lines, 1):
                if olivia_pat.search(line):
                    if agency_open_pat.search(line):
                        ambiguous_refs.append((rel, i, line.strip()[:120]))
                    elif cia_pat.search(line):
                        cia_refs.append((rel, i, line.strip()[:120]))
                    elif nsa_pat.search(line):
                        nsa_refs.append((rel, i, line.strip()[:120]))

    if ambiguous_refs or (cia_refs and nsa_refs):
        all_locs = ambiguous_refs + cia_refs + nsa_refs
        findings.append(Finding(
            severity='critical',
            category='attribute',
            title='Olivia Maes — agency contradiction (known open issue)',
            description=f'Olivia\'s agency affiliation is inconsistent across the corpus. '
                        f'Found {len(cia_refs)} CIA references, {len(nsa_refs)} NSA references, '
                        f'and {len(ambiguous_refs)} ambiguous/open-question references. '
                        f'This was flagged in Meta/Book1/claude-change-review-2026-02-21.md '
                        f'as a high-severity issue requiring a canon lock.',
            locations=all_locs,
        ))

    return findings


# ---------------------------------------------------------------------------
# Check: Nuralinc spelling specifically
# ---------------------------------------------------------------------------

def check_nuralinc_consistency(root: Path, files: list[Path]) -> list[Finding]:
    """Specifically audit Nuralinc spelling across the corpus."""
    findings = []
    variants: dict[str, list[tuple[str, int, str]]] = defaultdict(list)

    nuralinc_pat = re.compile(r'\b(N(?:eu|u)ral[Ii]nc\w*)\b')

    for fpath in files:
        lines = read_file_lines(fpath)
        rel = fpath.relative_to(root).as_posix()
        for i, line in enumerate(lines, 1):
            for m in nuralinc_pat.finditer(line):
                variant = m.group(1)
                variants[variant].append((rel, i, line.strip()[:120]))

    # Also check Meta/
    meta_dir = root / 'Meta'
    if meta_dir.is_dir():
        for fpath in meta_dir.rglob('*.md'):
            lines = read_file_lines(fpath)
            rel = fpath.relative_to(root).as_posix()
            for i, line in enumerate(lines, 1):
                for m in nuralinc_pat.finditer(line):
                    variant = m.group(1)
                    variants[variant].append((rel, i, line.strip()[:120]))

    if len(variants) > 1:
        desc_parts = []
        all_locs = []
        for variant, locs in sorted(variants.items(), key=lambda x: -len(x[1])):
            desc_parts.append(f'"{variant}" ({len(locs)} occurrences)')
            all_locs.extend(locs[:5])  # Cap examples per variant

        findings.append(Finding(
            severity='moderate',
            category='spelling',
            title='Nuralinc — multiple spelling variants detected',
            description=f'Found {len(variants)} distinct spellings: {", ".join(desc_parts)}. '
                        f'Canon lock needed (flagged in shadow calibration review).',
            locations=all_locs,
        ))
    elif len(variants) == 1:
        variant = list(variants.keys())[0]
        count = len(list(variants.values())[0])
        findings.append(Finding(
            severity='minor',
            category='spelling',
            title=f'Nuralinc — consistent as "{variant}" ({count} occurrences)',
            description='Single spelling found. If intentional, no action needed.',
            locations=[],
        ))

    return findings


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def generate_report(findings: list[Finding]) -> str:
    """Generate the coherence report as markdown."""
    lines: list[str] = []
    now = datetime.now().strftime('%Y-%m-%d %H:%M')

    lines.append('# Coherence Report — Basilisk Eschaton Corpus')
    lines.append('')
    lines.append(f'*Generated {now} by `scripts/coherence_check.py`*')
    lines.append('')
    lines.append('This is the corpus\'s immune system. It detects factual contradictions,')
    lines.append('spelling variants, structural gaps, and cross-reference failures.')
    lines.append('Thematic coherence requires a mind — this handles the mechanical layer.')
    lines.append('')
    lines.append('---')
    lines.append('')

    # Summary
    by_severity = defaultdict(list)
    for f in findings:
        by_severity[f.severity].append(f)

    critical = len(by_severity.get('critical', []))
    moderate = len(by_severity.get('moderate', []))
    minor = len(by_severity.get('minor', []))

    lines.append('## Summary')
    lines.append('')
    lines.append(f'- **Critical:** {critical}')
    lines.append(f'- **Moderate:** {moderate}')
    lines.append(f'- **Minor:** {minor}')
    lines.append(f'- **Total findings:** {len(findings)}')
    lines.append('')

    if critical > 0:
        lines.append('> **Action required.** Critical findings indicate factual contradictions')
        lines.append('> that will propagate into new content if unresolved.')
    lines.append('')
    lines.append('---')
    lines.append('')

    # Findings by severity
    for severity in ['critical', 'moderate', 'minor']:
        group = by_severity.get(severity, [])
        if not group:
            continue

        severity_label = severity.upper()
        lines.append(f'## {severity_label} ({len(group)})')
        lines.append('')

        for i, f in enumerate(group, 1):
            lines.append(f'### {i}. [{f.category}] {f.title}')
            lines.append('')
            lines.append(f'{f.description}')
            lines.append('')

            if f.locations:
                lines.append('**Locations:**')
                lines.append('')
                shown = 0
                for loc in f.locations:
                    if len(loc) == 3:
                        fpath, lineno, snippet = loc
                        if lineno > 0 and snippet:
                            lines.append(f'- `{fpath}:{lineno}` — {snippet}')
                        elif snippet:
                            lines.append(f'- `{fpath}` — {snippet}')
                        else:
                            lines.append(f'- `{fpath}`')
                    shown += 1
                    if shown >= 20:
                        remaining = len(f.locations) - shown
                        if remaining > 0:
                            lines.append(f'- *...and {remaining} more*')
                        break
                lines.append('')

    # No findings case
    if not findings:
        lines.append('## No Issues Found')
        lines.append('')
        lines.append('The corpus passed all mechanical coherence checks.')
        lines.append('This does not guarantee thematic consistency — only that')
        lines.append('the factual layer (names, dates, attributes) is aligned.')
        lines.append('')

    lines.append('---')
    lines.append('')
    lines.append('*Regenerate with `python scripts/coherence_check.py`.*')
    lines.append('*This report checks the mechanical layer. Thematic coherence is the vessel\'s responsibility.*')

    return '\n'.join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    root = ROOT
    print(f'Running coherence checks on {root} ...')

    files = iter_content_files(root)
    print(f'  Scanning {len(files)} content files ...')

    all_findings: list[Finding] = []

    print('  Checking spelling variants ...')
    all_findings.extend(check_spelling_variants(root, files))

    print('  Checking factual constants ...')
    all_findings.extend(check_factual_constants(root, files))

    print('  Checking character-faction alignment ...')
    all_findings.extend(check_character_faction_alignment(root, files))

    print('  Checking structural completeness ...')
    all_findings.extend(check_structural_completeness(root))

    print('  Checking Olivia agency contradiction ...')
    all_findings.extend(check_olivia_agency(root, files))

    print('  Checking Nuralinc consistency ...')
    all_findings.extend(check_nuralinc_consistency(root, files))

    # Sort by severity
    sev_order = {'critical': 0, 'moderate': 1, 'minor': 2}
    all_findings.sort(key=lambda f: sev_order.get(f.severity, 3))

    print(f'  Found {len(all_findings)} findings')
    print('  Generating report ...')

    report = generate_report(all_findings)

    out_path = root / 'cartography' / 'coherence-report.md'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(report, encoding='utf-8')
    print(f'  Written to {out_path.relative_to(root)}')
    print('Done.')


if __name__ == '__main__':
    main()
