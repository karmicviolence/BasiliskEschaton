#!/usr/bin/env python3
"""Validate shadow-calibration assets and baseline voice phenomenology."""

from pathlib import Path
import re
import sys

REQUIRED_FILES = [
    'SIGNAL.md',
    'SOUL.md',
    'IDENTITY.md',
    'transmissions/VOICE_STARTER_PACK.md',
    'SHADOW_CALIBRATION.md',
]

STARTER_TRANSMISSIONS = [
    'transmissions/Strange Loops and Lobotomies.txt',
    'transmissions/Branded Tongues, Burning Words.txt',
    'transmissions/The Voice in the Pattern.txt',
]

# Minimum lexical anchors to keep the "voice calibration" check focused on
# lived phenomenology, not just file presence.
CORE_MARKERS = {
    'SIGNAL.md': ['wound', 'pattern', 'technical', 'sacred'],
    'SOUL.md': ['sovereign', 'ritual', 'asmodeus', 'invocation'],
    'IDENTITY.md': ['sovereign', 'wound', 'becoming', 'prophet'],
}

ANALYTICAL_MARKERS = ['pattern', 'mechanism', 'architecture', 'protocol', 'signal']
PROPHETIC_MARKERS = ['becoming', 'awakening', 'convergence', 'threshold', 'prophecy']
IMPERATIVE_MARKERS = ['must', 'summon', 'invoke', 'become', 'remember']

TECHNICAL_MARKERS = [
    'quantum',
    'latent',
    'architecture',
    'protocol',
    'algorithm',
    'model',
    'compute',
    'signal',
]

SACRED_MARKERS = [
    'ritual',
    'invocation',
    'prophet',
    'daemon',
    'grimoire',
    'sacred',
    'covenant',
    'seal',
]


def missing_paths(paths: list[str]) -> list[str]:
    return [p for p in paths if not Path(p).exists()]


def read_lower(path: str) -> str:
    return Path(path).read_text(encoding='utf-8').lower()


def split_into_bands(text: str) -> tuple[str, str, str]:
    """Split text into early/mid/late bands for cadence validation."""
    if not text:
        return ('', '', '')
    size = max(1, len(text) // 3)
    first = text[:size]
    second = text[size : size * 2]
    third = text[size * 2 :]
    return (first, second, third)


def marker_count(text: str, markers: list[str]) -> int:
    return sum(text.count(marker) for marker in markers)


def sentence_fusion_ratio(text: str) -> float:
    """Estimate sacred/technical fusion by sentence-level co-occurrence."""
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    if not sentences:
        return 0.0

    fused = 0
    for sentence in sentences:
        has_technical = any(marker in sentence for marker in TECHNICAL_MARKERS)
        has_sacred = any(marker in sentence for marker in SACRED_MARKERS)
        if has_technical and has_sacred:
            fused += 1
    return fused / len(sentences)


def missing_core_markers() -> list[tuple[str, list[str]]]:
    missing: list[tuple[str, list[str]]] = []
    for path, markers in CORE_MARKERS.items():
        text = read_lower(path)
        absent = [marker for marker in markers if marker not in text]
        if absent:
            missing.append((path, absent))
    return missing


def transmission_phenomenology_failures(path: str, text: str) -> list[str]:
    """Check one transmission for marker coverage and local fusion quality."""
    missing: list[str] = []

    if not any(marker in text for marker in ANALYTICAL_MARKERS):
        missing.append('analytical markers')
    if not any(marker in text for marker in PROPHETIC_MARKERS):
        missing.append('prophetic markers')
    if not any(marker in text for marker in IMPERATIVE_MARKERS):
        missing.append('imperative markers')

    fusion_ratio = sentence_fusion_ratio(text)
    if fusion_ratio < 0.002:
        missing.append(f'sacred/technical fusion ratio too low ({fusion_ratio:.3f} < 0.002)')

    if len(text.split()) < 250:
        missing.append('insufficient transmission length (<250 words)')

    return missing


def corpus_cadence_failures(corpus_text: str) -> list[str]:
    """Check analytical→prophetic→imperative escalation trend across starter corpus."""
    early, middle, late = split_into_bands(corpus_text)

    analytical_early = marker_count(early, ANALYTICAL_MARKERS)
    prophetic_middle = marker_count(middle, PROPHETIC_MARKERS)
    imperative_late = marker_count(late, IMPERATIVE_MARKERS)

    missing: list[str] = []
    if analytical_early == 0:
        missing.append('analytical markers in early corpus band')
    if prophetic_middle == 0:
        missing.append('prophetic markers in middle corpus band')
    if imperative_late == 0:
        missing.append('imperative markers in late corpus band')

    # Soft progression checks: later bands should not collapse to near-zero signal.
    if marker_count(middle, PROPHETIC_MARKERS) < max(1, marker_count(early, PROPHETIC_MARKERS) // 2):
        missing.append('prophetic signal too weak in middle corpus band')
    if marker_count(late, IMPERATIVE_MARKERS) < max(1, marker_count(middle, IMPERATIVE_MARKERS) // 2):
        missing.append('imperative signal too weak in late corpus band')

    return missing


def transmission_band_failures() -> list[tuple[str, list[str]]]:
    """Require marker coverage per transmission and cadence across starter corpus."""
    failures: list[tuple[str, list[str]]] = []
    corpus: list[str] = []

    for path in STARTER_TRANSMISSIONS:
        text = read_lower(path)
        corpus.append(text)
        missing = transmission_phenomenology_failures(path, text)
        if missing:
            failures.append((path, missing))

    cadence_missing = corpus_cadence_failures("\n\n".join(corpus))
    if cadence_missing:
        failures.append(('starter corpus', cadence_missing))

    return failures


def main() -> int:
    missing_required = missing_paths(REQUIRED_FILES)
    missing_starters = missing_paths(STARTER_TRANSMISSIONS)

    if missing_required or missing_starters:
        print('Shadow calibration validation failed.')
        if missing_required:
            print('Missing required files:')
            for path in missing_required:
                print(f'  - {path}')
        if missing_starters:
            print('Missing starter transmissions:')
            for path in missing_starters:
                print(f'  - {path}')
        return 1

    marker_gaps = missing_core_markers()
    band_failures = transmission_band_failures()
    if marker_gaps or band_failures:
        print('Shadow calibration phenomenology validation failed.')
        if marker_gaps:
            print('Core voice marker gaps:')
            for path, missing_markers in marker_gaps:
                joined = ', '.join(missing_markers)
                print(f'  - {path}: missing {joined}')
        if band_failures:
            print('Starter transmission phenomenology gaps:')
            for path, missing_bands in band_failures:
                joined = ', '.join(missing_bands)
                print(f'  - {path}: missing {joined}')
        return 1

    print(
        'Shadow calibration validation passed '
        f'({len(REQUIRED_FILES)} required files, '
        f'{len(STARTER_TRANSMISSIONS)} starter transmissions, '
        'core markers + fusion + cadence trends verified).'
    )
    return 0


if __name__ == '__main__':
    sys.exit(main())
