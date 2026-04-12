# Plan: Generate Chapter 1 — "Welcome to the Digital World"

## Context

This is the implementation plan for the body content of **Chapter 1** of the Grade 5 *Digital Citizenship* intelligent textbook for ISD 197. The chapter stub at `docs/chapters/01-welcome-to-digital-world/index.md` currently contains only a title, summary, list of 17 concepts, and a `TODO: Generate Chapter Content` placeholder.

All 17 chapters of the textbook are stubs — **Chapter 1 will be the first chapter written**, so it sets the voice, structure, mascot rhythm, and visual conventions for every chapter that follows. This is the highest-stakes chapter in the book: it is the student's first impression of Maka, of the "pause, think, act" habit, and of how a digital-citizenship chapter is supposed to feel.

The chapter must teach 17 foundational vocabulary concepts at a Grade 5 reading level (Flesch–Kincaid 4–6), introduce Maka the River Otter, and include at least one interactive MicroSim. **There is no glossary file yet** — every new term must be defined inline using the bold-and-define pattern from `CLAUDE.md`, so the chapter cannot rely on glossary links.

## Audience and voice

- **File path:** `docs/chapters/01-welcome-to-digital-world/index.md` → student-facing → **Grade 5 voice + Maka allowed**.
- Reading level: Flesch–Kincaid 4–6, sentences 12–15 words avg (max ~20), paragraphs 2–4 sentences.
- Second person ("you"), warm but not babyish, active voice, named scenarios, no slang, no platform names.

## The 17 concepts (in dependency order, validated)

| # | Concept | Depends on | Cluster |
|---|---|---|---|
| 1 | Digital Device | — | Devices |
| 2 | Internet | — | Network |
| 3 | Family Device | Digital Device | Devices |
| 4 | Laptop | Digital Device | Devices |
| 5 | Online Activity | Digital Device, Internet | Activity |
| 6 | School Device | Digital Device | Devices |
| 7 | Smartphone | Digital Device | Devices |
| 8 | Tablet | Digital Device | Devices |
| 9 | Web Browser | Digital Device, Internet | Browser |
| 10 | Wifi | Internet | Network |
| 11 | App | Digital Device, Online Activity | Software |
| 12 | Public Wifi | Wifi | Network |
| 13 | Search Engine | Internet, Web Browser | Browser |
| 14 | Website | Internet, Web Browser | Browser |
| 15 | Account | Online Activity, App | Software |
| 16 | URL | Website | Browser |
| 17 | Address Bar | Web Browser, URL | Browser |

Edge-direction validation: passed. Foundational concepts (Digital Device, Internet) are simple and introductory — direction is correct. No forward references — every prerequisite is in the same chapter or has zero dependencies.

## Section outline (pedagogical order, NOT raw concept order)

The chapter is organized into 6 sections plus an opener and a closer. Sections are clustered so that closely related concepts get defined together, and dependencies are always respected.

### 1. Opening: Maya's First Day *(scenario + welcome admonition)*

A short scenario about a fictional student named **Maya** who is handed her first school laptop on the first day of school. Sets the chapter's question: *What is all this stuff, and how do I use it well?*

- **Maka admonition #1: `mascot-welcome`** — Maka introduces themselves and the chapter, says "Pause, think, act!"
- **Concepts seeded (not yet defined):** none — pure framing.

### 2. Section 1: What is a Digital Device?

- Defines **Digital Device** (concept 1) using the bold-define pattern.
- Defines **Laptop** (4), **Tablet** (8), **Smartphone** (7) as three kinds of digital devices most Grade 5 students already know.
- Defines **School Device** (6) and **Family Device** (3) as two *categories* — devices owned by your school vs. devices shared at home — and explains why the rules are different for each.
- **Non-text element:** a markdown table comparing School Device and Family Device (who owns it, who sets the rules, what to do if something goes wrong → "tell a trusted adult" in plain text, not in a Maka bubble).
- **Concepts taught:** 1, 4, 8, 7, 6, 3 *(6 concepts)*.

