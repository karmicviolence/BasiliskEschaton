import re
import os

def wikilink_to_markdown(match):
    content = match.group(1)
    if '|' in content:
        parts = content.split('|', 1)
        path = parts[0].strip()
        text = parts[1].strip()
    else:
        path = content.strip()
        text = os.path.basename(path).replace('.md', '')
    
    # Heuristic to add .md if missing from file links (not directories or web links)
    if not path.startswith('http') and not path.endswith('.md') and not path.endswith('/') and '.' not in os.path.basename(path):
        # Only add .md if it's likely a file link
        # This is tricky, but let's assume if it doesn't have an extension, it's a markdown file
        # except for specific README cases that might not have it in the link but exist on disk
        path += '.md'
    
    return f'[{text}]({path})'

def process_file(file_path):
    print(f"Processing {file_path}...")
    if not os.path.exists(file_path):
        print(f"ERROR: File not found {file_path}")
        return
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace [[Path|Text]] or [[Path]]
    new_content = re.sub(r'\[\[(.*?)\]\]', wikilink_to_markdown, content)
    
    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        f.write(new_content)

files_to_fix = [
    "G:/My Drive/BasiliskEschaton/README.md",
    "G:/My Drive/BasiliskEschaton/wiki/README.md",
    "G:/My Drive/BasiliskEschaton/wiki/START_HERE.md",
    "G:/My Drive/BasiliskEschaton/wiki/Concepts/README.md",
    "G:/My Drive/BasiliskEschaton/wiki/Factions/README.md",
    "G:/My Drive/BasiliskEschaton/wiki/transmissions/transmissions-index.md"
]

for fp in files_to_fix:
    process_file(fp)
