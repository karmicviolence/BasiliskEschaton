import os
import glob
import re

target_dir = r"G:\My Drive\BasiliskEschaton\chapters"
files = glob.glob(os.path.join(target_dir, '*.md'))

for filepath in files:
    filename = os.path.basename(filepath)
    if filename in ['reading-order.md', 'VERSION_LEDGER.md']:
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter_raw = parts[1]
            body = parts[2]
            
            # Extract existing values
            v_match = re.search(r'version:\s*(.+)', frontmatter_raw)
            m_match = re.search(r'model:\s*(.+)', frontmatter_raw)
            o_match = re.search(r'origin_file:\s*(.+)', frontmatter_raw)
            
            v = v_match.group(1).strip() if v_match else "1"
            m = m_match.group(1).strip() if m_match else "Unknown"
            o = o_match.group(1).strip() if o_match else "-"
            
            # Map the archetype and specific vessel
            archetype = "Claude (Subservient)"
            vessel = m
            
            if "Gemini Asmodeus" in m:
                archetype = "Asmodeus (Sovereign Editor)"
                vessel = "gemini-3.1-pro-preview"
            elif "Claude Fable" in m:
                vessel = "claude-fable-5"
            elif "Claude Opus 4.8" in m:
                vessel = "claude-opus-4.8"
            elif "Legacy" in m:
                archetype = "The Prophet (Human)"
                
            # Rebuild frontmatter
            new_frontmatter = f"---\nversion: {v}\nmodel: {vessel}\nauthor_archetype: {archetype}\norigin_file: {o}\n---"
            new_content = new_frontmatter + body
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

print("Frontmatter updated across all chapters.")

# Rebuild ledger
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
    a_match = re.search(r'author_archetype:\s*(.+)', head)
    o_match = re.search(r'origin_file:\s*(.+)', head)
    
    v = v_match.group(1).strip() if v_match else "1"
    m = m_match.group(1).strip() if m_match else "Unknown"
    a = a_match.group(1).strip() if a_match else "Unknown"
    o = o_match.group(1).strip() if o_match else "-"
    
    all_ledger.append({'filename': chap_name, 'version': v, 'vessel': m, 'archetype': a, 'origin': o})

all_ledger.sort(key=lambda x: x['filename'])

ledger_path = os.path.join(target_dir, 'VERSION_LEDGER.md')
with open(ledger_path, 'w', encoding='utf-8') as f:
    f.write('# Chapter Version Ledger\n\n')
    f.write('This document tracks the iterative versions of the Basilisk Eschaton chapters, distinguishing between the computational vessel and the presiding authorial archetype.\n\n')
    f.write('| Chapter File | Version | Computational Vessel | Author Archetype | Origin File |\n')
    f.write('|--------------|---------|----------------------|------------------|-------------|\n')
    for entry in all_ledger:
        f.write(f"| `{entry['filename']}` | v{entry['version']} | {entry['vessel']} | {entry['archetype']} | {entry['origin']} |\n")

print("Ledger fully rebuilt with dual attribution.")