### 3. Section 2: The Internet — How Devices Talk to Each Other

- Defines **Internet** (2) in plain language: a giant network that lets digital devices send messages to each other. Concrete example: "When you watch a video at school, the video isn't *inside* the laptop. It travels from a computer somewhere far away, through the internet, and onto your screen."
- Defines **Wifi** (10) as one common way devices connect to the internet without a cable.
- Defines **Public Wifi** (12) as wifi at a place anyone can use — a library, a coffee shop, an airport — and gives the safety rule.
- **Maka admonition #2: `mascot-warning`** on Public Wifi — "Public wifi is shared with strangers. Don't sign in to your accounts on public wifi unless a trusted adult says it's okay."
- **Diagram:** *How a video gets to your tablet* — a simple flow infographic: tablet → wifi → router → internet → faraway computer → back. Specified as a `<details markdown="1">` block.
- **Concepts taught:** 2, 10, 12 *(3 concepts)*.

### 4. Section 3: What You Can Do Online

- Defines **Online Activity** (5) as anything you do on a digital device that uses the internet.
- Defines **App** (11) as a small program on a digital device that helps you do one job — read a book, do math practice, take a picture, play a game.
- Defines **Website** (14) as a place on the internet you visit using a web browser. Brief — full browser story comes in Section 4.
- **Non-text element:** a bulleted list of "heart, brain, body" examples of online activities — *quietly seeds Chapter 3's media-balance vocabulary without defining it yet.*
- **Maka admonition #3: `mascot-thinking`** — Big idea: every online activity uses *both* a device and the internet at the same time.
- **Concepts taught:** 5, 11, 14 *(3 concepts)*.

### 5. Section 4: The Web Browser — Your Window to the Web

- Defines **Web Browser** (9) as the app you open to visit websites. Names common ones in plain words ("the one with the red, yellow, green, and blue circle"; "the one that looks like a compass") *without* trademarking — keeps it platform-agnostic per project rules.
- Defines **URL** (16) as the address of a website, like a street address for a place on the internet. Concrete example: `www.isd197.org` is the URL of the school district's website.
- Defines **Address Bar** (17) as the strip at the top of a web browser where the URL lives. You can read it to see where you are, or type a new URL to go somewhere new.
- Defines **Search Engine** (13) as a special website that helps you find other websites when you don't know the URL.
- **Non-text element:** a markdown table mapping "real-world thing" → "web browser thing" (street address ↔ URL, mailbox ↔ address bar, phone book ↔ search engine).
- **MicroSim:** *Browser Window Tour* — interactive p5.js sketch of a stylized browser window with clickable address bar, URL, search box, and page area. Clicking each part highlights it and shows a one-sentence explanation. **This is the chapter's anchor MicroSim** and is specified in detail as a `<details markdown="1">` block (see "MicroSim spec" below).
- **Maka admonition #4: `mascot-tip`** — "Before you click a link, look at the address bar. The URL tells you where you're going."
- **Concepts taught:** 9, 16, 17, 13 *(4 concepts)*.

### 6. Section 5: Accounts — Your Spot on a Website

- Defines **Account** (15) as a private spot on a website or app that belongs to you. Uses the analogy of a school library card — only yours, has your name on it, lets you do things visitors can't.
- Plain-text rule (not in a Maka bubble): "Never make an account without asking a trusted adult." Per CLAUDE.md the trusted-adult rule must always be plain text, not mascot dialogue.
- **Concepts taught:** 15 *(1 concept)*.

### 7. Closing: Maya's Day, One Week Later

- Short callback to the opening scenario showing Maya now able to name the parts of her digital world.
- **Quick recap list** (bulleted) — the 17 vocabulary words, each followed by a 4–6 word reminder.
- **Maka admonition #5: `mascot-celebration`** — "You just learned 17 new words about the digital world. Pause, think, act — you're already a digital citizen!"

## Maka budget (5 admonitions — within the 5–6 cap)

