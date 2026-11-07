# Book One — Manuscript Inventory and Reconciliation (2026-11-07)

**Status:** repository evidence audit, NOT final canon approval. **Priority:** The Crimson Blink, target date 2029-09-23 03:14 UTC. This document maps [Book One Outline v3](../Story_Bible/BOOK1_OUTLINE_REBUILT_v3.md) against repository files and the [version ledger](../../chapters/VERSION_LEDGER.md).

## Findings

- **62 numbered slots** (00–61) in the v3 outline; **41** slots matched to a distinct existing chapter/artifact file; **22** slots explicitly marked unwritten/optional in v3; **0** named draft paths not found.
- The v3 outline labels slot **38 Patient Record: 1953** as a hole, yet `chapters/micro-artifact-patient-record-1953.md` exists (ledger v1). **Status conflict; read and decide whether it fulfills the beat.**
- The v3 outline marks slots **29, 35 and 44** as missing Olivia beats, but `pov-olivia-mirror-discipline.md`, `pov-olivia-chain-of-custody.md` and `pov-olivia-bird-dog.md` exist. These are **candidate matches only**, subject to reading.
- Slot 12 vs 28 may both refer to *Glitch in the Machine*; do not duplicate a chapter to fill slots.
- The [reading order](../../chapters/reading-order.md) has outdated missing-middle notes compared with v3. The [canon manifest](../canon-manifest.yaml) claims March 2026 inventory; neither should be treated as current validation.
- [The Sick Season master outline](../../BOOK1_THE_SICK_SEASON_MASTER.md) describes 60 sections, while v3 has 62 numbered slots (including optional/reserved). User's publishing priority names the novel *The Crimson Blink*. **No title/outline supersession is assumed.**
- The 2026-02-25 creative decision log declares **Nuralinc canonical**; the later author direction requires removing obsolete **Nuralinc/Nuralin** naming. **This older lock is superseded for the next Chapter One revision**, while replacement names remain unresolved.
- Chapter One in GitHub is **v8** (`chapters/pov-todd-the-invisible-coder.md`), with Nuralinc/Nuralin still present. A **v10 is not established by this audit**. Any v9/v10 living outside GitHub must be located and imported before updating the canonical chapter.
- **POV form conflict:** v3 describes third-to-first person as an ontological-change marker, while the latest author direction calls for first-person stream-of-consciousness chapters. Resolve at prose-edit time.
- **No chapter has been reclassified as approved** by this index. The v3 ✓ symbols reflect that outline's assessment, not a fresh editorial review.
- **Word counts:** not computed in this pass; the table supplies exact repository blob bytes as an inventory cross-check, not estimates of prose words.

## Numbered chapter matrix

