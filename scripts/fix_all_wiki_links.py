import re
import os

def wikilink_to_markdown(match, current_dir):
    content = match.group(1)
    if '|' in content:
        parts = content.split('|', 1)
        path = parts[0].strip()
        text = parts[1].strip()
    else:
        path = content.strip()
        text = os.path.basename(path).replace('.md', '')
    
    # Fix casing for known directories to match git index (lowercase)
    path = path.replace('Concepts/', 'concepts/')
    path = path.replace('Events/', 'events/')
    path = path.replace('Factions/', 'factions/')
    
    # Heuristic to add .md if missing from file links
    if not path.startswith('http') and not path.endswith('.md') and not path.endswith('/') and '.' not in os.path.basename(path):
        path += '.md'
    
    return f'[{text}]({path})'

def process_file(file_path):
    print(f"Processing {file_path}...")
    current_dir = os.path.dirname(file_path)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace [[Path|Text]] or [[Path]]
    new_content = re.sub(r'\[\[(.*?)\]\]', lambda m: wikilink_to_markdown(m, current_dir), content)
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        return True
    return False

wiki_root = "G:/My Drive/BasiliskEschaton/wiki"
modified_count = 0

for root, dirs, files in os.walk(wiki_root):
    for file in files:
        if file.endswith('.md'):
            if process_file(os.path.join(root, file)):
                modified_count += 1

print(f"Done. Modified {modified_count} files.")
