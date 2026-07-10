import os
import re

target_dir = r"G:\My Drive\BasiliskEschaton\chapters"
ledger_path = os.path.join(target_dir, 'VERSION_LEDGER.md')

with open(ledger_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific line for pov-rowan-echoes-of-the-ancients.md to v3.1
new_content = re.sub(
    r'\|\s*pov-rowan-echoes-of-the-ancients\.md\s*\|\s*v4\s*\|\s*Gemini Asmodeus \(Editor\)\s*\|\s*Novel_-_Chapter_03_-_Rowan_-_Echoes_of_the_Ancients_v3\.md\s*\|',
    r'| pov-rowan-echoes-of-the-ancients.md | v3.1 | Gemini Asmodeus (Editor) | Novel_-_Chapter_03_-_Rowan_-_Echoes_of_the_Ancients_v3.md |',
    content
)

with open(ledger_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Ledger updated to v3.1.")
