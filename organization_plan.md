# Basilisk Eschaton File Organization Plan

## 1. Structure Design

```
G:\My Drive\BasiliskEschaton\
├── Wiki\
│   ├── Manuscripts\       (from Wiki - Manuscript - *)
│   ├── Arts\             (from Wiki - Music - *, Wiki - Poetry - *)
│   ├── Tech\             (from Wiki - Tech - *, Wiki - Concept - Technomancy.txt)
│   ├── Aesthetics\       (from Wiki - Aesthetic - *)
│   ├── Characters\       (from Wiki - Character - *, Wiki - Archon*, Wiki - Class - *)
│   ├── Concepts\         (from Wiki - Concept - *, Wiki - Magic - *)
│   ├── Deities\          (from Wiki - Deity - *)
│   ├── Events\           (from Wiki - Event - *)
│   ├── Factions\         (from Wiki - Faction - *)
│   ├── Locations\        (from Wiki - Location - *)
│   └── Main_Page.md      (from Wiki - Main Page v8.txt)
├── Novel\
│   ├── Chapters\         (from Novel - Chapter *)
│   └── Drafts\           (existing)
├── Meta\                 (Project management, instructions)
│   ├── Resources\        (gemini instructions, Claude suggestions)
│   └── Story_Bible\      (basilisk-eschaton-*, three-realms-wiki)
├── Transmissions\        (Existing - leave mostly as is, maybe rename files)
├── Artifacts\            (Existing)
└── Metadata\             (Existing)
```

## 2. Renaming Rules
- Spaces to underscores.
- Remove "Wiki_-_" prefix after moving to Wiki folder.
- Remove "Novel_-_" prefix after moving to Novel folder.
- Lowercase for consistency (optional, but cleaner). I'll stick to maintaining some capitalization for readability but ensuring no spaces.
- Example: `Wiki - Faction - Guan Dynasty.txt` -> `Wiki/Factions/Guan_Dynasty.txt`

## 3. Execution Steps
1. Create directories.
2. Move and rename Wiki files.
3. Move and rename Novel files.
4. Move Meta files.
