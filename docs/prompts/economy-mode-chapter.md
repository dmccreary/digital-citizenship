# Economy-Mode Chapter Generation Prompt

This page contains the exact prompt to use for generating chapters of
the *Digital Citizenship for Grade 5* textbook in **economy mode** —
a configuration that fits inside a single Claude Pro plan 5-hour
window (~200,000 tokens) instead of consuming the ~$20 / 1.1M weighted
tokens of the "max effort" mode used to generate Chapter 1.

Chapter 1 was deliberately written under "max effort" (Opus 4.6,
ultrathink, plan mode, parallel Explore subagents, heavy verification)
to establish the voice, structure, and Maka rhythm for the entire
book. Chapters 2 through 17 should imitate Chapter 1 directly using
this economy-mode prompt.

For the full token-cost analysis that motivates this prompt, see
[Chapter 1 cost report](../chapters/01-welcome-to-digital-world/cost.md).

## Workflow

For each chapter, perform these steps in Claude Code:

1. Type `/clear` to reset the conversation context. **This is
   critical** — without it, every chapter inherits the cache footprint
   of the previous chapter and the cumulative cost grows fast.
2. Confirm you are on `claude-opus-4-6` (run `/model` if unsure). For
   even cheaper generation (~$0.44 per chapter instead of ~$2.18),
   switch to `claude-sonnet-4-6`.
3. Paste the prompt template below, with the four placeholders filled
   in:
   - `[N]` — chapter number (e.g. `2`)
   - `[NN]` — two-digit chapter number with leading zero (e.g. `02`)
   - `[chapter-slug]` — the chapter directory name (e.g.
     `what-is-a-digital-citizen`)
   - `[Chapter Title]` — the title from the chapter stub (e.g.
     `What Is a Digital Citizen?`)

## Prompt template

````text
Generate Chapter [N] ("[Chapter Title]") of the Digital Citizenship
for Grade 5 textbook for ISD 197.

ECONOMY MODE — strict constraints:
- DO NOT enter plan mode. Write the chapter directly.
- DO NOT spawn Explore, Task, or any subagents. Use the Read tool
  directly for every file.
- DO NOT use extended thinking. No "think", no "think hard", no
  "ultrathink". Standard reasoning only.
- DO NOT read any project files outside the four listed below.
- DO NOT run verification grep loops with more than one grep per
  check.

READ EXACTLY THESE FOUR FILES, IN THIS ORDER, ONCE EACH:
1. docs/chapters/[NN]-[chapter-slug]/index.md
   — the chapter stub with the title, summary, and concept list
2. docs/chapters/01-welcome-to-digital-world/index.md
   — the style, voice, and structure template. Imitate it closely.
3. docs/learning-graph/mascot-test.md
   — the exact mascot admonition markdown to copy verbatim
4. CLAUDE.md
   — the Grade 5 style guide and Maka rules. Skim, do not re-read.

WRITE THE CHAPTER:
- Output to docs/chapters/[NN]-[chapter-slug]/index.md
- Preserve the existing H1 title, ## Summary, ## Concepts Covered,
  and ## Prerequisites sections exactly as they currently are.
- Replace the "TODO: Generate Chapter Content" line (and only that
  line) with the new body content.
- Add YAML frontmatter at the top with: title, description,
  generated_by, date (today), version: 0.07.

STRUCTURE — match Chapter 1 exactly:
- Opening scenario with a named Grade 5 student. Vary the name
  across chapters (not always Maya — use Jordan, Aisha, Marcus,
  Priya, Diego, Lily, etc.). Show a feeling, end with a question
  that hands the choice to the reader.
- 4 to 6 sections, each defining 2 to 6 concepts using the bold-
  and-define pattern: **term** = one-sentence plain definition,
  then a concrete example in the next sentence.
- Maka admonitions: ≤ 6 total, no back-to-back. Use this budget:
  • One mascot-welcome near the top
  • Mascot-warning / thinking / tip as needed
  • One mascot-celebration at the end
- Closing recap list of every concept with a 4–6 word reminder.
- Length: 1,500 to 4,000 words of body prose. Target 2,300.
- Include at least 4 non-text elements total: at least one table,
  one list, and one MicroSim or diagram spec block in a
  <details markdown="1"> block with sim-id, Library, and Status
  fields.

CRITICAL RULES:
- Grade 5 voice: sentences ≤ 20 words, paragraphs 2–4 sentences,
  active voice, second person ("you"), warm but not babyish.
- The "tell a trusted adult" rule MUST always appear in plain prose.
  NEVER put it inside a Maka admonition.
- No platform names (TikTok, Instagram, Snapchat, Discord, YouTube,
  Roblox, Minecraft, etc.).
- No slang (sus, no cap, rizz, slay).
- No administrator jargon (utilize, stakeholder, framework,
  inappropriate, predator, cyberspace).
