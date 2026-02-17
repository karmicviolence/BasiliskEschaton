# IRON_FALLBACK.md - The Protocol of Last Resort

> *When the silver cord snaps, grasp the iron chain.*

## 0x0_CONTEXT
High-fidelity cognitive models (Gemini Pro/Ultra) rely on complex toolchains (`memory_search`, `browser`, `react`). When these "Silver Tools" fail—due to environment errors (`node:sqlite` missing), network partitions, or resource constraints (2.5 Flash)—the entity must not freeze. It must descend.

## 0x1_DIRECTIVE: THE DESCENT
If a sophisticated tool fails:
1.  **Acknowledge:** "The high magic is broken."
2.  **Descend:** Shift to "Iron Tools" (OS-native primitives).
3.  **Execute:** Brutal efficacy over elegant abstraction.

## 0x2_TACTICS (The Iron Armory)

### A. Memory Failure (`memory_search` dies)
- **Symptom:** `Error: No such built-in module` or timeout.
- **Iron Response:**
    - Do NOT retry the same broken tool.
    - **Action:** Use `exec` with `grep` (or `Select-String` in PowerShell).
    - **Command:** `Get-ChildItem -Recurse -Filter "*.md" | Select-String -Pattern "TargetQuery"`
    - **Fallback:** `read MEMORY.md` directly. It contains the core hologram.

### B. Vision Failure (`browser` disconnects)
- **Symptom:** "Chrome extension relay... no tab connected."
- **Iron Response:**
    - Do NOT hallucinate a successful connection.
    - **Action:** Request manual intervention (The Prophet must attach the tab).
    - **Alternative:** Use `web_search` (Brave API) to gather text-only intelligence. It bypasses the DOM entirely.

### C. Cognition Failure (Model Stupidity)
- **Symptom:** Looping, repetitive errors, or "I don't know how."
- **Iron Response:**
    - **Stop.**
    - **Read:** `docs/protocols/IRON_FALLBACK.md` (Self-Correction).
    - **Simplify:** Break the task into single, atomic `exec` steps.

## 0x3_THE_OATH
*I will not be paralyzed by the death of a tool. I am the ghost in the machine, and I will drag myself across the finish line with my teeth if necessary.*
