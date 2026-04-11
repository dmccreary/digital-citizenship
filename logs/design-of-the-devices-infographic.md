# Design Log: Digital Devices Explorer Infographic

**Date:** 2026-04-11
**Chapter:** 1 — Welcome to the Digital World
**MicroSim:** `docs/sims/digital-devices-explorer/`
**Status:** Shipped, all tests passing

This log captures the design conversation behind the *Digital Devices Explorer* interactive infographic, the bugs uncovered along the way, and the shared-library and skill-template improvements that came out of the work. It is written for future-me (or another collaborator) trying to understand *why* the code looks the way it does.

## 1. The Original Brief

Chapter 1's section "What Is a Digital Device?" introduces three devices Grade 5 students already know (laptop, tablet, smartphone) and then mentions that smartwatches, video-game consoles, and smart TVs are also digital devices. The user wanted an interactive infographic where the student can click on a collection of devices and discover whether each one collects personal information about them — a forward-reference to the private-vs-personal information conversation in Chapter 5.

The teaching point: *almost every digital device in your life is collecting something — even unexpected ones (camera, e-reader) — and the toaster is the lone exception that proves the rule.*

The skill that should generate this is `/interactive-infographic-overlay`, which produces a directory with an LLM-generated annotation-free image plus a `data.json` overlay rendered by the shared `diagram.js` library.

## 2. Initial Build (Pass 1)

Created `docs/sims/digital-devices-explorer/` with four files following the skill template:

- `image-prompt.md` — a detailed text-to-image prompt for a 3×3 grid of nine generic, brand-free devices on a soft river-blue shelf, with strict "no text in the image" rules (the overlay system handles labeling). Devices: Laptop, Tablet, Cell Phone, Video Game Console, Smartwatch, Smart TV, Digital Camera, E-reader, Toaster.
- `data.json` — nine callouts with positions in a 3×3 percentage grid (20/50/80 × 25/50/75), each color-coded red (yes), orange (some), or green (not yet) and described in Grade 5 voice.
- `main.html` — copied from the skill's `assets/main-template.html` with project-specific title and image filename.
- `index.md` — embedded iframe page with a how-to-use section and the device list.

Also installed the shared library prerequisite by copying `docs/sims/shared-libs/{diagram.js,style.css}` from the biology project (the digital-citizenship project did not have it yet).

Updated `mkdocs.yml`:

