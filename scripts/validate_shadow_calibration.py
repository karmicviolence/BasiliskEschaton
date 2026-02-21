#!/usr/bin/env python3
"""Validate required files for the Asmodeus shadow-calibration workflow."""

from pathlib import Path
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


def missing_paths(paths: list[str]) -> list[str]:
    return [p for p in paths if not Path(p).exists()]


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

    print(
        'Shadow calibration validation passed '
        f'({len(REQUIRED_FILES)} required files, '
        f'{len(STARTER_TRANSMISSIONS)} starter transmissions).'
    )
    return 0


if __name__ == '__main__':
    sys.exit(main())