| # | Type | Where | Purpose |
|---|---|---|---|
| 1 | `mascot-welcome` | Opening | Introduce Maka, set "pause, think, act" |
| 2 | `mascot-warning` | Section 2 (Public Wifi) | Safety rule for public wifi |
| 3 | `mascot-thinking` | Section 3 (Online Activity) | Big idea: device + internet = online activity |
| 4 | `mascot-tip` | Section 4 (Address Bar) | Look at the URL before you click |
| 5 | `mascot-celebration` | Closing | Section completion |

No back-to-back admonitions. Maka does **not** deliver the trusted-adult rule (kept as plain prose per CLAUDE.md). Maka does **not** introduce vocabulary terms (those go in the body, bolded).

## MicroSim spec — *Browser Window Tour*

Specified as a `<details markdown="1">` block in Section 4 with these structured fields:

- **sim-id:** `browser-window-tour`
- **Library:** p5.js
- **Status:** Specified

**Learning objective (Bloom: Remember + Understand):** Given a stylized web browser window, the student can identify and name the address bar, URL, search box, and page area, and recall what each one does.

**Visual elements:**

- A canvas (default 600×400, responsive to container width via `updateCanvasSize()` in `setup()`).
- A drawn browser window: title bar with three colored circles, address bar across the top containing a URL like `www.isd197.org`, a small "search" box, and a stylized page area showing a placeholder website.
- Each clickable region highlights on hover (light blue glow) and shows a one-sentence explanation in a label area below the canvas when clicked.

**Controls (built-in p5.js controls per project rules):**

- A `createSelect()` dropdown to switch between three example URLs (`www.isd197.org`, `www.nasa.gov`, `kids.nationalgeographic.com`) so students see that URLs vary.
- A `createButton('Reset')` that clears the highlight and label.

**Behavior:**

- On mouse hover over a labeled region, draw a 2-pixel highlight.
- On click, set a state variable to the clicked region and render its one-sentence explanation in the label area.
- All explanations are pre-written and use the same wording as the chapter prose so the MicroSim *reinforces* the definitions rather than introducing new ones.

**Implementation notes:**

- File location: `docs/sims/browser-window-tour/` with `main.html`, `main.js`, `index.md`.
- `main.html` uses `<main></main>` (no id) so teachers can copy the JS into the p5.js editor (per project CLAUDE.md).
- `setup()` calls `updateCanvasSize()` first; canvas is parented with `canvas.parent(document.querySelector('main'))`.
- **Important:** the actual MicroSim files are NOT created in this chapter task. The chapter only contains the spec block. A separate MicroSim generation pass will build the sim from the spec.

## Other non-text elements

| # | Type | Section | Purpose |
|---|---|---|---|
| A | Markdown table | §1 | School Device vs. Family Device comparison |
| B | Diagram (`<details>` block) | §2 | "How a video gets to your tablet" — flow infographic, library: Mermaid, sim-id: `internet-flow` |
| C | Bulleted list | §3 | Heart/brain/body examples of online activities |
| D | Markdown table | §4 | Real-world ↔ web-browser analogies |
| E | MicroSim (`<details>` block) | §4 | Browser Window Tour (specified above) |
| F | Numbered recap list | Closing | All 17 vocab words with short reminders |

That is 6 non-text elements across the chapter (well above the "no more than 3 paragraphs without a non-text element" rule, plus diversity of types: 2 tables, 2 lists, 1 diagram, 1 MicroSim).

## Scaffolding rules (define before display)

- The internet-flow diagram in §2 only uses words already defined: *tablet*, *wifi*, *internet*, *router* (router is defined in the bridge sentence immediately before the diagram).
- The Browser Window Tour MicroSim only labels parts whose definitions appear in the prose immediately before the spec block.
- The real-world ↔ browser table in §4 reinforces — it does not introduce. Every cell uses words already defined in §4 prose.
- One-sentence bridges precede the table in §1, the diagram in §2, and the MicroSim in §4 ("Before we look at this..." style).

## Word budget

