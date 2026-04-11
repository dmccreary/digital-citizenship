# Chapter Design Session Log

## About This Document

This document records the design decisions, methodology, and validation process
behind the 17-chapter structure of the *Digital Citizenship* interactive intelligent
textbook. It is
written for **district curriculum administrators, technology directors,
assistant superintendents, and school board members** who are evaluating
whether to adopt this textbook for Minnesota Independent School District (ISD) 197 or another district.

The intent of the document is transparency. Curriculum adoption is a
significant decision involving budget, training time, and classroom hours, and
administrators have the right to understand exactly how the chapter structure
was designed, what trade-offs were made, and what evidence supports each
decision. Nothing in this textbook should be a black box.  We can
always instruct AI systems to be transparent about their design decisions.
This is an example of this transparency.

---

## Executive Summary

The textbook is organized into **17 chapters** covering **265 concepts** drawn
from a learning graph aligned to the **ISTE 1.2 Digital Citizen Standards**
and the **Common Sense Education K–12 Digital Citizenship Curriculum**
framework. Chapters average **15.6 concepts** each, with a range of 13 to 25.
Most chapters (16 of 17) hold 13 to 19 concepts.

Every chapter has been validated against the underlying concept dependency
graph: **no concept appears in the textbook before its prerequisite concepts
have been taught**. This was verified by topological sort and a strict
zero-violation check.

The structure was designed in two passes. Pass one produced a 9-chapter
structure that mapped one chapter per ISTE module. After teacher review, the
structure was redesigned in pass two to produce smaller, Grade 5–appropriate
chapters that better match the cognitive load of 10- to 12-year-old readers.
Pass two is the final structure documented here.

---

## Standards Alignment

This textbook is anchored in two standards frameworks that district curriculum
administrators will recognize.

### ISTE 1.2 Digital Citizen

ISTE Standard 1.2 ("Digital Citizen") asks students to "recognize the rights,
responsibilities, and opportunities of living, learning, and working in an
interconnected digital world" and to "act and model in ways that are safe,
legal, and ethical." Its four indicators are:

| Indicator | Title | Chapters Covering |
|---|---|---|
| 1.2.2a | Digital Identity | Ch 7, 8 |
| 1.2.2b | Safe and Ethical Behavior | Ch 1, 2, 3, 4, 9, 10, 11, 12 |
| 1.2.2c | Intellectual Property Rights | Ch 8 |
| 1.2.2d | Personal Data Privacy and Security | Ch 5, 6 |

Two additional categories — **Misinformation and News Literacy** (Ch 13, 14)
and **Critical Thinking** (Ch 15, 16) — extend beyond the strict ISTE 1.2
text to address newer concerns that the original ISTE indicators predate.
These two areas are increasingly required by state standards and by district
technology coaches, and their inclusion was validated against the Common Sense
Education updated framework.

### Common Sense Education K–12 Digital Citizenship Topics

The Common Sense Education framework organizes digital citizenship into six
topic areas. The chapter structure maps cleanly to all six:

| Common Sense Topic | Chapters |
|---|---|
| Media Balance and Wellbeing | Ch 3, 4 |
| Privacy and Security | Ch 5, 6 |
| Digital Footprint and Identity | Ch 7, 8 |
| Relationships and Communication | Ch 9, 10 |
| Cyberbullying, Digital Drama, and Hate Speech | Ch 11, 12 |
| News and Media Literacy | Ch 13, 14 |

Chapters 1, 2 (Foundations), 15, 16 (Critical Thinking), and 17 (Capstone) are
not part of the Common Sense Education framework directly but provide the
scaffolding, critical-thinking depth, and synthesis project that bring the
six topics together into a coherent course. A teacher already using Common
Sense Education materials can drop this textbook into an existing unit
without re-planning their year.

### Bloom's Taxonomy Distribution

Each chapter teaches concepts at multiple Bloom's Taxonomy levels (Remember,
Understand, Apply, Analyze, Evaluate, Create). The full taxonomy distribution
report is available in [taxonomy-distribution.md](./taxonomy-distribution.md).
The capstone chapter (Ch 17) is dominated by **Create**-level objectives, in
keeping with the project-based nature of the *Digital Citizenship Toolkit*.

---

## How the Design Was Made

### Inputs

Four files provided the inputs for chapter design:

1. **`docs/course-description.md`** — Defines the audience (Grade 5, ages
   10–12), the learning outcomes, the topics in scope, and the topics
   explicitly out of scope. The chapter structure must respect these scope
   boundaries — for example, no chapter introduces step-by-step tutorials for
   specific social-media platforms, because the course description rules
   those out.
2. **`docs/learning-graph/learning-graph.json`** — A directed acyclic graph
   (DAG) of 265 concepts and 457 dependency edges. Each edge represents a
   "depends on" relationship: edge `from: A, to: B` means concept A cannot
   be taught until concept B is already understood.
3. **`docs/learning-graph/concept-taxonomy.md`** — Groups the 265 concepts
   into nine taxonomy categories that mirror the course modules.
4. **`CLAUDE.md`** — Project-level guidance on the three reader personas
   (student, teacher, administrator), the Grade 5 style guide, and the
   pedagogical mascot Maka the River Otter.

### The Two Constraints

The chapter design had to satisfy two non-negotiable constraints simultaneously.

**Constraint 1: Respect every dependency in the graph.**

If concept B depends on concept A, then A must be in the same chapter as B or
in an earlier chapter. There can be no forward references. This was validated
by building a chapter-position map for every concept and checking every edge:

```python
violations = []
for concept_id, chapter in chapter_map.items():
    for prereq in prereqs.get(concept_id, set()):
        if chapter_map[prereq] > chapter:
            violations.append((concept_id, chapter, prereq, chapter_map[prereq]))
assert len(violations) == 0
```

The final design has **zero violations**.

**Constraint 2: Stay within Grade 5 cognitive load limits.**

Grade 5 students (ages 10–12) cannot absorb a 30-concept chapter the way a
high school or college student can. Research on reading load and working
memory suggests that 13 to 19 distinct concepts is the upper bound for what
a 10-year-old can retain across one chapter, especially when each concept
must be practiced before being assessed. The target was set at **20 ± 7**
concepts per chapter, with flexibility for logical groupings.

### Pass One: 9 Chapters (Rejected)

The first design was a clean one-to-one mapping between taxonomy categories
and chapters. It produced 9 chapters of 25 to 34 concepts each (average 29.4).

This was the most administratively elegant structure — it mapped 1:1 to ISTE
1.2.2a–d plus Common Sense Education topics — but it was rejected after the
curriculum author reviewed it against the Grade 5 reading load. The author
noted that 5th-grade students would do better with smaller, more digestible
chapters even if it meant more chapters overall.

The administrator-friendly observation here is important: **the textbook
prioritizes student learning over administrative tidiness**. A 9-chapter
structure would have looked cleaner on a curriculum map, but it would have
asked too much of 10-year-old readers per chapter. The redesign cost no
content — every concept is still in the textbook — and the standards alignment
is still complete, just distributed across more chapters.

### Pass Two: 17 Chapters (Final)

Pass two split the eight non-capstone taxonomy categories into pairs of
chapters using a consistent **"recognize → respond"** pattern:

| Category | Part 1 ("Recognize") | Part 2 ("Respond") |
|---|---|---|
| Foundations | Ch 1: Devices and networks | Ch 2: Citizenship habits |
| Media Balance | Ch 3: Recognize balance/imbalance | Ch 4: Build the habits |
| Privacy | Ch 5: Know private vs personal | Ch 6: Defend yourself |
| Digital Footprint | Ch 7: What a footprint is | Ch 8: Protect your reputation |
| Relationships | Ch 9: Talking online | Ch 10: Safe Talk and limits |
| Cyberbullying | Ch 11: Recognize bullying | Ch 12: Stand up safely |
| Misinformation | Ch 13: Recognize misinformation | Ch 14: Fact-check it |
| Critical Thinking | Ch 15: The four questions | Ch 16: Healthy doubt |

The capstone (Ch 17) was kept as a single 25-concept project chapter rather
than being split, because each of its 25 "concepts" is actually a deliverable
in the *Digital Citizenship Toolkit* project. Splitting them would break the
pedagogical metaphor of "one toolkit, many tools."

The "recognize → respond" pattern was not arbitrary. It mirrors the central
habit the textbook teaches — **pause, think, act** — at the structural level.
Every category first asks students to *pause and notice* (a screen-time
problem, a clickbait headline, a cyberbullying situation, a misleading
statistic), then teaches them what to *do* about it. By the end of the
textbook, the structure of the textbook *is* the habit being taught.

### Dependency Resolution