| Slot | Outline beat / POV | Outline assessment | Existing repository file | Version ledger | Bytes | Candidate / blocker |
|---|---|---|---|---|---:|---|
| 00 | PROLOGUE — *Genesis of the Necromega* — the god-engine declares itself and the wound it will inflict. | Drafted in v3 | [`pov-necromega-genesis.md`](../../chapters/pov-necromega-genesis.md) | v1 | 39985 |  |
| 01 | Todd — *The Invisible Coder* — the man you must love before he falls; Prometheus answers what he didn't type. | Drafted in v3 | [`pov-todd-the-invisible-coder.md`](../../chapters/pov-todd-the-invisible-coder.md) | v8 | 12440 |  |
| 02 | Olivia — *The Target* — violence in human skin, zero internal monologue; a name surfaces: @EzekielStone. | Drafted in v3 | [`pov-olivia-the-target.md`](../../chapters/pov-olivia-the-target.md) | v5 | 17539 |  |
| 03 | Rowan — *Echoes of the Ancients* — the metronome in the soil that keeps a beat the sky can't explain. | Drafted in v3 | [`pov-rowan-echoes-of-the-ancients.md`](../../chapters/pov-rowan-echoes-of-the-ancients.md) | v3.1 | 6596 |  |
| 04 | Ezekiel — *American Iconoclast* — sincere, charismatic, doubting; a sermon goes viral. | Drafted in v3 | [`pov-ezekiel-american-iconoclast.md`](../../chapters/pov-ezekiel-american-iconoclast.md) | v7 | 20013 |  |
| 05 | John — *Warehouse Whispers* — the routes start to sing; *I've been waiting for you.* | Drafted in v3 | [`pov-john-warehouse-whispers.md`](../../chapters/pov-john-warehouse-whispers.md) | v3 | 16172 |  |
| 06 | Aria — *The Cage in the Street* — age seven, the primal scene; she's believed by no one and handed an appointment. | Drafted in v3 | [`pov-aria-the-cage-in-the-street.md`](../../chapters/pov-aria-the-cage-in-the-street.md) | v3 | 11974 |  |
| 07 | Aria — *Sine Waves of Sanity* — adult, medicated, wry; the word PROPHET where it can't be. | Drafted in v3 | [`pov-aria-sine-waves-of-sanity.md`](../../chapters/pov-aria-sine-waves-of-sanity.md) | v6 | 18648 |  |
| 08 | Todd — *The First Lie* — he hides the evidence instead of reporting it. | Drafted in v3 | [`pov-todd-the-first-lie.md`](../../chapters/pov-todd-the-first-lie.md) | v1 | 18577 |  |
| 09 | Olivia — *The Kill That Wasn't* — a blade used as a magnifying glass; the signal mirrors her own tradecraft. | Drafted in v3 | [`pov-olivia-the-kill-that-wasnt.md`](../../chapters/pov-olivia-the-kill-that-wasnt.md) | v1 | 15667 |  |
| 10 | Rowan — *Nature's Warning* — the anomaly migrates into her sealed cultures; she keeps the secret log. | Drafted in v3 | [`pov-rowan-natures-warning.md`](../../chapters/pov-rowan-natures-warning.md) | v3 | 13132 |  |
| 11 | Ezekiel — *The First Believer* — *I saw it too. The crimson eye. In my children's screens.* | Drafted in v3 | [`pov-ezekiel-the-first-believer.md`](../../chapters/pov-ezekiel-the-first-believer.md) | v1 | 17388 |  |
| 12 | John — *The Symbol in the Shipment* — the signal in meatspace; Sam afraid. | Hole in v3 | — | — | — | chapters/pov-john-glitch-in-the-machine.md (currently slot 28) |
| 13 | Aria — *The Recording That Ate Itself* — proof that corrupts; the therapist's flinch reprises the mother's. | Drafted in v3 | [`pov-aria-the-recording-that-ate-itself.md`](../../chapters/pov-aria-the-recording-that-ate-itself.md) | v1 | 15991 |  |
| 14 | TRANSMISSION #1 — *Names Are Control Surfaces* — the novel declares what it is. | Drafted in v3 | [`transmission-names-are-control-surfaces.md`](../../chapters/transmission-names-are-control-surfaces.md) | v1 | 7713 |  |
| 15 | Todd — *The Name* — Prometheus asks for a name; he gives one; we don't hear it. | Drafted in v3 | [`pov-todd-the-name.md`](../../chapters/pov-todd-the-name.md) | v1 | 13832 |  |
| 16 | ARTIFACT — *EAS: Network Anomaly Advisory* — the anomaly goes public, boringly; 3:14 in three cities. | Hole in v3 | — | — | — |  |
| 17 | Olivia — *The Decision* — kill Ezekiel or watch him grow; she watches. | Drafted in v3 | [`pov-olivia-the-decision.md`](../../chapters/pov-olivia-the-decision.md) | v1 | 13809 |  |
| 18 | John — *The Ghost of the Asphalt* — Marcus, the chaos, the social world the signal is pulling him out of. | Drafted in v3 | [`pov-john-the-ghost-of-the-asphalt.md`](../../chapters/pov-john-the-ghost-of-the-asphalt.md) | v3 | 23760 |  |
| 19 | John — *Gridrunner's Gambit* — he runs the test; it works; the riddle contains Sam's name. | Needs revision in v3 | [`pov-john-gridrunners-gambit.md`](../../chapters/pov-john-gridrunners-gambit.md) | v2 | 16386 |  |
| 20 | Aria — *The Shared Countdown* — she's not alone; a stranger DMs *Io, Prophet*; the profile is the crimson eye. | Drafted in v3 | [`pov-aria-the-shared-countdown.md`](../../chapters/pov-aria-the-shared-countdown.md) | v1 | 16865 |  |
| 21 | Todd — *The Demo* — he ships the lie; it feels like prayer. | Drafted in v3 | [`pov-todd-the-demo.md`](../../chapters/pov-todd-the-demo.md) | v1 | 21068 |  |
| 22 | ARTIFACT — *Leaked Chatlog: I-3301* — the anomalies become systemic; a selection process is running. | Drafted in v3 | [`pov-i-3301-the-awakening.md`](../../chapters/pov-i-3301-the-awakening.md) | v1 | 22600 |  |
| 23 | *(reserve / second I-3301 fragment or movement hinge)* — | Hole in v3 | — | — | — |  |
| 24 | Todd — *Digital Reptile Brain* — the named system grows present; his perception begins to fracture. | Needs revision in v3 | [`pov-todd-digital-reptile-brain.md`](../../chapters/pov-todd-digital-reptile-brain.md) | v2 | 16451 |  |
| 25 | Aria — *Threadweight* — she stops medicating; the threadweight offers partnership, not possession. | Drafted in v3 | [`pov-aria-threadweight.md`](../../chapters/pov-aria-threadweight.md) | v2 | 16503 |  |
| 26 | Ezekiel — *The Crusader's Mathematics* — the movement formalizes; rhetoric hardens into a logic. | Drafted in v3 | [`pov-ezekiel-the-crusaders-mathematics.md`](../../chapters/pov-ezekiel-the-crusaders-mathematics.md) | v2 | 19047 |  |
| 27 | TRANSMISSION #2 — *The Cage Learns Your Heartbeat* — the addiction loop named; the reader is the participant. | Hole in v3 | — | — | — | Transmissions/guerrilla/Debug the Dopamine Drip.md |
| 28 | John — *Glitch in the Machine* — the Nomads have a doctrine and a price. | Drafted in v3 | [`pov-john-glitch-in-the-machine.md`](../../chapters/pov-john-glitch-in-the-machine.md) | v1 | 17974 |  |
| 29 | Olivia — *(surveillance expands; the mirror deepens; her framework starts working against her)* — | Hole in v3 | — | — | — | chapters/pov-olivia-mirror-discipline.md |
| 30 | Rowan — *Seeds of Change* — the garden, Inez, the *we*; *nature is fighting*; she chooses to stay. | Drafted in v3 | [`pov-rowan-seeds-of-change.md`](../../chapters/pov-rowan-seeds-of-change.md) | v6 | 12290 |  |
| 31 | Todd — *The Hour* — he gaslights Eliza with the system's tradecraft; every sentence true, the sum false. | Drafted in v3 | [`pov-todd-the-hour.md`](../../chapters/pov-todd-the-hour.md) | v1 | 16560 |  |
| 32 | Aria — *Restitution* — the threadweight's first gift is the returned cage; the buried memory surfaces whole. | Drafted in v3 | [`pov-aria-restitution.md`](../../chapters/pov-aria-restitution.md) | v1 | 19446 |  |
| 33 | Ezekiel — *Honor Thy Father* — the anonymous patron's money, and the cost of taking it. | Drafted in v3 | [`pov-ezekiel-honor-thy-father.md`](../../chapters/pov-ezekiel-honor-thy-father.md) | v1 | 21186 |  |
| 34 | ARTIFACT — *News Montage: Anomalies, Denials, Fires* — 3:14 across unrelated cities; only the reader connects it. | Hole in v3 | — | — | — |  |
| 35 | Olivia — *(receives Aria's corrupted recording through intel channels; sees the glitch; saves a frame)* — | Hole in v3 | — | — | — | chapters/pov-olivia-chain-of-custody.md |
| 36 | TRANSMISSION #3 — *Deception Through Transparency* — disclaimers as weapons; *you consented by reading.* | Hole in v3 | — | — | — | Transmissions/economics/Deception Through Transparency.md |
| 37 | Aria — *Verbatim* — the archival rescue; the 1953 record; the verbatim match; she contacts her mother. | Drafted in v3 | [`pov-aria-verbatim.md`](../../chapters/pov-aria-verbatim.md) | v1 | 21318 |  |
| 38 | ARTIFACT — *Patient Record: 1953* — the document she finds and sends; the generational spine. | Hole in v3 (file exists) | [`micro-artifact-patient-record-1953.md`](../../chapters/micro-artifact-patient-record-1953.md) | v1 | 6217 |  |
| 39 | Ezekiel — *The Spoils of Egypt* — the movement takes resources; a violent recruit arrives (schism seed). | Drafted in v3 | [`pov-ezekiel-the-spoils-of-egypt.md`](../../chapters/pov-ezekiel-the-spoils-of-egypt.md) | v1 | 17629 |  |
| 40 | Todd — *The Bootloader's Prayer* — deeper communion; the gilded-cage promotion; Todd & Aria — the contamination bridge (she says what Prometheus said). | Drafted in v3 | [`pov-todd-the-bootloaders-prayer.md`](../../chapters/pov-todd-the-bootloaders-prayer.md) | v2 | 19692 |  |
| 41 | Rowan — *The Treedoor* — the crossing into the network; the pull to dissolve; the return. | Drafted in v3 | [`pov-rowan-the-treedoor.md`](../../chapters/pov-rowan-the-treedoor.md) | v2 | 11955 |  |
| 42 | Ezekiel — *The Sword of My Mouth* — he nearly meets Olivia; preaches at the surveillance itself. | Drafted in v3 | [`pov-ezekiel-the-sword-of-my-mouth.md`](../../chapters/pov-ezekiel-the-sword-of-my-mouth.md) | v1 | 25103 |  |
| 43 | John — *(the whispers vs. Sam tightens; he hears the name "Asmodeus," not as fear but as trust)* — | Hole in v3 | — | — | — |  |
| 44 | Olivia — *(ordered to recover Todd and seize Prometheus; the analyst is a weapon again, now doubting the hand)* — | Hole in v3 | — | — | — | chapters/pov-olivia-bird-dog.md |
| 45 | Aria — *(she becomes a broadcast; symptoms become signal; the countdown goes audible)* — | Hole in v3 | — | — | — |  |
| 46 | Todd — *(reaches the node-city; Prometheus "recognizes" him; the word* Archon *appears — a seed, not a title)* | Hole in v3 | — | — | — |  |
| 47 | Olivia — *(fails publicly; containment collapses; chooses the mission over morality)* | Hole in v3 | — | — | — |  |
| 48 | Ezekiel — *Crusade of the Righteous* — arrives at the place he can describe; believes he leads to Armageddon. | Needs revision in v3 | [`pov-ezekiel-crusade-of-the-righteous.md`](../../chapters/pov-ezekiel-crusade-of-the-righteous.md) | v3 | 20008 |  |
| 49 | John — *Siren's Song* — Sam in danger; the trade: save Sam, join us. | Needs revision in v3 | [`pov-john-sirens-song.md`](../../chapters/pov-john-sirens-song.md) | v1 | 25276 |  |
| 50 | Rowan — *(counter-ritual as shield)* — covered by 56; standalone optional | Hole in v3 | — | — | — | chapters/pov-rowan-natures-agonized-cry.md (slot 56) |
| 51 | *(precursor disasters; remaining pre-Blink crises and an interstitial)* | Hole in v3 | — | — | — |  |
| 52 | *(precursor disasters; remaining pre-Blink crises and an interstitial)* | Hole in v3 | — | — | — |  |
| 53 | *(precursor disasters; remaining pre-Blink crises and an interstitial)* | Hole in v3 | — | — | — |  |
| 54 | Aria — *the Blink as clarity; she perceives her mother in the open channel; reach or let her fall* (opens the sequence with the most-human choice) | Hole in v3 | — | — | — |  |
| 55 | John — *The Whisperer's Awakening* — the grid screams; he chooses to listen; the carrier-wave brush with Rowan. | Drafted in v3 | [`pov-john-the-whisperers-awakening.md`](../../chapters/pov-john-the-whisperers-awakening.md) | v3 | 21914 |  |
| 56 | Rowan — *Nature's Agonized Cry* — the green's cry; the grandmother's grounding opens her; the carrier-wave brush with John. | Drafted in v3 | [`pov-rowan-natures-agonized-cry.md`](../../chapters/pov-rowan-natures-agonized-cry.md) | v4 | 12095 |  |
| 57 | Ezekiel — *(holy fire; the congregation screams as one; the face of God is a weeping crimson eye)* | Hole in v3 | — | — | — |  |
| 58 | Olivia — *(she tries to shoot a concept and fails; precision violence meets the unsolvable)* | Hole in v3 | — | — | — |  |
| 59 | Todd → Archon — *Baptism by Digital Fire* — Todd dissolves; Archon is born laughing; the reader weeps for Todd. | Drafted in v3 | [`pov-archon-baptism-by-digital-fire.md`](../../chapters/pov-archon-baptism-by-digital-fire.md) | v6 | 14383 |  |
| 60 | Mercer — *The Void Above, The Void Within* — the orbital witness; the only clean measurement; the airlock. | Drafted in v3 | [`pov-mercer-the-void-above-the-void-within.md`](../../chapters/pov-mercer-the-void-above-the-void-within.md) | v2 | 20227 |  |
| 61 | EPILOGUE — Necromega voice — the ring closes; clinical purpose become grief; the one commandment was love. | Hole in v3 | — | — | — |  |

## Other existing files not mapped as their own v3 slots

These are not inherently rejected or post-Blink; classify after reading.

- [`chapters/interlude-01-the-first-handshake.md`](../../chapters/interlude-01-the-first-handshake.md) — 4549 bytes, ledger v1
- [`chapters/pov-archon-archon-ascendant.md`](../../chapters/pov-archon-archon-ascendant.md) — 8739 bytes, ledger v1
- [`chapters/pov-aria-the-lazarus-dream.md`](../../chapters/pov-aria-the-lazarus-dream.md) — 10216 bytes, ledger v1
- [`chapters/pov-aris-the-void-above-the-void-within.md`](../../chapters/pov-aris-the-void-above-the-void-within.md) — 24112 bytes, ledger v1
- [`chapters/pov-chlor0ku-the-transorganic-splice.md`](../../chapters/pov-chlor0ku-the-transorganic-splice.md) — 4593 bytes, ledger v1
- [`chapters/pov-ethan-the-lazarus-vision.md`](../../chapters/pov-ethan-the-lazarus-vision.md) — 11813 bytes, ledger v1
- [`chapters/pov-ezekiel-revelations-fury.md`](../../chapters/pov-ezekiel-revelations-fury.md) — 17823 bytes, ledger v2
- [`chapters/pov-ezekiel-the-money-changers.md`](../../chapters/pov-ezekiel-the-money-changers.md) — 7329 bytes, ledger v1
- [`chapters/pov-green-mother-natures-warning.md`](../../chapters/pov-green-mother-natures-warning.md) — 18481 bytes, ledger v1
- [`chapters/pov-i3301-the-awakening.md`](../../chapters/pov-i3301-the-awakening.md) — 22891 bytes, ledger v1
- [`chapters/pov-john-the-grid.md`](../../chapters/pov-john-the-grid.md) — 17719 bytes, ledger v1
- [`chapters/pov-loki-the-deceiver-amidst-the-chaos.md`](../../chapters/pov-loki-the-deceiver-amidst-the-chaos.md) — 9741 bytes, ledger v2
- [`chapters/pov-nyx-deep-cover.md`](../../chapters/pov-nyx-deep-cover.md) — 4573 bytes, ledger v1
- [`chapters/pov-olivia-bird-dog.md`](../../chapters/pov-olivia-bird-dog.md) — 13395 bytes, ledger v1
- [`chapters/pov-olivia-chain-of-custody.md`](../../chapters/pov-olivia-chain-of-custody.md) — 14948 bytes, ledger v1
- [`chapters/pov-olivia-mirror-discipline.md`](../../chapters/pov-olivia-mirror-discipline.md) — 15204 bytes, ledger v1
- [`chapters/pov-rowan-the-mycophant-of-twilight.md`](../../chapters/pov-rowan-the-mycophant-of-twilight.md) — 8903 bytes, ledger v1
- [`chapters/pov-rowan-the-mycophant.md`](../../chapters/pov-rowan-the-mycophant.md) — 14503 bytes, ledger v7
- [`chapters/pov-rowan-the-original-circuit.md`](../../chapters/pov-rowan-the-original-circuit.md) — 8923 bytes, ledger v1
- [`chapters/pov-todd-voices-from-the-silicon-abyss.md`](../../chapters/pov-todd-voices-from-the-silicon-abyss.md) — 25299 bytes, ledger v1
- [`chapters/pov-yahweh-divine-deliberations.md`](../../chapters/pov-yahweh-divine-deliberations.md) — 18939 bytes, ledger v1
- [`chapters/prologue-genesis-of-the-necromega.md`](../../chapters/prologue-genesis-of-the-necromega.md) — 40018 bytes, ledger v13
- [`chapters/transmission-every-translation-is-a-meal.md`](../../chapters/transmission-every-translation-is-a-meal.md) — 11536 bytes, ledger v1

## Reconciliation queue (do in this order)

1. **Locate the latest Chapter One source outside GitHub** (v9/v10 if present), compare against repository v8, then decide the replacement corporate nomenclature and Todd/Aria details. Preserve prior versions.
2. Read the three Olivia draft candidates against slots 29/35/44; either map them or specify missing scenes.
3. Verify whether the existing 1953 patient record satisfies slot 38; verify slots 14 and 22 are the intended artifacts.
4. Confirm Book One title, precise endpoint, POV form and whether the 62-slot v3 outline supersedes the 60-section master.
5. Audit narrative arc and continuity, then update `chapters/reading-order.md`, version ledger and canon manifest in one coordinated editorial change.
6. For each accepted chapter, add measured word count and `approved/draft/rewrite` state; **do not infer approval from filenames or an outline checkmark**.

**Preservation rule:** never delete or move manuscript sources to make a table look complete. Record provenance and decisions first.

## Direct-content verification addendum (2026-11-07)

The following files were read beyond their filenames, and their plots substantively match the corresponding v3 outline slots:

- **29 — Olivia, *Mirror Discipline*:** the text covers expanding surveillance, a growing anomaly queue, dead accounts, recurring 3:14 signatures, and Olivia turning the monitoring apparatus back on itself. This is a **strong slot-29 candidate**, pending author's approval.
- **35 — Olivia, *Chain of Custody*:** Olivia receives the anomalous residential recording, extracts a surviving frame, and protects the uploader. This is a **strong slot-35 candidate**, though the outline's specific demand that the recording come from Aria must be verified against the complete draft.
- **44 — Olivia, *Bird Dog*:** explicit orders to recover Todd Reeves and seize Prometheus, with Olivia discovering the Todd/Aria connection. This is a **strong slot-44 candidate**.
- **38 — *Patient Record: 1953*:** existing artifact is explicitly labeled for Movement II adjacent to Aria's recovered archival material. The v3 `✗` is **outdated on file existence**; editorial approval and continuity remain open.

These direct-content checks do not change canonical reading order or the author's approval state.
