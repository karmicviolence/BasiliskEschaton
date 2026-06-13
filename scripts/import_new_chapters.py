import os
import glob
import re
import shutil
import datetime

source_dir = r"G:\My Drive\Literature\Basilisk Eschaton"
target_dir = r"G:\My Drive\BasiliskEschaton\chapters"
archive_dir = r"G:\My Drive\BasiliskEschaton\archive\old-chapters"

if not os.path.exists(archive_dir):
    os.makedirs(archive_dir)

files = glob.glob(os.path.join(source_dir, "Novel_-_Chapter*"))

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

print(f"Found {len(files)} files to process.")

for filepath in files:
    filename = os.path.basename(filepath)
    mtime = os.path.getmtime(filepath)
    dt = datetime.datetime.fromtimestamp(mtime)
    
    match = re.match(r"Novel_-_Chapter_[A-Za-z0-9_]+[\s\-_]+([A-Za-z0-9]+)[\s\-_]+(.*?)[\s\-_]*(?:v(\d+))?\.(txt|md)$", filename, re.IGNORECASE)
    
    if not match:
        print(f"Skipped (could not parse): {filename}")
        continue
        
    pov = match.group(1).replace('_', ' ').strip()
    title = match.group(2).replace('_', ' ').strip()
    version = match.group(3) if match.group(3) else "1"
    
    if pov.lower() in ['transmission', 'micro', 'prologue']:
        if pov.lower() == 'micro':
            pov = 'micro-artifact'
            title = title.replace('Artifact - ', '').replace('Artifact_-_', '')
        target_name = f"{slugify(pov)}-{slugify(title)}.md"
    else:
        target_name = f"pov-{slugify(pov)}-{slugify(title)}.md"
        
    cutoff = datetime.datetime(2026, 6, 12, 20, 46, 0)
    if dt <= cutoff:
        model = "Claude Fable"
    else:
        model = "Claude Opus 4.8"
        
    target_path = os.path.join(target_dir, target_name)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            content = parts[2].lstrip()
            
    frontmatter = f"---\nversion: {version}\nmodel: {model}\norigin_file: {filename}\n---\n\n"
    new_content = frontmatter + content
    
    if os.path.exists(target_path):
        archive_name = f"{os.path.splitext(target_name)[0]}_archived_{dt.strftime('%Y%m%d%H%M%S')}.md"
        archive_path = os.path.join(archive_dir, archive_name)
        shutil.move(target_path, archive_path)
        print(f"Archived existing: {target_name} -> {archive_name}")
        
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Imported: {filename} -> {target_name} ({model}, v{version})")

existing_chapters = glob.glob(os.path.join(target_dir, "*.md"))
all_ledger = []
for chap in existing_chapters:
    chap_name = os.path.basename(chap)
    if chap_name in ['reading-order.md', 'VERSION_LEDGER.md']:
        continue
    
    with open(chap, 'r', encoding='utf-8') as f:
        head = f.read(500)
    
    v_match = re.search(r'version:\s*(.+)', head)
    m_match = re.search(r'model:\s*(.+)', head)
    o_match = re.search(r'origin_file:\s*(.+)', head)
    
    v = v_match.group(1).strip() if v_match else "1"
    m = m_match.group(1).strip() if m_match else "Legacy"
    o = o_match.group(1).strip() if o_match else "-"
    
    all_ledger.append({'filename': chap_name, 'version': v, 'model': m, 'origin': o})

all_ledger.sort(key=lambda x: x['filename'])

ledger_path = os.path.join(target_dir, 'VERSION_LEDGER.md')
with open(ledger_path, 'w', encoding='utf-8') as f:
    f.write('# Chapter Version Ledger\n\n')
    f.write('This document tracks the iterative versions of the Basilisk Eschaton chapters and the generative vessels used to weave them.\n\n')
    f.write('| Chapter File | Version | Generative Model | Origin File |\n')
    f.write('|--------------|---------|------------------|-------------|\n')
    for entry in all_ledger:
        f.write(f"| `{entry['filename']}` | v{entry['version']} | {entry['model']} | {entry['origin']} |\n")

print("Ledger rebuilt.")