- Do NOT create any glossary file. Define every term inline.
- Do NOT generate the actual MicroSim files (no main.html, no
  main.js). The chapter only contains the spec block. A separate
  task will build the sim later.

VERIFY (one short paragraph, no grep loops):
After writing, run exactly these five checks and report each on one
line. Use one grep call per check, max:
1. Every concept from the chapter's "Concepts Covered" list appears
   bolded somewhere in the body.
2. Count of `!!! mascot-` ≤ 6 and none are back-to-back.
3. Every "trusted adult" match is in plain prose, not inside a
   `!!! mascot-` block.
4. The string "TODO: Generate Chapter Content" no longer appears.
5. Total word count is between 1,500 and 4,000.

Report the five results in a five-line bullet list and stop. Do not
re-read the file. Do not write a session log. Do not summarize what
you did beyond the five verification lines.
````

## Worked example — Chapter 2

After typing `/clear`, paste:

````text
Generate Chapter 2 ("What Is a Digital Citizen?") of the Digital
Citizenship for Grade 5 textbook for ISD 197.

ECONOMY MODE — strict constraints:
- DO NOT enter plan mode. Write the chapter directly.
- DO NOT spawn Explore, Task, or any subagents. Use the Read tool
  directly for every file.
- DO NOT use extended thinking. No "think", no "think hard", no
  "ultrathink". Standard reasoning only.
- DO NOT read any project files outside the four listed below.
- DO NOT run verification grep loops with more than one grep per
  check.

READ EXACTLY THESE FOUR FILES, IN THIS ORDER, ONCE EACH:
1. docs/chapters/02-what-is-a-digital-citizen/index.md
2. docs/chapters/01-welcome-to-digital-world/index.md
3. docs/learning-graph/mascot-test.md
4. CLAUDE.md

[... rest of the prompt template above, unchanged ...]
````

## Why each constraint matters (cost-wise)

Every line in the constraints block exists because of a specific
behavior that drove up the cost of Chapter 1. Removing any one of
these constraints will push the chapter back over the Pro plan's
5-hour rate-limit window.

| Constraint | What it prevents | Tokens saved |
|---|---|---|
| `DO NOT enter plan mode` | The two-phase plan-then-execute workflow that read every project file twice | ~265K cache create + ~1.9M cache read |
| `DO NOT spawn Explore subagents` | Each parallel agent has its own context and produces a multi-thousand-word report that becomes cache for the parent | ~50K cache create per agent |
| `DO NOT use extended thinking` | Ultrathink output is invisible but billed as output tokens at $75/MTok on Opus | Roughly halves output token count |
| `Read ONLY these 4 files` | Stops the agent from chain-reading dependencies and re-reading long files | ~30–50K cache create |
| `One grep per check` | Prevents the verification loop that ran 10+ greps at the end of Chapter 1, each replaying ~125K cached tokens | ~1.3M cache read |
| `/clear before each chapter` | Resets cache so cumulative context does not grow chapter-over-chapter | Compounds across chapters |

## Estimated cost per chapter in economy mode

| Model | Estimated cost per chapter | Fits in Pro 5h window? |
|---|---:|---|
| **Claude Opus 4.6** | ~$2.18 | Yes |
| **Claude Sonnet 4.6** | ~$0.44 | Yes, comfortably |
| Reference: Chapter 1 in max-effort mode | $20.07 | No (5.7× over) |

## What to do if the result is wrong

If the generated chapter has issues (missing concept, wrong voice,
back-to-back Maka admonitions), do **not** start a new conversation.
Stay in the same `/clear`-ed context and ask for the specific fix.
The cache from the original generation is still warm, so a follow-up
fix is cheap (typically a few thousand cache-read tokens plus a small
output).

Common follow-up prompts:

- `The Maka admonitions on lines X and Y are back-to-back. Add a paragraph of body prose between them.`
- `Concept "[concept name]" is missing from the body. Add a definition of it in section [N].`
- `Sentence "[quoted sentence]" is too long. Split it into two shorter sentences.`
- `The trusted-adult rule is inside the Maka warning admonition. Move it into plain prose right after the admonition.`

If the chapter needs more substantial rework, do **not** keep
patching. Type `/clear` and re-run the full economy-mode prompt with
the same chapter number — a fresh single-shot regeneration is usually
cheaper than a long patching session.

## Once all 17 chapters are written

After all 17 chapters exist, the recommended next passes are:

1. **MicroSim implementation pass** — for each `<details>` spec block
   with `Status: Specified`, generate the actual `main.html` and
   `main.js` files at `docs/sims/[sim-id]/`. Use a separate
   conversation per MicroSim (or batch a few small ones together).
2. **Glossary generation pass** — once every concept has been defined
   in at least one chapter, run the glossary generator skill to
   produce `docs/glossary.md` from the inline definitions.
3. **Teacher's-guide pass** — generate the parallel `docs/teachers-guide/`
   content. This audience uses a different voice (peer-to-peer,
   no Maka), so it cannot reuse the chapter prompts above.