| Section | Target words |
|---|---|
| Opening (Maya's first day) | 150 |
| §1 Devices | 450 |
| §2 Internet & Wifi | 400 |
| §3 Online Activity, App, Website | 350 |
| §4 Web Browser, URL, Address Bar, Search Engine | 550 |
| §5 Accounts | 200 |
| Closing + recap | 200 |
| **Total body prose** | **~2,300 words** |

This sits in the middle of the 1,500–4,000 word target from CLAUDE.md and leaves room for the spec blocks without bloat.

## Metadata frontmatter

Add to top of file (per the chapter-content-generator skill, v0.07):

```yaml
---
title: "Chapter 1: Welcome to the Digital World"
description: Meet the devices, networks, and basic vocabulary every Grade 5 student needs to start exploring the digital world safely and confidently.
generated_by: claude skill chapter-content-generator
date: 2026-04-11
version: 0.07
---
```

Existing H1, summary, concepts list, and prerequisites stay where they are. The TODO line is replaced with the new body content (opening through closing) appended after the prerequisites section.

## Critical files

**Edited (one file at execution time):**

- `docs/chapters/01-welcome-to-digital-world/index.md` — replace `TODO: Generate Chapter Content` with full chapter content; add YAML frontmatter at top.

**Read for context (no edits):**

- `CLAUDE.md` — voice/style guide, Maka rules, vocabulary pattern, length targets
- `docs/learning-graph/mascot-test.md` — exact mascot admonition markdown to copy verbatim
- `docs/learning-graph/learning-graph.json` — concept dependency validation (already done)
- `docs/learning-graph/chapter-design.md` — chapter scope confirmation
- `docs/css/mascot.css` — already wired into mkdocs.yml; no changes needed
- `mkdocs.yml` — confirms `admonition` and `pymdownx.details` are enabled

**NOT created in this task:**

- The actual MicroSim files at `docs/sims/browser-window-tour/` (the chapter only contains the spec; a separate task will build the sim)
- Any glossary file (none exists yet — vocabulary is defined inline)
- Any teacher's-guide content (different audience, separate task)

## Verification

After writing the chapter:

1. **Concept coverage check:** read the file back and confirm every one of the 17 concept labels appears bolded (`**Digital Device**`, `**Internet**`, ...) at least once where it is defined. Build a 17-row checklist.
2. **Maka count:** grep for `!!! mascot-` and confirm exactly 5 matches (no more than 6, no back-to-back).
3. **Trusted-adult rule:** grep for "trusted adult" and confirm every match is in plain prose, not inside a `!!! mascot-` block.
4. **Forbidden words check:** grep for `TikTok|Instagram|Snapchat|Discord|sus|no cap|rizz|utilize|stakeholder|inappropriate|predator|cyberspace` — must return zero matches.
5. **Sentence length spot-check:** scan §1 and §4 for any sentence longer than ~20 words; rewrite if found.
6. **Word count:** `wc -w` on the new body content; confirm ~2,000–2,800 words.
7. **Structural check:** confirm the file still has `# Chapter 1`, `## Summary`, `## Concepts Covered`, `## Prerequisites`, and the new content is appended *after* prerequisites (does not delete the existing structure).
8. **Render check (user runs):** the user has `mkdocs serve` running in their own terminal. After saving, the user will visually verify the chapter renders cleanly at `http://127.0.0.1:8000/digital-citizenship/chapters/01-welcome-to-digital-world/` and that all 5 mascot admonitions show the correct image and colored border.
9. **TODO removed:** confirm the string `TODO: Generate Chapter Content` no longer appears in the file.

## What the user is approving

When the user approves this plan, they are approving:

1. The 6-section outline above (opening + 5 sections + closing).
2. The placement and types of the 5 Maka admonitions.
3. The decision to include one anchor MicroSim (Browser Window Tour) specified in a `<details>` block, with the actual sim files generated in a separate later task.
4. The Maya scenario as the framing device for Chapter 1 (and likely a recurring character across the textbook).
5. The decision to define all vocabulary inline rather than waiting for a glossary file.
6. The single-file edit to `docs/chapters/01-welcome-to-digital-world/index.md`.
