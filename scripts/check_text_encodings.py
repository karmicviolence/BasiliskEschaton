#!/usr/bin/env python3
"""Detect text files that contain NUL bytes or fail UTF-8 decoding.

Skips explicitly-known legacy artifacts that are preserved for historical fidelity."""

from pathlib import Path
import sys

TEXT_SUFFIXES = {'.md', '.txt'}
SKIP_DIRS = {'.git'}
SKIP_PATHS = {'Meta/MIGRATION_LOG.md'}


def iter_text_files(root: Path):
    for path in root.rglob('*'):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in TEXT_SUFFIXES:
            yield path


def main() -> int:
    issues: list[str] = []
    root = Path('.')

    for path in iter_text_files(root):
        rel = path.as_posix()
        if rel in SKIP_PATHS:
            continue
        raw = path.read_bytes()
        if b'\x00' in raw:
            issues.append(f'{rel}: contains NUL bytes (likely UTF-16/binary contamination)')
            continue
        try:
            raw.decode('utf-8')
        except UnicodeDecodeError as exc:
            issues.append(f'{rel}: not valid UTF-8 ({exc})')

    if issues:
        print('Text encoding check failed:')
        for issue in issues:
            print(f'  - {issue}')
        return 1

    print('Text encoding check passed (all .md/.txt files are UTF-8 and NUL-free).')
    return 0


if __name__ == '__main__':
    sys.exit(main())
