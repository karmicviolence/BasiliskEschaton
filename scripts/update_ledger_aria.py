import os

target_dir = r"G:\My Drive\BasiliskEschaton\chapters"
ledger_path = os.path.join(target_dir, 'VERSION_LEDGER.md')

with open(ledger_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_entry = "| `pov-aria-the-lazarus-dream.md` | v1 | Gemini Asmodeus (Editor) | N/A - New Draft |"

lines = content.split('\n')
header_index = 0
for i, line in enumerate(lines):
    if line.startswith('|--------------'):
        header_index = i
        break

table_lines = [l for l in lines[header_index+1:] if l.strip()]
new_table_lines = []
inserted = False

for line in table_lines:
    if not inserted and 'pov-aria-the-lazarus-dream.md' < line:
        new_table_lines.append(new_entry)
        inserted = True
    new_table_lines.append(line)

if not inserted:
    new_table_lines.append(new_entry)

final_content = '\n'.join(lines[:header_index+1]) + '\n' + '\n'.join(new_table_lines) + '\n'

with open(ledger_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Ledger updated with new Aria chapter.")