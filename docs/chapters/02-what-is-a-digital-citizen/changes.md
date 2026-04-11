# Chapter 2 — Change Log

A topic-organized record of edits to this chapter and the supporting files
it depends on. Maintained by hand from session transcripts. Use this when
you need to understand *why* the chapter looks the way it does, not just
what is in it now.

---

## Session 2026-04-11 — Initial generation, image plan, story split, voice cleanup, emoji audit

This was the first content generation pass for Chapter 2. The chapter started
the day as a stub containing only the title, summary, concept list,
prerequisites, and a `TODO: Generate Chapter Content` line. By the end of the
session it was a published-ready chapter with a companion mini graphic novel
and several supporting infrastructure changes captured below.

### 1. Initial chapter generation (economy mode)

**What changed:** Replaced the `TODO: Generate Chapter Content` line with the
full chapter body.

**Method:** Ran the `chapter-content-generator` skill in *economy mode* — a
strict-constraint prompt that forbids plan mode, subagents, extended thinking,
and unnecessary file reads. The skill was instructed to read exactly four
files in order:

1. The chapter stub (this file's earlier state)
2. Chapter 1 (`docs/chapters/01-welcome-to-digital-world/index.md`) as the
   voice/structure template
3. `docs/learning-graph/mascot-test.md` for verbatim mascot admonition syntax
4. `CLAUDE.md` for the Grade 5 style guide

**What it produced:** A ~2,300-word chapter covering all 15 concepts from the
"Concepts Covered" list in dependency order, with:

- YAML frontmatter (`title`, `description`, `generated_by`, `date`, `version`)
- An opening scenario starring **Jordan**, a fifth-grade boy, on the
  playground at recess
- Five major sections that defined every concept using the bold-and-define
  pattern
- Five Maka admonitions (welcome, thinking, tip, warning, celebration), no
  back-to-back, with the trusted-adult rule kept in plain prose
- One MicroSim spec block (Pause, Think, Act decision tool) inside a
  `<details markdown="1">` block
- One comparison table (opportunities / responsibilities / rights)
- A numbered list breaking down pause-think-act
- A 15-item recap list

**Why Jordan and not Maya:** Chapter 1 already used Maya as its named
fictional student. The CLAUDE.md style guide calls for varying names across
chapters, so Jordan was chosen for Chapter 2. Maintaining a roster of
recurring fictional kids will help give the textbook a sense of place over
time.

### 2. Image and diagram specs added

**What changed:** Added five `#### Diagram:` blocks to the chapter, each
containing a detailed AI-image-generator prompt inside a
`<details markdown="1">` block. The five images were:

1. **Jordan on the Playground** — opening scenario illustration
2. **The Three-Legged Stool** — concept metaphor for opportunities,
   responsibilities, rights
3. **Standing at the Digital Threshold** — concept metaphor for the
   doorway / "moment before you tap"
4. **The Four-Wheeled Wagon** — concept metaphor for the four habits
   (etiquette, ethics, law, safety)
5. **Jordan Walks Away** — closing scenario resolution

**Why:** Visual reinforcement of metaphors and the narrative bookends. Each
spec block captured a full text-to-image prompt with composition, characters,
palette, and style notes so the prompts could be regenerated cleanly later.

### 3. Split: concept images stay inline, Jordan narrative becomes a graphic novel

**What changed:** The two narrative Jordan images (#1 and #5 above) were
removed from the chapter and reborn as a separate 8-panel mini graphic novel
at `docs/stories/jordan-one-second-choice/index.md`. The three concept-metaphor
images (#2, #3, #4) remained inline.

**Why:** A two-image teaser cannot carry a full narrative arc. Jordan's story
has at least eight beats (invitation → video → ask → knot in stomach → pause
→ think → act → walk to a trusted adult), and bundling them into a standalone
graphic novel:

- Lets the visual story breathe and teach the pause-think-act habit through
  *showing*, not just naming.
- Makes the story a reusable artifact a teacher can project or a student can
  revisit outside the chapter.
- Aligns with the textbook's stated direction in CLAUDE.md ("recurring
  fictional characters can appear across chapters; the textbook plans for
  graphic-novel stories").
- Tightens the chapter prose by moving the dramatic narrative weight to the
  story.

The concept-metaphor images stayed inline because they only make sense
*next to* the paragraph that introduces the metaphor. A student reading "like
the three legs of a stool" benefits from seeing the stool in the same eyeful;
linking to a separate page would break the metaphor loop.

**Mini graphic novel structure:** Generated via the `story-generator` skill,
adapted for a fictional contemporary character (no historical-figure
references, no Wikipedia citations). Final shape: cover image + 8 panels
(Recess Begins → "Jordan! Watch This!" → The Video → The Knot in the Stomach
→ Pause → Think → Act → Walking to a Trusted Adult), each with a detailed
image prompt in a `<details>` block plus prose narration below. Closes with
a "What Jordan Teaches Us" reflection table and a "Related Reading"
cross-link section back to Chapters 1 and 2.

### 4. YAML frontmatter quoting bug — silent rendering failure

**What changed:** Re-wrapped the `title:` and `description:` values in
double quotes:

```yaml
---
title: "Chapter 2: What Is a Digital Citizen?"
description: "Learn what it means to be a citizen of the digital world — not just a user — and meet Maka's central habit: pause, think, act."
---
```

**Why:** A linter (or a manual edit) had stripped the quotes earlier in the
session. The `title:` value contains an embedded colon (`Chapter 2: What
Is...`), which makes the unquoted YAML ambiguous. mkdocs's frontmatter
parser silently fails on the ambiguity and falls back to rendering the
entire `---` block as page content at the top of the published chapter.
Quoting fixes this. The same defensive quoting was applied to `description:`
because it also contains a colon-adjacent phrase.

**Long-term fix:** A new "YAML Frontmatter Quoting" subsection was added to
`CLAUDE.md` (just above the Quick Checklist) with right/wrong examples and
a rule: any frontmatter value containing `:`, `#`, `&`, `*`, `?`, `|`, `>`,
`!`, `%`, `@`, or backtick must be wrapped in double quotes. A new checklist
item — *"YAML frontmatter `title:` and `description:` are wrapped in double
quotes"* — was added to the chapter-completion checklist.

### 5. Story-link promotion: admonitions → primary buttons

**What changed:** The two `!!! note "Read Jordan's Story"` admonitions that
linked to the mini graphic novel were replaced with mkdocs-material primary
buttons:

```markdown
[Read Jordan's Story](../../stories/jordan-one-second-choice/index.md){ .md-button .md-button--primary }
```

**Why:** The admonition style visually de-emphasized the story link, which
is a major piece of the chapter, not a side note. The primary button makes
it impossible to miss. Buttons render via the existing `attr_list` extension
in `mkdocs.yml` — no new infrastructure required.

### 6. Removed Jordan narrative prose from the chapter body

**What changed:** Every Jordan-specific narrative detail was either deleted
or generalized to second person. Concretely:

| Location | Before | After |
|---|---|---|
| Opening section heading | `## Jordan's Choice` | `## Beyond the Words` |
| Opening section body | Four paragraphs of playground scenario (recess, the video, the ask, the knot in the stomach) | Two paragraphs that frame the chapter and point to the story button. No playground prose. |
| "What Is a Digital Citizen?" example | "When Jordan stops to ask whether sharing that video is kind…" | "When you stop to ask whether sharing something is kind…" |
| "Three Things" example | "When Jordan thinks 'the kid in the video deserves to be treated with respect'…" | "When you think 'everyone in our class chat deserves to be treated kindly'…" |
| "Digital Threshold" example | "When Jordan's finger is hovering over the share button…" | "When your finger is hovering over a share button…" |
| Closing section | `## Jordan's Choice, One More Time` — full retelling of the story climax | `## You Can Do This Too` — a short universal payoff with no playground details |

**Why:** Once the mini graphic novel exists, the chapter prose should not
duplicate the story's narrative work. The story is now the canonical place
where the playground scene lives. The chapter teaches the concepts directly
in second person, and the two prominent buttons make sure readers find the
story whenever they want it. This split also removes a real risk: if the
chapter prose and the story drift over time, two versions of "what happened
to Jordan" could end up contradicting each other.

### 7. Emoji audit — added 23, kept 2

**What changed:** Mid-session, 23 emoji were added throughout the chapter
for visual interest: 8 in section headings and 15 in the recap list. After a
senior-instructional-design audit grounded in Mayer's Cognitive Theory of
Multimedia Learning, **21 of the 23 were removed**.

**Kept:**

- `🚪` on the heading `## The Digital Threshold` — directly signals the
  doorway metaphor the chapter teaches.
- `⏸️` inline next to the first definition of **Pause, think, act** —
  universally recognized pause symbol, reinforces the action at the moment
  of first encounter, satisfies signaling and spatial-contiguity principles.

**Removed (and why each one failed the test):**

| Emoji | Where | Why removed |
|---|---|---|
| 🌐 | "Beyond the Words" heading | Decorative; doesn't signal anything specific |
| 🌍 | "A New Kind of Place" heading | Weakly thematic at best |
| 🙋 | "What Is a Digital Citizen?" heading | A hand-raise doesn't mean "citizen" |
| 🪑 | "Three Things..." heading | **Anti-pedagogical** — spoils the stool metaphor before students read it |
| 🛞 | "Four Habits..." heading | Steering wheel reads as "driving," not "wagon" — wrong metaphor; also spoils the wagon reveal |
| 💪 | "You Can Do This Too" heading | Tone mismatch — flexed bicep reads as "be tough," not "pause and choose" |
| 📋 | "Quick Recap" heading | Pure decoration |
| 15 emoji | Recap list (one per term) | Split visual attention from the bold-and-define pattern; introduced a competing mnemonic system; created confusable icons (four people-icons for four different people-related concepts) |

**The rule that came out of this audit:**

> Use emoji only when they signal a metaphor the chapter teaches. Decorative
> emoji compete with Maka and the bold-and-define pattern — leave them out.

This rule was added to:

- `CLAUDE.md` (project-level), as a new "Emoji Use" subsection above the
  Quick Checklist
- The `chapter-content-generator` skill's Best Practices section (item 14),
  so the rule travels with the skill across all intelligent textbook
  projects, not just this one
- A standalone decision log at `logs/when-to-use-emoji.md` that captures the
  full reasoning, the audit table, the framework (Mayer's coherence,
  signaling, spatial-contiguity, redundancy principles), and references to
  Mayer's *Multimedia Learning*, Harp & Mayer's seductive-details study,
  and Sweller's cognitive load theory

The lesson worth keeping for future chapters: "kids find them friendly" is
an *engagement* argument, not a *learning* argument. Maka the mascot already
does the engagement job by design. Emoji on top dilute Maka's role and add
extraneous cognitive load that, per Mayer, measurably reduces retention.

---

## Supporting changes (outside this directory but required by the chapter)

### `docs/stories/jordan-one-second-choice/index.md` (new)

The 8-panel mini graphic novel companion to this chapter. Contains a cover
image prompt, eight panel image prompts in `<details>` blocks, prose
narration below each panel, an epilogue table, a call-to-action, and a
Related Reading section that links back to Chapters 1 and 2. Image
generation (cover + 8 panels at ~Create.039 each, ~Create.35 total) is a
separate task; the file currently contains only the markdown structure
plus the prompts. As of the end of the session, panel-04, panel-05, and
panel-07 have been re-pointed to `.jpeg` files generated externally, and a
"Please generate an image for panel 4" line was added to the panel 4
prompt by the user/linter.

### `mkdocs.yml`

- New `Stories` section added between `Chapters` and `Learning Graph`,
  containing the link to the Jordan graphic novel
- `pymdownx.emoji` extension enabled (with the Material Twemoji index and
  SVG generator) so any emoji that *do* survive the audit render
  consistently as Twemoji SVGs across all browsers and platforms

### `CLAUDE.md` (project-level)

- New "Mini Graphic Novel Stories" top-level section describing the
  two-pass workflow (chapter-content-generator creates a stub with a TODO
  marker; story-generator skill expands it later) and the working example
  (`jordan-one-second-choice`)
- Brief pointer added to the existing "Story and Scenario Patterns"
  subsection so chapter authors discover the option
- New "YAML Frontmatter Quoting" subsection with right/wrong examples and
  the special-character escape rule
- New "Emoji Use" subsection with the discipline rule and a pointer to
  `logs/when-to-use-emoji.md`
- New checklist item: *"YAML frontmatter `title:` and `description:` are
  wrapped in double quotes"*

### `logs/when-to-use-emoji.md` (new)

Standalone instructional-design decision log capturing the framework, the
audit, the rule, and the references. See section 7 above for details.

### `chapter-content-generator` skill (`~/Documents/ws/claude-skills/skills/chapter-content-generator/SKILL.md`)

Best Practices item 14 added: *Emoji discipline* — same one-line rule as in
`CLAUDE.md`, plus a brief Mayer reference. This change is published to the
shared skill repo so all intelligent textbook projects pick it up.

---

## Final state of the chapter (end of session 2026-04-11)

| Property | Value |
|---|---|
| File | `docs/chapters/02-what-is-a-digital-citizen/index.md` |
| Body length | ~2,000 words (tightened from ~2,300 after Jordan prose removal) |
| Concepts covered | 15 (all from the dependency-ordered list, all bolded inline at definition) |
| Maka admonitions | 5 (welcome, thinking, tip, warning, celebration) — none back-to-back |
| Inline diagrams | 3 (three-legged stool, digital threshold doorway, four-wheeled wagon) |
| Inline microsims | 1 (pause-think-act decision tool, p5.js, spec only) |
| Tables | 1 (opportunities / responsibilities / rights) |
| Buttons | 2 (primary, both linking to the mini graphic novel) |
| Emoji | 2 (🚪 in one heading, ⏸️ inline at one definition) |
| Trusted-adult rule placement | Plain prose only, never inside a Maka admonition |
| Companion story | `docs/stories/jordan-one-second-choice/index.md` (8-panel graphic novel, prompts only — image generation pending) |

## Open follow-ups

- **Image generation** for the three inline diagram specs (stool, doorway,
  wagon). These are AI-image-generator prompts only; the PNG files have not
  been produced yet.
- **Image generation** for the Jordan graphic novel cover and remaining
  panels. The user has begun generating panels (panels 4, 5, and 7 reference
  `.jpeg` files), but the full set is not complete.
- **Pre-publication review** by a Grade 5 teacher before classroom use.
  Reading-level check, scenario relatability check, and a read-aloud test
  with at least one Grade 5 student.
- **Standards alignment cross-reference** — confirm that the 15 concepts
  in this chapter map cleanly to the ISTE Student Standards mentioned in
  the chapter prose.
