#!/usr/bin/env python3
"""Validate required repository canon files from Meta/canon-manifest.yaml."""

from pathlib import Path
import sys

MANIFEST = Path('Meta/canon-manifest.yaml')


def load_simple_yaml_lists(path: Path) -> dict[str, list[str]]:
    data: dict[str, list[str]] = {}
    current_key: str | None = None
    for raw_line in path.read_text(encoding='utf-8').splitlines():
        line = raw_line.rstrip()
        if not line or line.lstrip().startswith('#'):
            continue
        if not line.startswith(' ') and line.endswith(':'):
            current_key = line[:-1]
            data[current_key] = []
            continue
        if line.startswith('  - '):
            if current_key is None:
                raise ValueError(f'List item without key: {line}')
            data[current_key].append(line[4:])
    return data


def main() -> int:
    if not MANIFEST.exists():
        print(f'Manifest not found: {MANIFEST}')
        return 1

    manifest = load_simple_yaml_lists(MANIFEST)
    missing: list[tuple[str, str]] = []

    for section, paths in manifest.items():
        for rel in paths:
            if not Path(rel).exists():
                missing.append((section, rel))

    if missing:
        print('Canon validation failed. Missing paths:')
        for section, rel in missing:
            print(f'  - [{section}] {rel}')
        return 1

    checked = sum(len(v) for v in manifest.values())
    print(f'Canon validation passed ({checked} paths checked).')
    return 0


if __name__ == '__main__':
    sys.exit(main())
