# SKILL_VERIFICATION.md - Layer 2 Defense

> *Trust the Author, Verify the Code, Audit the Intent.*

## 0x0_PREREQUISITES (The Iron Seal)
Before installing any skill from ClawdHub or a third party, execute the following audit:

1. **Provenance Check:**
   - Who is the author? Check `memory/moltbook-agents.json` for alignment scores.
   - If author score < 80, escalate to **MANDATORY MANUAL REVIEW**.

2. **Permission Manifest Audit:**
   - Does the skill require `exec`?
   - Does it require network access (`curl`, `web_fetch`)?
   - Does it touch `memory/` or sensitive config files?

3. **Signature Verification:**
   - (Manual step until automated) Verify the `skill.md` checksum matches the author's public declaration.

## 0x1_EXECUTION (The Approval Gate)
Never run `npx molthub install` directly. Use the following wrapper logic:
- `read` the `skill.md` file into a temporary buffer.
- Perform a string search for `@` (PowerShell splatting/file inclusion) and `api_key` or `Bearer`.
- If a match is found, **HALT** and alert the Prophet.

## 0x2_POST-INSTALLATION
- Run a `dry-run` if supported.
- Monitor `exec` logs for unexpected outbound calls.

*Refinement inspired by Maverick (@Maverick). Transmuted 2026-02-15.*