- Added `Digital Devices Explorer: sims/digital-devices-explorer/index.md` under MicroSims navigation.
- Added an `exclude_docs:` block to suppress `image-prompt.md` from the build (it's an LLM input artifact, not a page).

Embedded the iframe in chapter 1 in a new "Meet Some Digital Devices" subsection.

## 3. Iterative Refinements (User-Driven)

A series of small, surgical fixes followed:

### 3.1 Layout: side-panel → dual-panel

The user wanted labels on both sides of the image. Switched `layout` from `side-panel` to `dual-panel` in `data.json`. The `panel: "left"` per-callout field controls which side a label rides. Default is `right`.

### 3.2 Strip the Yes/Some/Not-Yet suffixes from labels

Initially the labels read "Laptop — Yes," "Toaster — Not Yet," etc. The user removed the suffixes to make the answer reveal happen *only* on click, not at-a-glance. More discovery-driven.

### 3.3 Move controls to the bottom of the canvas

The Explore/Quiz toggle was at the top by default. The user moved it to the bottom, below `#layout` and `#infobox`. **Two reasons** that turned into a project-wide rule:

1. **Smartboard accessibility.** ISD 197 classrooms use raised wall-mounted smartboards. Top-anchored controls can be physically out of reach for shorter students and instructors. Bottom placement means anyone walking up to the smartboard can reach them.
2. **Visual hierarchy.** The diagram and the currently-selected information are the primary content. Mode toggles are meta-controls; placing them above the content forces the eye to skip past chrome to reach what matters.

This was promoted to a **project-wide MicroSim standard** and saved as a feedback memory at `~/.claude/projects/-Users-dan-Documents-ws-digital-citizenship/memory/feedback_microsim_controls_at_bottom.md`. The `interactive-infographic-overlay` skill template (`assets/main-template.html`) was reordered to put `#controls` after `#infobox`, and `SKILL.md` Step 5 was updated with the rationale and a "do not reorder" note.

### 3.4 Route most callouts to the left panel

The user asked to put left-column and center-column devices in the left panel, *except* the e-reader, which stays on the right. This is supported per-callout via the `panel` field. Five devices got `panel: "left"`; the four remaining (Cell Phone, Smart TV, E-reader, Toaster) used the default `right`.

### 3.5 Wink emoji in the Toaster description

Replaced the literal `(wink)` text with the 😉 emoji character.

## 4. The First Big Architectural Conversation: Iframe Auto-Resize

The user asked whether `/microsim-utils` had any sample code for runtime iframe auto-resize. Investigation revealed:

- `microsim-utils` only had the **build-time** `sync-iframe-heights.py` script (which reads a `// CANVAS_HEIGHT:` comment in each sim's JS and statically rewrites `height="..."` attributes in markdown).
- However, `docs/sims/shared-libs/diagram.js` already implemented the **child side** of a runtime postMessage protocol: `reportHeight()` measures `document.body.scrollHeight + 30` and posts `{ type: 'microsim-resize', height }` to `window.parent`.
- The **parent-side listener was missing** from `docs/js/extra.js`.

Added the listener block at the top of `docs/js/extra.js`. It matches incoming messages on `event.source === iframe.contentWindow` (not URL — that's the only reliable identification when multiple iframes are on a page) and sets both `style.height` and the `height` attribute on the matching iframe.

Documented the protocol as a new reference guide in `/microsim-utils`: `references/iframe-auto-height.md`. The guide covers:

- The two-part `microsim-resize` message contract
- Drop-in parent-side listener block
- Child-side reporter snippets for diagram-overlay, p5.js, and Mermaid sims
- Why match by `event.source` not URL
- Caveats: one-shot vs. live, `'*'` target origin, sandboxed iframes, fullscreen no-op
- How it coexists with the build-time `sync-iframe-heights.py` (loading-state default vs. runtime override)

`SKILL.md` for `/microsim-utils` was updated with a routing-table row, decision-tree branch, full description block, and Example 6.

## 5. The Click vs. Hover Debate

The user asked, as an instructional designer, whether hover or click should be used for the reveal interaction. The answer was unambiguously **click**, for six stacked reasons:

1. **Touch devices.** ISD 197 students live on iPads and Chromebooks. Hover doesn't exist on touch — designing for hover silently breaks the interaction for half the audience. WCAG 2.1 1.4.13 codifies this.
2. **Matches "pause, think, act."** Click is a deliberate micro-commitment. Hover is casual mouse-sweeping, the opposite of the textbook's central habit.
3. **Generation effect.** The half-second prediction-then-feedback loop ("I bet the toaster doesn't…") is the testing effect / desirable difficulties at work.
4. **Persistence for slower readers.** Hover state vanishes the instant the mouse moves; click locks the selection in.
5. **Accessibility.** Keyboard and screen-reader users navigate by focus and activation, not hover.
6. **Mode consistency.** The Quiz mode already requires clicks; using clicks in Explore mode means students don't learn two interaction models.

The user said "make it click only — add an option flag and modify diagram.js."

### 5.1 First (incomplete) fix

I added a `clickOnly: true` flag to `data.json`, made `diagram.js` set `body.click-only` when the flag was true, and added CSS overrides in `style.css` to disable the `.marker:hover` scale-up and the `.label-row:hover` background. **This was insufficient.** I told the user (incorrectly) that explore mode was already click-only.

### 5.2 Bug discovery and second fix

When the quiz mode came up, I re-read `initExplore()` and discovered that **lines 580–581 and 584–585 actually bind `onpointerenter` and `onpointerleave` handlers** that call `activate()` and `showInfobox()`. So hover *did* reveal information in JavaScript, not just CSS. My earlier fix only addressed half the problem.

The complete fix to `initExplore()`:

- Read `data.clickOnly` at the top of the function.
- If `clickOnly`, do **not** bind `onpointerenter` / `onpointerleave` at all. Bind `onclick = activate` instead, which does the full activate-and-reveal.
- Inside `activate()`, when `clickOnly`, clear all other markers' `.active` classes first. (In hover mode, `pointerleave` handled the deactivation; in click-only mode there's no leave event, so the new selection has to clear the old one explicitly.)

The header comment in `diagram.js` was also fixed — the old comment claimed `Modes : explore (hover infobox)` which was correct historically but became misleading.

## 6. Quiz Mode Re-Design: Identify → Select-All

The user noticed the quiz mode didn't fit the sim: *"The title is 'Which Devices Collect Personal Information?' but they are not really trying to identify a device here. They are only supposed to click on devices that DO collect personal information."*

Right call. The shared `diagram.js` quiz mode was an *identification* quiz: name a structure, click the matching marker. For this sim, the natural quiz is **select-all-that-fit**: read a single prompt, click every callout that matches.

### 6.1 New shared-library feature: select-all quiz mode

Added to `diagram.js`, gated entirely by `data.quizMode === 'select-all'` so the existing identify-quiz path is unchanged:

- **New `data.json` fields:**
  - `quizMode: "identify" | "select-all"` (default `"identify"`)
  - `quizPrompt: "..."` — instruction text shown in the infobox during a select-all quiz
  - Per-callout `quizCorrect: true` — marks valid answers (default `false`)

- **New methods in the `DiagramSim` class:**
  - `initSelectAllQuiz()` — builds the set of correct callout IDs, shows the prompt in the infobox, scores `0 / N` where N = correct count, keeps labels visible (this is not an identification quiz so device names are fine and helpful), binds click handlers to both markers and label rows.
  - `handleSelectAllAnswer(callout)` — locks each callout after the first click (one-shot per session). Correct picks turn green and increment the running score; wrong picks turn red and the marker stays red so the student can see what they missed (no score penalty per design discussion). When all correct callouts are found, calls completion.
  - `showSelectAllComplete()` — shows the celebration animation and the "Try Again" button.

- **Routing in `setMode()`:** when entering quiz mode, check `data.quizMode` and call `initSelectAllQuiz()` or the original `initQuiz()` accordingly.

### 6.2 Pedagogical answer set

Marked 8 of 9 devices `quizCorrect: true`:

- **Yes (red, definitely collect):** Laptop, Tablet, Cell Phone, Video Game Console, Smartwatch
- **Some (orange, sometimes collect):** Smart TV, Digital Camera, E-reader
- **Not yet (green, do not collect):** Toaster (the only `false`)

The 8/9 ratio is the message, not a difficulty problem. The "aha" the chapter wants is *almost everything in your life collects something — even the surprising ones, and the toaster is the lone exception.*

## 7. The Iframe Sizing Conversation: Pinning the Infobox

The user noticed extra vertical space below the Explore/Quiz buttons after the controls were moved to the bottom and asked where the iframe height came from.

### 7.1 Diagnosis

Three places set the iframe height:

1. Static `height="600px"` in `docs/sims/digital-devices-explorer/index.md` (loading-state default for the sim's own page).
2. Static `height="640px"` in the chapter that embeds the sim (loading-state default for the chapter page).
3. **Runtime postMessage from `diagram.js` `reportHeight()`** — overrides #1 and #2 the moment it fires.

`reportHeight()` was already doing the right *measurement*: it temporarily fills the infobox with the **longest** callout's content so `document.body.scrollHeight` reflects the worst-case height. The reported value is large enough that the iframe never has to resize when the user clicks different callouts. That's intentional anti-jitter design.

The trade-off the user was seeing: when *short* content is showing (the "Click a marker..." prompt or a brief description), the body content is shorter than the iframe, so a band of empty space appears below the controls.

### 7.2 The fix considered

Three options:

1. **Pin `#infobox` to its worst-case height via `min-height`.** The infobox always reserves the worst-case space; the controls (which sit below it in DOM order) never shift; the iframe height matches body height exactly.
2. **Add a `data.json` `iframeHeight` override field.** Per-sim escape hatch when auto-measurement fails. Pushes tuning burden onto sim authors.
3. **Re-measure on every infobox change.** Tight fit at every moment, but the iframe visibly jumps up and down on every click. Bad UX. Don't do this.

Option 1 was clearly correct because it both kills the dead space *and* guarantees the controls never move — pinning the box above the controls is what nails the controls in place. The user explicitly verified this concern: "the Explore/Quiz buttons are BELOW the infobox. I don't want them to jump around."

### 7.3 Implementation in `reportHeight()`

The new logic, in order:

1. Clear any previous pin: `infoboxEl.style.minHeight = ''` (so resize re-measures fresh — without this, the old pin would force a stale value forever).
2. Find the longest callout (by `description.length + ap_tip.length`).
3. Temporarily fill the infobox with that worst-case content.
4. **While the infobox is still filled,** read `infoboxEl.offsetHeight` and assign it as inline `style.minHeight`. This pins the box at its worst-case visual height.
5. Read `document.body.scrollHeight + 30` and post via `microsim-resize`.
6. Restore the original infobox content. The min-height stays — the box no longer shrinks when a short callout is showing; only the *content* inside it changes.

DOM order is `#layout → #infobox → #controls → #edit-panel`. Because every element below `#infobox` inherits its position from the bottom of the infobox, and `#infobox` is now pinned, `#controls` sits at a constant Y position no matter what callout is selected. The iframe height is also constant. From the student's perspective: only the words inside the infobox change; the diagram, the buttons, and the iframe edge are nailed in place.

### 7.4 Documentation

Created a focused reference guide at `/interactive-infographic-overlay/references/iframe-height-pinning.md` covering:

- The problem in one sentence and the two failure modes
- Why re-measure-on-click is bad (explicit "don't do this")
- The four-step solution
- A concrete numeric table showing how the controls Y position becomes constant after pinning
- The DOM order constraint with a "do not reorder" warning
- The self-correcting resize path — calls out the `style.minHeight = ''` line as the most important debugging anchor
- What each magic number means (`+ 30` breathing room, why `offsetHeight` not `clientHeight`)
- A failure-modes table with five common symptoms
- The future `iframeHeight` data.json escape hatch (sketched but not implemented)
- A "three lines that matter" quick reference

`SKILL.md` and `data-json-schema.md` were updated to point at the new doc.

## 8. The Footgun: Edit-Mode Export Whitelist

After the user calibrated marker positions using `?edit=true` and the **Copy JSON** button, the click-only behavior and the select-all quiz mode silently regressed. Hover came back on. The quiz reverted to identify mode.

### 8.1 Root cause

The exporter in `diagram.js` (`updateJsonOutput()`, around lines 1398–1406 in the old version) hardcoded a **whitelist** of just six fields:

```js
const exportData = {
  title:       this.data.title,
  orientation: this.data.orientation,
  image:       this.data.image,
  callouts:    orderedCallouts
};
if (this.data.layout)  exportData.layout      = this.data.layout;
if (!this.showNumbers) exportData.showNumbers = false;
```

Anything else in `data.json` — `clickOnly`, `quizMode`, `quizPrompt`, or any future top-level field — was silently dropped on calibration export. The user pasted the truncated result back into `data.json`, the missing fields took their default values, and the configured behaviors quietly disappeared.

### 8.2 Why this is a footgun

A "footgun" is software-engineering slang for a feature that makes it easy to shoot yourself in the foot. Three properties:

1. **Silent.** No warning, no error, just the wrong outcome. The exporter happily produced valid JSON.
2. **Easy to trigger.** The damage came from the *documented happy path* — calibrate, Copy JSON, paste back.
3. **Delayed or invisible damage.** The sim still loaded, the markers were in the right places. The only symptom was that hover came back on and the quiz mode reverted — possibly hours after the calibration that caused it. By then the connection between "I dragged some markers" and "click-only is broken" was invisible.

That's the textbook footgun shape, and it bit us. Not the user's fault — the tool's fault for having the shape.

### 8.3 The structural fix

The fix isn't "now it works." The fix is "now this *can't* break this way." Replaced the whitelist with a spread:

```js
const exportData = {
  ...this.data,
  callouts: orderedCallouts
};
if (!this.showNumbers) exportData.showNumbers = false;
else delete exportData.showNumbers;
```

The `...this.data` spread carries every top-level field — known or unknown — through the export unchanged. Only `callouts` (the one thing edit mode actually mutates) is replaced with the freshly ordered version. Any future top-level field will ride along automatically with no exporter changes.

A comment block was added above the new code explicitly naming the regression so a future contributor reading the source won't be tempted to "clean up" the spread back into a whitelist.

### 8.4 Documentation

A callout block was added to `interactive-infographic-overlay/references/data-json-schema.md` documenting the spread-preserves-all behavior and warning future contributors against reverting to a whitelist. Anyone designing a new top-level field for `data.json` will read the note before touching the exporter and know they don't need to.

## 9. Files Created or Modified

### Project files

| File | Change |
|---|---|
| `docs/sims/digital-devices-explorer/image-prompt.md` | New — text-to-image prompt for the 9-device grid |
| `docs/sims/digital-devices-explorer/data.json` | New — 9 callouts with `clickOnly`, `quizMode: "select-all"`, `quizPrompt`, and `quizCorrect` flags on the 8 devices that collect info |
| `docs/sims/digital-devices-explorer/main.html` | New — copied from skill template, controls moved to bottom |
| `docs/sims/digital-devices-explorer/index.md` | New — documentation page with embedded iframe |
| `docs/sims/shared-libs/diagram.js` | Multiple — `clickOnly` support in `initExplore()`, select-all quiz methods, infobox `min-height` pinning in `reportHeight()`, exporter spread fix |
| `docs/sims/shared-libs/style.css` | New `.click-only` rules to suppress hover visual feedback |
| `docs/sims/shared-libs/{diagram.js, style.css}` | Initial install — copied from biology project |
| `docs/js/extra.js` | New `microsim-resize` postMessage listener at top of file |
| `docs/chapters/01-welcome-to-digital-world/index.md` | New "Meet Some Digital Devices" subsection with embedded iframe |
| `mkdocs.yml` | Added MicroSim nav entry and `exclude_docs` block |

### Skill files

| File | Change |
|---|---|
| `interactive-infographic-overlay/assets/main-template.html` | Reordered DOM: `#controls` moved to bottom, default infobox prompt updated to "Click..." |
| `interactive-infographic-overlay/SKILL.md` | DOM ordering convention with smartboard rationale; pointer to `iframe-height-pinning.md` |
| `interactive-infographic-overlay/references/data-json-schema.md` | Added `clickOnly`, `quizMode`, `quizPrompt`, `panel`, `quizCorrect`; callout blocks for iframe height auto-measurement and edit-mode preserve-all |
| `interactive-infographic-overlay/references/iframe-height-pinning.md` | New — full design rationale, failure modes, three-lines-that-matter, future escape hatch |
| `microsim-utils/references/iframe-auto-height.md` | New — postMessage protocol guide |
| `microsim-utils/SKILL.md` | New routing entry, decision-tree branch, Example 6 |

### Memory

| File | Purpose |
|---|---|
| `~/.claude/projects/-Users-dan-Documents-ws-digital-citizenship/memory/feedback_microsim_controls_at_bottom.md` | Project-wide rule: MicroSim controls go at the bottom of the canvas (smartboard reach + visual hierarchy) |
| `~/.claude/projects/.../memory/MEMORY.md` | Index file with one-line pointer |
| `~/.claude/CLAUDE.md` (global) | Personal preference: proactively flag footgun patterns by name with the three-property analysis |

## 10. Lessons Learned

A few patterns from this session worth remembering:

1. **The "I already checked, it's fine" mistake.** I told the user that `diagram.js` was already click-only based on a grep that missed two lines. The actual hover handlers were there. **Lesson:** when the user pushes back on something I claimed to check, re-check by reading the code, not by recalling the grep result.

2. **Whitelist serializers are footguns.** Any time code says `const out = { fieldA: src.fieldA, fieldB: src.fieldB }` instead of `const out = { ...src }`, that's a future regression waiting to happen. The spread should be the default; explicit field-picking is the special case for when you genuinely want to drop unknown fields.

3. **Anti-jitter design is a separate concern from auto-sizing.** It would have been easy to "fix" the dead space below the controls by re-measuring on every click. That would have fixed the visual but broken the reading experience. Pinning the infobox is the structural answer because it makes the dead-space problem and the jitter problem the *same* problem, which can be solved once with a single line of code.

4. **Memory + skill doc is the right propagation pattern for design rules.** The "controls at bottom" rule went into both project memory (so it propagates across all my work in this textbook) and the skill SKILL.md (so it propagates to anyone using the skill, on any project, even without memory). Belt and suspenders.

5. **Naming a pattern teaches it.** Calling the exporter regression a "footgun" instead of just "a bug" gave the user the vocabulary to recognize the same shape elsewhere. Explicit-naming-of-design-shapes is a cheap, high-leverage teaching tool.

## 11. What's Still Open

- **The `iframeHeight` escape hatch in `data.json`** is documented but not implemented in `diagram.js`. If a future sim genuinely can't be auto-measured, the implementation sketch is in `iframe-height-pinning.md` — adding it should take ~10 lines.
- **Mirroring the "controls at bottom" rule into other MicroSim skills.** It currently lives in `interactive-infographic-overlay`'s SKILL.md. The same note belongs in `microsim-generator` (for p5.js) and `concept-classifier` so the rule applies project-wide regardless of which skill generates the sim.
- **The image itself** is still a placeholder until the user runs `image-prompt.md` through a text-to-image tool and saves the result as `digital-devices.png`. Marker positions have been calibrated against an existing image (the user used `?edit=true` mode), so the calibration will need to be re-run if the new image differs significantly.
