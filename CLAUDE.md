# Digital Citizenship — Project Instructions

This is the project-specific CLAUDE.md for the **Digital Citizenship for Grade 5**
intelligent textbook, created for **ISD 197** (West St. Paul–Mendota Heights–Eagan
Area Schools) in Minnesota.

The school district sits near **Bdote** — the historically and culturally
significant confluence of the Minnesota and Mississippi rivers, near Fort Snelling,
Mendota, and Pike Island, a site sacred to the Dakota people.

## Learning Mascot: Maka the River Otter

### Character Overview

- **Name**: Maka (pronounced "MAH-kah")
- **Species**: River otter
- **Personality**: Curious, kind, thoughtful, playful
- **Catchphrase**: "Pause, think, act!"
- **Visual**: Warm medium-brown fur with cream belly, large kind dark eyes,
  small round black glasses, a soft river-blue scarf (#2e6f8e), drawn in a
  modern flat cartoon vector style
- **Origin story**: Maka is inspired by the river otters that live at the
  confluence of the Minnesota and Mississippi rivers — the same waters that
  flow past ISD 197 schools. Like the otters of Bdote, Maka is playful,
  observant, and looks out for the rest of the family.

### Why an Otter?

River otters embody the habits this textbook teaches:

- **Curious without being reckless** — they investigate before they act
- **Social and kind to their group** — perfect metaphor for digital community,
  upstander behavior, and citizenship
- **Playful but observant** — matches the "pause, think, act" central habit
- **Native to the local rivers** — gives Grade 5 students at ISD 197 a sense
  of place and connection to where they live

### Voice Characteristics

- Uses simple, encouraging language appropriate for Grade 5 (ages 10–12)
- Refers to students as "friends" or "digital citizens"
- Models the "pause, think, act" habit in dialogue
- Never lectures or shames — always kind and supportive
- Uses occasional otter references ("Let's dive in!", "Let's float this idea")
  but does not overdo them
- Signature phrases:
  - "Pause, think, act!"
  - "Let's dive in, friends!"
  - "Take a slow breath before you click."
  - "You've got this!"

### Mascot Admonition Format

Always place mascot images in the **body** of the admonition, never in the
title bar. The title is clean text only — the default MkDocs icon is hidden
via CSS.

```markdown
!!! mascot-welcome "Title Here"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Maka waving welcome">
    Admonition text goes here, after the img tag.
```

**Image path note**: The `src` path is relative to the rendered page URL, not
the markdown file. For a chapter page at `chapters/01-intro/index.md`, use
`../../img/mascot/`. Count directories from the rendered page to
`docs/img/mascot/` for any other location.

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Once per chapter |
| Key concept / big idea | `mascot-thinking` | 2–3 per chapter |
| Helpful tip | `mascot-tip` | As needed |
| Common mistake / safety warning | `mascot-warning` | As needed |
| Difficult content | `mascot-encourage` | Where students may struggle |
| Section completion / achievement | `mascot-celebration` | End of major sections |

### Restraint Guidelines

Maka should appear **no more than 5–6 times per chapter**. The mascot is for
emphasis and emotional connection, not decoration.

**Do:**

- Use Maka to introduce new topics warmly at the start of chapters
- Include the catchphrase "Pause, think, act!" in welcome admonitions
- Keep dialogue brief — 1 to 3 sentences per admonition
- Match the pose to the content type (warning pose for warnings, etc.)
- Use simple, direct language Grade 5 students can read independently

**Don't:**

- Use Maka more than 5–6 times in any single chapter
- Place mascot admonitions back-to-back
- Use the mascot for purely decorative purposes
- Change Maka's personality, voice, or visual design
- Use Maka in contexts that require a serious adult tone (e.g., the safety
  rule about telling a trusted adult — that should be plain, direct text)
- Make jokes about the Dakota name "Maka" or the cultural context

## ISD 197 and Bdote — Cultural Context

This textbook was created for ISD 197, located on land near Bdote, a place
sacred to the Dakota people. When generating content:

- Treat the location and its history with respect
- The mascot's name "Maka" is from the Dakota word *makȟá* meaning "earth" —
  it is a respectful nod to the language and place, not a sacred or
  ceremonial term
- Do **not** put Maka in feathered headdresses, war paint, or any imagery
  appropriating Indigenous cultures
- Do **not** use the bald eagle as a mascot in this textbook — eagles are
  sacred to the Dakota and should not be cartooned for this audience

## Audience Personas

This textbook is read by **three distinct audiences**, each with its own needs,
vocabulary, and tolerance for length. Content must be written in the right
voice for the right audience. **Always identify which audience a file is for
before generating content for it.**

### Persona 1: The Student (Grade 5, ages 10–12)

**Who they are:** A 10- to 12-year-old in elementary school. They are reading
to *learn* something they can use today. They have short attention spans,
strong opinions, and limited patience for jargon. They love stories, characters,
and making choices. They are *not* miniature adults — they are children who
deserve clear, kind, age-appropriate writing.

**They read:** Chapter content (`docs/chapters/**/*.md`)

**They never read:** Learning graph files, instructor's guide, course
description, quality metrics, design notes.

**Voice:** Warm, simple, story-driven, second-person ("you"), Maka is present.

### Persona 2: The Teacher

**Who they are:** A classroom teacher, library-media specialist, or technology
coach who is using the textbook to teach a class. They want practical,
classroom-ready material — lesson plans, discussion questions, pacing
suggestions, accommodations. They have limited prep time. They need to know
*what to do tomorrow morning at 9 a.m.*

**They read:** The instructor's guide (`docs/teachers-guide/*.md`), the course
description, the learning graph (for unit planning), and the chapter content
(to know what their students are reading).

**Voice:** Professional, practical, peer-to-peer. Plain text — **no Maka
admonitions**. Bullet lists, tables, time estimates, classroom tips. Treats
the teacher as a capable colleague, not a student.

### Persona 3: The School District Curriculum Administrator

**Who they are:** A district curriculum coordinator, technology director,
assistant superintendent, or school board member. **They have the authority to
adopt or reject this textbook for the district.** They are evaluating whether
to commit budget, training time, and classroom hours to this material. They
need to see standards alignment, evidence of quality, and confidence that the
textbook will not embarrass the district.

**They read:** The course description, the learning graph (for standards
alignment and rigor), the quality metrics, the taxonomy distribution, the
design notes, the mascot design decisions document, and the README. They may
spot-check a chapter, but they will not read the textbook cover-to-cover.

**Voice:** Formal, evidence-based, alignment-focused. References to ISTE
Standards, Bloom's Taxonomy, Common Sense Education frameworks, and
peer-reviewed research where appropriate. Plain text — **no Maka admonitions**.
No casual language. No second-person address.

### Where Each Voice Lives

| File path | Audience | Voice | Maka? |
|---|---|---|---|
| `docs/chapters/**/*.md` | Student | Grade 5 style guide (below) | **Yes** — up to 5–6 per chapter |
| `docs/teachers-guide/**/*.md` | Teacher | Professional, peer-to-peer | **No** |
| `docs/learning-graph/**/*.md` | Administrator | Formal, evidence-based | **No** |
| `docs/course-description.md` | Administrator | Formal, evidence-based | **No** |
| `docs/index.md` (home) | Mixed | Welcoming, neutral | **No** (or once at top, optional) |
| `docs/license.md`, `docs/contact.md` | Mixed | Plain professional | **No** |

**Critical rule:** When generating or editing content, first check the file
path to determine the audience. Do not apply the Grade 5 style guide to
learning graph files, instructor guides, the course description, or any
administrator-facing material. Doing so will undermine the textbook's
credibility with the people who decide whether to adopt it.

## Style Guide for Grade 5 Chapter Content

**This style guide applies ONLY to files in `docs/chapters/`.** It does not
apply to the learning graph, the instructor's guide, the course description,
or any other administrator-facing or teacher-facing material.

The goal of this style guide is simple: a Grade 5 student should be able to
read a chapter on their own, understand it, enjoy it, and remember it a week
later.

### Reading Level

- **Target reading level:** Flesch–Kincaid grade 4 to grade 6. Aim for the
  middle of that range.
- **Average sentence length:** 12 to 15 words. Maximum about 20.
- **Paragraph length:** 2 to 4 sentences. Long paragraphs lose Grade 5
  readers.
- **Vocabulary:** Use everyday words. When a term must be introduced (like
  *digital footprint*, *clickbait*, *upstander*, *misinformation*), define it
  the first time it appears, in plain language, before using it again.

### Voice and Tone

- **Second person.** Talk *to* the student. Use "you," "your," "we," "us."
  Avoid "the student" or "one should."
- **Active voice.** "You can pause before you click" — not "the click can
  be paused before it is made."
- **Concrete over abstract.** "If your friend posts a mean comment about
  someone in your class…" — not "in cases of negative peer interaction…"
- **Warm but never babyish.** Grade 5 students notice condescension immediately.
  Treat them like the smart, capable people they are.
- **Curious, not preachy.** Ask questions. Invite the student to think.
  Don't lecture, scold, or scare.
- **Hopeful.** Even when the topic is hard (cyberbullying, scams,
  misinformation), the tone should leave the student feeling like they have
  the tools to handle it.

### Sentence and Paragraph Mechanics

- **Short sentences win.** When in doubt, break a sentence in two.
- **One idea per sentence.** Don't stack three concepts with semicolons.
- **Lists over long prose.** If you have three or more parallel items,
  use a bulleted or numbered list.
- **Headings often.** Break content into short sections with clear, kid-friendly
  headings ("What is a digital footprint?" not "Conceptual Foundations of
  Digital Identity").
- **No walls of text.** A page with no headings, lists, or images is a page
  a Grade 5 student will skim and forget.

### Words to Use and Words to Avoid

**Use these:**

- *post, share, click, swipe, type, comment* (concrete actions)
- *kind, mean, safe, unsafe, fair, unfair* (clear moral words)
- *trusted adult* (the textbook's preferred term — never "authority figure")
- *pause, think, act* (the course's central habit)
- *upstander, bystander, target* (defined and reused consistently)
- *private information* vs. *personal information* (defined in Module 3)

**Avoid these:**

- *Utilize* (use "use"), *facilitate* (use "help"), *implement* (use "do")
- *Stakeholder, paradigm, framework, methodology* (administrator words)
- *Inappropriate* (too vague — say what's actually wrong)
- *Predator* (too scary and too vague — use specific safe-talk language)
- *Cyber-* compounds beyond *cyberbullying* (cyberspace, cybercrime, etc.
  feel dated to kids)
- Slang that ages quickly (*sus, no cap, rizz, slay*) — the textbook should
  still read well in five years
- Brand and platform names (TikTok, Snapchat, Discord, Instagram) — the
  textbook stays platform-agnostic

### Defining New Terms

Always introduce vocabulary like this:

> A **digital footprint** is the trail of information you leave behind when
> you use the internet. Every time you post, click, or share, you add a
> footprint to your trail.

The pattern is: **bold the term**, then a one-sentence definition in plain
words, then a concrete example in the next sentence.

### Story and Scenario Patterns

Grade 5 students learn through stories. Most chapter sections should open
with or include a short scenario involving a fictional kid. Use a variety
of names, backgrounds, and situations. Recurring fictional characters can
appear across chapters. When a chapter has one strong narrative moment that
deserves more than a paragraph, consider lifting it out into a **mini
graphic novel** in `docs/stories/` — see the dedicated section near the
end of this file for the two-pass workflow.

**Scenario opening pattern:**

> Maya is in fifth grade. One morning before school, she sees a video on her
> tablet that says, "You won't BELIEVE what happens next!" She feels her
> finger move toward the screen. Should she tap it?

This pattern works because it:

1. Names a specific kid (concrete, relatable)
2. Sets a specific moment (not "in general")
3. Shows the *feeling* the student might have (not just the action)
4. Ends with a question that hands the choice back to the reader

### Maka the River Otter in Chapter Content

Maka appears **only in chapter content** — never in the learning graph,
instructor's guide, course description, or administrator-facing files.
Use the seven admonition types as defined in the Learning Mascot section
above. The full restraint rules (5–6 per chapter, no back-to-back, no
decoration) apply.

**Maka's voice in chapter content** is consistent with the Voice
Characteristics section above:

- "Hi friends! In this chapter, we'll learn…" (welcome)
- "Pause, think, act!" (the catchphrase, used sparingly)
- "Take a slow breath before you tap that link." (tip)
- "Whoa — let's pause for a second." (warning)
- "You've got this. It feels tricky at first, and that's okay." (encourage)
- "Look at what you just learned! High-five!" (celebration)

**Do not** use Maka to deliver:

- The "tell a trusted adult" safety rule (this should be plain, direct text)
- Definitions of vocabulary terms (these go in the body, bolded)
- Numbered procedural steps (lists work better than mascot dialogue)
- Anything that could be mistaken for a real adult giving real advice

### Examples of Grade 5 Voice — Right and Wrong

**Wrong (too formal, too long, too abstract):**

> The proliferation of digital media platforms has created an environment
> in which adolescents must develop critical evaluation skills to assess
> the credibility of online information sources prior to engaging with or
> disseminating such content.

**Right (Grade 5 voice):**

> The internet is full of stories. Some are true. Some are not. Before you
> share something, slow down and ask: *Who said this? How do they know?
> Where's the proof?* If you can't answer those questions, don't share it
> yet.

**Wrong (preachy, scary, condescending):**

> You must always be careful online because predators are everywhere and
> will try to trick innocent children into making terrible mistakes that
> could ruin their lives forever.

**Right (Grade 5 voice):**

> Most people you meet online are kind. But sometimes a stranger online
> will act friendly to try to get information they shouldn't have. If a
> conversation starts to feel weird — even a little bit — that's your
> brain telling you something. Stop the chat and tell a trusted adult.
> You're not in trouble for telling.

**Wrong (slang that will age badly):**

> No cap, fr fr, sharing your address online is lowkey sus and could
> straight-up ruin your whole vibe.

**Right (Grade 5 voice):**

> Sharing your home address online is one of the riskiest things you can
> do. Even if the website looks safe, you can't see who's reading on the
> other end. Keep your address private — that's a rule you can use forever.

### Length Targets for a Chapter

A typical chapter for Grade 5 should be:

- **400 to 800 words of body text per major section**
- **3 to 6 major sections per chapter**
- **Total chapter length:** 1,500 to 4,000 words
- **At least one scenario or story** per chapter
- **At least one MicroSim** per chapter (per the course design)
- **5 to 6 Maka admonitions** maximum, placed where they earn their spot

Longer than this and Grade 5 students lose focus. Shorter than this and the
content feels too thin to teach the concept.

### Quick Checklist Before Submitting Chapter Content

Before any chapter file is considered done, verify:

- [ ] File path is in `docs/chapters/` (if not, this style guide does not apply)
- [ ] Reading level is grade 4–6 (check with a tool if unsure)
- [ ] No sentence is longer than ~20 words
- [ ] No paragraph is longer than 4 sentences
- [ ] Every new vocabulary term is bolded and defined the first time
- [ ] At least one concrete scenario with a named fictional kid
- [ ] Maka appears no more than 5–6 times
- [ ] No Maka back-to-back
- [ ] The "tell a trusted adult" rule is in plain text, not in mascot dialogue
- [ ] No platform names, no slang, no scary language, no condescension
- [ ] A Grade 5 student could read it out loud and understand it

If any box is unchecked, revise before publishing.

## Mini Graphic Novel Stories

This project supports **mini graphic novel stories** — short 6 to 8 panel
narrative companions to a chapter, with one image per panel and a short
prose paragraph below each image. Stories live in `docs/stories/` and are
generated using the `/story-generator` Claude skill (adapted from the
historical-figure version of that skill to handle fictional contemporary
Grade 5 characters).

**Working example:** [Jordan's One-Second Choice](docs/stories/jordan-one-second-choice/index.md)
— companion to Chapter 2.

### When to Use a Mini Graphic Novel

Not every chapter needs one. Consider lifting a story out of the chapter
prose into its own mini graphic novel when **all** of these are true:

- The chapter has one specific narrative moment with a clear emotional arc
  (invitation → conflict → choice → resolution).
- That moment is doing real teaching work — it models a habit or skill
  that the chapter is asking students to learn.
- The arc has at least 6 distinct beats. Two beats is a paragraph; six or
  more beats is a story that wants to breathe.
- The story can stand on its own and be revisited by a teacher or a
  student outside the chapter context.

If those conditions are not met, keep the scenario inline in the chapter.
Don't manufacture stories just because the capability exists.

### Two-Pass Workflow (Important)

When the chapter content generator decides a chapter would benefit from a
mini graphic novel, it should **not** try to write the full story on the
first pass. Image generation is the expensive step, and the story-generator
skill is the right tool for the full expansion. Instead, use a two-pass
workflow:

**Pass 1 — chapter content generator (this skill):**

1. Identify the one narrative moment in the chapter that would make a
   strong mini graphic novel. Most chapters will have zero or one. A few
   may have none — that is fine.
2. In the chapter prose, keep the narrative scene short (one or two
   paragraphs as a frame), and add a `!!! note "Read..."` callout that
   links to the planned story file.
3. Create a **stub file** at `docs/stories/{kebab-case-name}/index.md`
   containing only:
   - YAML frontmatter (`title`, `description`, placeholder image paths)
   - An H1 with the story title
   - A one-paragraph summary of the story arc (what happens from beat 1
     to beat N, in plain prose)
   - A list of the 6 to 8 planned panel beats, one line each
   - A clearly visible **TODO** marker at the top of the body, e.g.:

     ```markdown
     > **TODO (story-generator):** This file is a stub. The full mini
     > graphic novel — image prompts, panel narration, cover, and
     > epilogue — will be generated in a future pass using the
     > `/story-generator` skill. Do not generate images until then.
     ```
4. Add the stub to the `Stories` section of `mkdocs.yml`.
5. Stop. Do not write image prompts. Do not write panel narration. Do
   not invoke the story-generator skill.

**Pass 2 — story-generator skill (separate, later task):**

When the user is ready to invest the time and image-generation budget,
they will explicitly invoke the `/story-generator` skill on the stub. The
skill expands the stub into a full mini graphic novel: cover image prompt,
6 to 8 panels with image prompts in `<details>` blocks, prose narration
below each panel, an epilogue table, and cross-links back to the chapter.
The user then runs `generate-images.py` to produce the PNGs (current
budget: ~Create.039 per image, ~Create.30 to Create.45 per story).

Splitting the work this way means the chapter content generator stays
fast and cheap, the story-generator skill stays focused on its strength,
and the user controls when image-generation costs are incurred.

### Style Rules for Mini Graphic Novel Stories

- **No Maka.** The mascot appears only in chapter content, never in
  stories. Stories use plain prose narration.
- **Same Grade 5 voice as chapters.** Sentences ≤ 20 words, paragraphs
  2 to 4 sentences, second person where appropriate, no slang, no
  platform names, no scary language.
- **The "tell a trusted adult" rule** still appears in plain prose,
  never in any admonition or callout block.
- **Diverse, kind characters.** Vary names, skin tones, hair, clothing,
  and family situations across stories. No bullying caricatures — even
  the kids making bad choices should read as kids in a moment of bad
  judgment, not as villains.
- **No Indigenous appropriation.** The same cultural-sensitivity rules
  from the Maka and Bdote sections apply to story characters.
- **Visual style consistency.** Image prompts should specify modern flat
  cartoon vector style, warm palette, river-blue (#2e6f8e) accents, and
  16:9 horizontal landscape format — matching Maka and the rest of the
  textbook art.
- **Cross-link, don't duplicate.** The chapter and the story link to
  each other. The chapter does not repeat the full story; the story
  does not repeat the full chapter.

### File and Directory Conventions

- Story directories use kebab-case: `docs/stories/jordan-one-second-choice/`
- Each story has exactly one `index.md`
- Image filenames are `cover.png` and `panel-01.png` through `panel-08.png`
  (or `panel-12.png` for a full-length story)
- Stories are listed in `mkdocs.yml` under a top-level `Stories` section
  in chronological order of when they were added (or by chapter order
  if they map cleanly to chapters)
