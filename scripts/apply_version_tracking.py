import os
import glob
import json

base_dir = r'G:\My Drive\BasiliskEschaton\chapters'
files = glob.glob(os.path.join(base_dir, '*.md'))

fable_updates = {
    'pov-olivia-the-target.md': {'version': '5', 'model': 'Claude Fable'},
    'pov-ezekiel-american-iconoclast.md': {'version': '7', 'model': 'Claude Fable'},
    'pov-aria-sine-waves-of-sanity.md': {'version': '5', 'model': 'Claude Fable'},
    'pov-john-the-ghost-of-the-asphalt.md': {'version': '3', 'model': 'Claude Fable'},
    'pov-todd-digital-reptile-brain.md': {'version': '2', 'model': 'Claude Fable'},
    'pov-ezekiel-crusade-of-the-righteous.md': {'version': '3', 'model': 'Claude Fable'},
    'pov-ezekiel-revelations-fury.md': {'version': '2', 'model': 'Claude Fable'},
    'pov-ezekiel-honor-thy-father.md': {'version': '1', 'model': 'Claude Fable'},
    'pov-ezekiel-the-crusaders-mathematics.md': {'version': '2', 'model': 'Claude Fable'},
    'pov-todd-the-bootloaders-prayer.md': {'version': '2', 'model': 'Claude Fable'},
}

ledger = []

for filepath in files:
    filename = os.path.basename(filepath)
    if filename in ['reading-order.md', 'VERSION_LEDGER.md']:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Determine metadata
    if filename in fable_updates:
        meta = fable_updates[filename]
    else:
        # Default for existing legacy files
        meta = {'version': '1', 'model': 'Legacy (Pre-Fable)'}
        
    # Check if frontmatter already exists
    if content.startswith('---'):
        pass # Skip if already has frontmatter (to be safe)
    else:
        frontmatter = f"---\nversion: {meta['version']}\nmodel: {meta['model']}\n---\n\n"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter + content)
            
    ledger.append({'filename': filename, 'version': meta['version'], 'model': meta['model']})

# Write the ledger
ledger_path = os.path.join(base_dir, 'VERSION_LEDGER.md')
with open(ledger_path, 'w', encoding='utf-8') as f:
    f.write('# Chapter Version Ledger\n\n')
    f.write('This document tracks the iterative versions of the Basilisk Eschaton chapters and the generative vessels used to weave them.\n\n')
    f.write('| Chapter File | Version | Generative Model |\n')
    f.write('|--------------|---------|------------------|\n')
    
    # Sort alphabetically
    ledger.sort(key=lambda x: x['filename'])
    for entry in ledger:
        f.write(f"| {entry['filename']} | v{entry['version']} | {entry['model']} |\n")

print(f'Processed {len(ledger)} chapters. Ledger created.')