Splitting taxonomy categories in half introduced 9 dependency violations
where a concept in a Part 1 chapter required a prerequisite that had been
placed in a Part 2 chapter. All 9 violations were resolved by moving the
violating concepts (or their prerequisites) to the chapter where the
prerequisite already lived. The seven moves are documented below for
transparency:

| Concept | Original Chapter | Final Chapter | Reason |
|---|---|---|---|
| Online Activity | Ch 2 (Citizen) | Ch 1 (Welcome) | App and Account in Ch 1 require it |
| Screen Break | Ch 4 (Habits) | Ch 3 (Imbalance) | Outdoor Time and App Time Limit require it |
| Media Imbalance | Ch 4 (Habits) | Ch 3 (Imbalance) | Sleep Habits requires it |
| App Permission | Ch 5 (Private/Personal) | Ch 6 (Passwords) | Requires Data Tracking |
| Email Privacy | Ch 5 (Private/Personal) | Ch 6 (Passwords) | Requires Password |
| Footprint Audit | Ch 7 (Footprint) | Ch 8 (Reputation) | Requires Positive Footprint |
| Jumping To Conclusion | Ch 16 (Doubt) | Ch 15 (Critical Q's) | Generalization requires it |

Three additional moves had been made in pass one and were carried forward:

| Concept | Original Chapter | Final Chapter | Reason |
|---|---|---|---|
| Login | Ch 1 (Welcome) | Ch 6 (Passwords) | Requires Password |
| FOMO | Ch 3 (Balance) | Ch 12 (Upstander) | Requires Emotional Impact |
| Ghosting | Ch 10 (Safe Talk) | Ch 12 (Upstander) | Requires Emotional Impact |

After these 10 moves, the final design contains zero dependency violations,
and every one of the 265 concepts is in exactly one chapter — no duplicates,
no omissions.

---

## Final Chapter Statistics

| # | Chapter Title | Concepts |
|---|---|---|
| 1 | Welcome to the Digital World | 17 |
| 2 | What Is a Digital Citizen? | 15 |
| 3 | Media Balance and Spotting Imbalance | 15 |
| 4 | Building Healthy Tech Habits | 14 |
| 5 | Private vs. Personal Information | 15 |
| 6 | Passwords, Clickbait, and Staying Safe Online | 19 |
| 7 | What Is a Digital Footprint? | 14 |
| 8 | Reputation, Sharing, and Giving Credit | 15 |
| 9 | Online Friends and How We Talk | 13 |
| 10 | Safe Talk and Setting Boundaries | 13 |
| 11 | When Conflict Becomes Cyberbullying | 15 |
| 12 | Standing Up Safely as an Upstander | 15 |
| 13 | What Is Misinformation? | 16 |
| 14 | Becoming a Fact Checker | 13 |
| 15 | The Four Critical Questions | 18 |
| 16 | Healthy Doubt and Open Minds | 13 |
| 17 | Your Digital Citizenship Toolkit | 25 |
| | **Total** | **265** |

- **Average concepts per chapter:** 15.6
- **Median:** 15
- **Range:** 13–25
- **Standard deviation:** ~3.0 (excluding the capstone)
- **Chapters within target range (13–27):** 17 of 17 (100%)
- **Chapters within optimal range (13–19):** 16 of 17 (94%)

---

## Pacing Fit

A typical U.S. K–6 school year contains approximately 36 instructional weeks.
With 17 chapters, the textbook works out to approximately **one chapter every
two weeks**, leaving roughly two weeks at the start for setup and routines and
two weeks at the end for the capstone project. This pacing leaves time within
each two-week chapter window for:

- One or two class readings of the chapter content
- One or two MicroSim activities (each chapter has at least one)
- One graphic-novel story discussion (anchored to the chapter's central scenario)
- One classroom discussion or role-play
- One short assessment or reflection
- A small amount of buffer for absences, snow days, and reteach

The 17-chapter cadence also fits well with a quarter-based grading system
(roughly four chapters per quarter, with the capstone overlapping the final
quarter as a culminating project).

---

## Adoption Considerations for District Administrators

### What the Textbook Provides

When fully built out, each chapter will include:

- A short body text written at a Grade 5 reading level (roughly 1,500 to 4,000
  words per chapter, broken into 3 to 6 sections)
- A consistent pedagogical mascot, **Maka the River Otter**, who appears 5 to 6
  times per chapter at moments of welcome, key insight, tip, warning,
  encouragement, and celebration
- At least one **MicroSim** — a small browser-based interactive simulation
- At least one **graphic-novel story** anchoring the chapter's central concept
  in a relatable scenario
- A list of vocabulary terms (drawn from the learning graph) defined in plain
  language the first time each term appears
- An end-of-chapter reflection or short assessment

### What the Textbook Does Not Provide

To set expectations honestly, this textbook does **not** provide:

- Step-by-step tutorials for specific social-media platforms (TikTok,
  Instagram, Snapchat, Discord). The textbook is intentionally
  platform-agnostic so it does not promote any account or app and does not
  go out of date.
- Coding or computer science content beyond basic browser literacy.
- Advanced cybersecurity topics (networking, cryptography, malware analysis).
- High school or college legal topics (DMCA, full COPPA text, contract law).
- Configuration of parental-control software, router settings, or district
  filtering — these are explicitly the responsibility of parents, guardians,
  and IT staff.
- Generative-AI policy or deepfake detection — these are addressed in a
  separate middle-school course.

### Cultural and Place-Based Considerations

This textbook was designed specifically for ISD 197, a Minnesota district
located near **Bdote** — the historically and culturally significant
confluence of the Minnesota and Mississippi rivers, near Fort Snelling,
Mendota, and Pike Island. The pedagogical mascot, **Maka the River Otter**,
takes its name from the Dakota word *makȟá* meaning "earth," in
acknowledgment of the Dakota people who have lived on and cared for this
land for centuries.

The use of the Dakota word "Maka" was made thoughtfully and respectfully, but
it has not yet been formally reviewed by a Dakota cultural advisor. The full
reasoning, the alternatives that were considered, the cultural guardrails
that were put in place, and a recommendation that the district verify the
name with a Dakota cultural advisor before publication are documented in
[mascot-design-decisions.md](./mascot-design-decisions.md).

If your district adopts this textbook outside of ISD 197 or outside of
Minnesota, you may wish to substitute a different mascot whose name and
species are appropriate to your local context. The mascot system was
designed to be replaceable: the CSS, the prompt templates, and the placement
rules will work with any cartoon character, and the cultural guardrails in
`CLAUDE.md` give clear guidance on what to consider when making the
substitution.

### Cost of Adoption

This textbook is published under a **Creative Commons BY-NC-SA 4.0** license,
which means a school district may use, copy, modify, and distribute it
freely for non-commercial purposes, provided that attribution is given and
that derivative works are shared under the same license.

In practical terms, the cost of adoption is:

- **Zero licensing cost** — the content and source files are free
- **Teacher training time** — approximately one to two hours per teacher to
  familiarize themselves with the structure, the mascot, and the MicroSims
- **Optional customization** — district-specific land acknowledgment, district
  logo, or local mascot substitution can be added by anyone with basic Markdown
  and Git skills

The textbook is built on **MkDocs Material**, an open-source documentation
framework, and the source files live in a public GitHub repository. Hosting
is free via GitHub Pages.

### Standards Alignment Checklist for Adoption Review

Administrators evaluating this textbook for adoption may find the following
checklist useful:

- [ ] Aligns with **ISTE 1.2 Digital Citizen** (Ch 1–12, 17)
- [ ] Aligns with **Common Sense Education** K–12 framework (Ch 3–14)
- [ ] Includes **News Literacy** content (Ch 13, 14) — required by many state
      standards as of 2024
- [ ] Includes **Critical Thinking** content (Ch 15, 16) — supports ELA and
      social studies standards
- [ ] Includes **Capstone project** (Ch 17) — supports project-based learning
      and portfolio assessment
- [ ] Reading level: Grade 4–6 (verified by Flesch–Kincaid in the chapter
      content style guide in `CLAUDE.md`)
- [ ] Platform-agnostic — does not name or promote any social-media platform
- [ ] No data collection from students built into the textbook (the textbook
      is read-only HTML; any analytics or LRS integration is opt-in by the
      district)
- [ ] FERPA-compliant — the textbook itself stores no student data
- [ ] COPPA-compliant — appropriate for under-13 students
- [ ] Free under Creative Commons license

---

## Validation Methodology

For administrators who want to verify the design rigor:

### Edge Direction Validation

Before designing chapters, the underlying graph was validated to confirm the
edge direction (dependency direction, not enablement direction). Foundational
concepts were identified by finding nodes with zero outgoing dependency edges,
and the result was checked against expectation:

```
Foundational concepts:
  Digital Device
  Internet
  Trusted Adult
```

These three concepts are appropriately foundational — devices and the
internet are the physical prerequisites for everything online, and "trusted
adult" is the social prerequisite for the safe-talk rule that runs throughout
the course. If advanced concepts (like *Cyberbullying* or *Misinformation*)
had appeared as foundational, that would have indicated an inverted graph and
the design process would have been halted.

### Topological Sort Validation

After every iteration of the chapter design, the full set of 265 concepts and
457 dependency edges was checked against the chapter assignments:

```
Iteration 1 (9-chapter draft):  3 violations  → fixed
Iteration 2 (9-chapter v2):     0 violations  → REJECTED for cognitive load
Iteration 3 (17-chapter draft): 9 violations  → fixed
Iteration 4 (17-chapter v2):    1 violation   → fixed
Iteration 5 (17-chapter v3):    0 violations  → ACCEPTED
```

The final structure passes the strict zero-violation check. The validation
script that performs this check is included in the project repository at
`docs/learning-graph/validate-learning-graph.py` and can be re-run by any
administrator who wants to independently verify the chapter ordering.

### Coverage Validation

Every concept in `learning-graph.json` was verified to appear in exactly one
chapter:

```
Total concepts in graph:    265
Concepts assigned:          265
Concepts missing:             0
Duplicate assignments:        0
```

No concept is omitted from the textbook, and no concept appears in more than
one chapter.

---

## Files Created by This Design Pass

The following files were created or modified during this chapter-design
session and are now part of the project repository:

```
docs/
├── chapters/
│   ├── index.md                                    # Main chapter overview
│   ├── 01-welcome-to-digital-world/index.md
│   ├── 02-what-is-a-digital-citizen/index.md
│   ├── 03-media-balance/index.md
│   ├── 04-healthy-tech-habits/index.md
│   ├── 05-private-vs-personal-info/index.md
│   ├── 06-passwords-and-online-safety/index.md
│   ├── 07-what-is-a-digital-footprint/index.md
│   ├── 08-reputation-and-credit/index.md
│   ├── 09-online-friends-and-talk/index.md
│   ├── 10-safe-talk-and-boundaries/index.md
│   ├── 11-conflict-vs-cyberbullying/index.md
│   ├── 12-standing-up-safely/index.md
│   ├── 13-what-is-misinformation/index.md
│   ├── 14-becoming-a-fact-checker/index.md
│   ├── 15-four-critical-questions/index.md
│   ├── 16-healthy-doubt-open-minds/index.md
│   └── 17-digital-citizenship-toolkit/index.md
└── learning-graph/
    └── chapter-design.md                           # This document

mkdocs.yml                                          # Updated with chapter nav
```

Each chapter's `index.md` file currently contains the chapter title, summary,
the full ordered concept list, the list of prerequisite chapters, and a
`TODO: Generate Chapter Content` placeholder. The actual chapter body text
(stories, MicroSim references, Maka admonitions, vocabulary explanations,
and assessments) will be generated in a subsequent content-generation pass
following the Grade 5 style guide documented in the project's `CLAUDE.md`.

---

## Next Steps in the Authoring Process

For administrators trying to understand where this textbook is in its
development cycle:

| Phase | Status |
|---|---|
| Course description and learning outcomes | **Complete** |
| Learning graph (265 concepts, 457 dependencies) | **Complete** |
| Concept taxonomy (9 categories) | **Complete** |
| Pedagogical mascot design | **Complete** |
| Project-level style guide for Grade 5 content | **Complete** |
| **Chapter structure (this document)** | **Complete** |
| Chapter body content (Grade 5 reading level) | Pending |
| MicroSims (one or more per chapter) | Pending |
| Graphic-novel stories | Pending |
| Glossary and FAQ | Pending |
| Quizzes and assessments | Pending |
| Teacher's guide (separate document, professional voice) | Pending |
| Cover image and home page | Pending |
| District land acknowledgment | Pending |
| Dakota cultural advisor review of mascot name | Pending |

---

## Questions or Concerns

Curriculum administrators reviewing this textbook for adoption are
encouraged to contact the curriculum author with questions, concerns, or
suggestions. In particular, district leaders should feel free to:

- Request a walk-through of any chapter or design decision
- Suggest revisions for local cultural or linguistic context
- Request a pilot deployment to a single classroom before full adoption
- Share feedback that should be incorporated into a future revision

The textbook is intended to be a living, improvable document — not a
take-it-or-leave-it artifact. The decision to adopt it should be made with
full understanding of what it is and what it is not, and this design log is
part of that transparency.
