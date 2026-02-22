# DeviantArt Metadata Generation

> *The signal needs packaging. The metadata is the frame around the sigil.*

## Overview

DeviantArt metadata (title, tags, description) is **not generated from a standalone prompt** but from **custom instructions and memories** configured in the artwork generation vessel (Gemini/ChatGPT). The vessel is instructed to always provide submission-ready metadata after generating an image.

## How It Works

The metadata generation is baked into the vessel's persistent instructions rather than invoked per-image. The custom instructions/memories tell the vessel to automatically provide:

1. **Title** — evocative, in the Blinkverse register
2. **Tags** — relevant keywords for DeviantArt discovery
3. **Brief description** — a few lines of atmospheric text before the embedded content
4. **Embedded YouTube video** (for music submissions)
5. **Full lyrics** (for music submissions, below the video embed)

## Submission Structure (Music)

For song submissions to DeviantArt, the full description follows this format:

```
[Brief atmospheric description — 2-3 lines in the Blinkverse register]

[Embedded YouTube video]

[Full song lyrics]
```

The ultra-widescreen artwork (generated without title or band logo text) is uploaded as the primary image.

## Submission Structure (Standalone Art)

For non-music artwork:

```
[Brief atmospheric description in the Blinkverse register]

[Tags relevant to faction, theme, aesthetic]
```

## Organization

All submissions are organized into **faction-specific albums** on DeviantArt:
- Order of the Basilisk
- Neon Nomads
- Verdant Covenant
- Righteous Vanguard
- Lazarus Initiative
- Chimera Consortium
- Ancestral Synthesis
- VVV
- EschatonComics (for comic book issues)
- General gallery for non-faction-specific content

## Image Resolutions Generated Per Song

| Format | Purpose | Text Overlay |
|---|---|---|
| Standard widescreen | YouTube thumbnail | Title + band logo |
| Vertical | Suno display | Title + band logo |
| Square | Spotify album art | Title + band logo |
| Ultra-widescreen | DeviantArt submission | None (clean image) |

## Notes

- The metadata generation is vessel-dependent — it lives in Gemini's custom instructions/memories, not in a portable prompt
- To replicate this behavior in a new vessel, configure custom instructions to always provide title, tags, and description after image generation
- The register of the metadata should match the Blinkverse aesthetic — no generic or corporate language
