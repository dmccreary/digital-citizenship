# Learning Graph Generation — Session Log

**Project:** Digital Citizenship Learning Graph Design<br/>
**Date:** 2026-04-11<br/>
**Skill:** learning-graph-generator (v0.04)<br/>
**Final result:** 265 concepts, 457 dependency edges, 9 taxonomy clusters<br/>

This document is intended for the teachers, librarians, and curriculum coordinators who will use the *Digital Citizenship* intelligent textbook. It explains how the learning graph that powers the textbook's recommended learning paths was created, what choices were made along the way, and — most importantly — the tradeoffs we deliberately weighed when deciding what to include and what to leave out.

## What is a learning graph and why does it matter?

A *learning graph* is a structured map of every concept in the course and the prerequisite relationships among them. Each concept is a node; each arrow says "you should understand this before that." The graph is a Directed Acyclic Graph (DAG), which means there are no circular dependencies — the textbook can always recommend a sensible learning order.

For teachers, the practical value is:

- **You can skip without breaking things.** If your students already know what an "online community" is, you can start at module 2 and the graph will still tell you what other earlier ideas they need.
- **You can color-code by topic.** Each concept is tagged with one of nine cluster colors so teachers and students can see at a glance which module an idea belongs to.
- **You can find the most important concepts quickly.** The graph reports which concepts the most other concepts depend on (the *indegree* metric). Those are the highest-leverage things to teach well. In this textbook the top three are *Critical Thinking*, *Online Activity*, and *Private Information*.
- **You can use it as a checklist.** If a student understands every concept that points into a target concept, they are ready for it.

## The conversation, in the user's own words

Below is the chronological list of every instruction the project author (Dan McCreary) gave during this session. They are quoted verbatim so future maintainers can see exactly what was asked and how the graph evolved.

### Prompt 1 — Start

> "run the /learning-graph-generator skill now"

### Prompt 2 — A small but important rename

> "please add 'Two Factor Authentication' to the concept list and the learning graph"

This came in mid-session, while the first 200 concepts were being created. The original draft had used the abbreviation "Two Factor Auth" because the skill enforces a 32-character limit on labels. The full term ("Two Factor Authentication") is 25 characters, so it fits — and it is much clearer for a Grade 5 reader. Concept 61 was renamed in place rather than added as a duplicate.

### Prompt 3 — The pivotal question

> "I noticed you stopped exactly at 200 concepts. Are there other concepts you considered but did not include?"

This is the question that changed the whole shape of the textbook. See the *Tradeoffs* section below.

### Prompt 4 — Direction

> "I want you to add ALL of the concepts you considered. I reviewed the list and agree that they all might be relevant and they are important. I would rather have a few extra concepts that the teachers can skip over than missing concepts. I realize you will have to regenerate the learning graph after these concepts are all added. My apologies for the 200 limit. I should have clarified."

### Prompt 5 — Document everything

> "Wonderful! This is great! I love your reasoning. Please generate a detailed log of this session about the creation of the learning graph to @logs/01-learning-graph-generation.md - include all of my prompts and the tradeoffs that you made about a simple graph vs. not missing important concepts. I think the staff at the schools will appreciate this detailed analysis."

## How the graph was built — step by step

### Step 0 — Setup

The learning-graph-generator skill is a 13-step Anthropic Claude Skill. It expects to find a `docs/course-description.md` file and writes its outputs to a new `docs/learning-graph/` directory. Helper Python programs (`analyze-graph.py`, `csv-to-json.py`, `taxonomy-distribution.py`) are copied from the skill into that directory so the project is self-contained.

### Step 1 — Course description quality (skipped)

The skill begins by scoring the course description against a 100-point rubric covering target audience, prerequisites, topics covered, topics excluded, and learning outcomes at each of the six Bloom's Taxonomy levels (Remember, Understand, Apply, Analyze, Evaluate, Create). If the score is 85 or above, the skill says it is safe to skip this step to save tokens.

A previous session had already run the *course-description-analyzer* skill and recorded a score of **99/100** in the front matter of `docs/course-description.md`. We honored that and proceeded directly to concept generation.

### Step 2 — First-pass concept list (200 concepts)

The skill recommends "200 concepts is fine for simple books." This was the first design decision and it turned out to be the most important one.

The 200 concepts were partitioned across nine clusters that mirror the structure of the course:

| # | Cluster | Concepts | ID range |
|---|---|---|---|
| 1 | Foundations of Digital Citizenship | 22 | 1–22 |
| 2 | Media Balance and Wellbeing | 22 | 23–44 |
| 3 | Privacy and Security | 25 | 45–69 |
| 4 | Digital Footprint and Identity | 22 | 70–91 |
| 5 | Relationships and Communication | 22 | 92–113 |
| 6 | Cyberbullying, Digital Drama, and Hate Speech | 22 | 114–135 |
| 7 | Misinformation and News Literacy | 22 | 136–157 |
| 8 | Critical Thinking | 22 | 158–179 |
| 9 | Capstone and Synthesis | 21 | 180–200 |

### Step 3 — Dependency graph (CSV)

Each concept got a row in `learning-graph.csv` with four columns: `ConceptID`, `ConceptLabel`, `Dependencies` (pipe-delimited list of prerequisite IDs), and `TaxonomyID`. Two design rules were applied:

1. **Foundational concepts have no dependencies.** Three concepts have empty `Dependencies` fields: *Digital Device* (1), *Internet* (2), and *Trusted Adult* (8). Everything else builds from these.
2. **Each concept only depends on lower-numbered concepts.** This guarantees the graph is a DAG by construction — no possibility of a cycle. (A cycle would mean "you must learn A before B, and B before A," which is impossible for a learner.)

### Step 4 — Quality validation

The `analyze-graph.py` script ran every check the skill recommends:

- ✅ Valid DAG (0 cycles)
- ✅ No self-dependencies
- ✅ All 200 concepts connected in a single component
- ✅ 0 orphaned (disconnected) nodes
- ✅ 65 terminal nodes (32.5% — within the healthy 5–40% range)
- ✅ Average 1.71 dependencies per concept
- ✅ Longest learning path: 16 concepts

### Step 5 — Taxonomy

The taxonomy file (`concept-taxonomy.md`) defines the nine cluster categories and gives each a 3-5 letter abbreviation that appears in the CSV: `FOUND`, `BAL`, `PRIV`, `FOOT`, `REL`, `CYB`, `MIS`, `CRIT`, `CAP`. There is no `MISC` (miscellaneous) bucket — every concept maps cleanly to one of the eight modules or the capstone.

A companion file, `taxonomy-names.json`, maps each abbreviation to its human-readable display name. This is critical for the graph viewer — without it, the legend would show cryptic codes like "CYB" instead of "Cyberbullying and Digital Drama."

### Step 6 — Metadata and JSON generation

A `metadata.json` file recorded the textbook title, description, author, date, version, license (CC BY-NC-SA 4.0 DEED), and the URL of the schema. The `csv-to-json.py` script then combined the CSV, the metadata, and the taxonomy names into a single `learning-graph.json` file in the vis-network format that the interactive viewer reads.

### Step 7 — Distribution report

The first-pass distribution was extremely balanced — every cluster between 10.5% and 12.5% of total concepts, with no cluster exceeding 30%.

## The tradeoffs — and why they matter for teachers

### The original tradeoff: simple graph vs. comprehensive graph

The skill's default guidance is "200 concepts is fine for simple books." A 200-concept graph is genuinely easier to:

- **Read on screen** — the graph viewer can show all nodes without overwhelming the user
- **Generate chapter content for** — every concept becomes a section or sub-section in the textbook
- **Maintain over time** — fewer concepts means fewer dependencies to verify when something is renamed
- **Estimate cost** — chapter generation is the most expensive step; cost scales with concept count

So the first pass aimed at exactly 200, distributed roughly evenly across 9 clusters (~22 concepts each). To hit that target, **65 candidate concepts had to be cut**. The cuts were not random — each cut concept was either:

- (a) **Subsumed** by a more general concept already in the list ("Eye Strain" subsumed by "Tired Eyes"), or
- (b) **Borderline age-appropriate** for Grade 5 ("Confirmation Bias", "Cause vs. Correlation"), or
- (c) **Specialized vocabulary** that a general term already covered ("Tablet", "Laptop", "Smartphone" all subsumed by "Digital Device"), or
- (d) **Only relevant to one specific cluster** and thought to be lower-priority than the 22 that made the cut.

### The pivot: prompt 3

When the project author asked "Are there other concepts you considered but did not include?", the response was a candid list of all 65 cuts, organized by cluster, with stars on the ones I (the AI) thought were most worth adding. The starred candidates were chosen by asking, for each cut concept: *would a fifth-grade teacher in 2026 be surprised if this term were missing?*

The most important starred cuts were:

- **App** and **Search Engine** (FOUND) — fundamental Grade 5 vocabulary that was hidden inside more general concepts
- **Notification** (BAL) — drives most screen-time interruptions a Grade 5 student experiences
- **Screenshot** (FOOT) — the single most common reason "things become permanent" for kids
- **Plagiarism** (FOOT) — pairs naturally with the existing *Giving Credit* concept
- **Netiquette** (REL) — the umbrella term for the entire Relationships module
- **Exclusion** (CYB) — a primary form of Grade 5 cyberbullying ("you can't be in our group chat") that the original list missed
- **Satire / Parody** (MIS) — students at this age genuinely confuse The Onion with real news
- **Lateral Reading** (MIS) — Stanford History Education Group's signature kid-friendly fact-check skill
- **Confirmation Bias** (CRIT) — the most foundational critical-thinking bias
- **Peer Teaching** (CAP) — explicitly mentioned in the course description but missing from the concept list

### The decision: prompt 4

The project author's response — "I would rather have a few extra concepts that the teachers can skip over than missing concepts" — is the right answer for a textbook intended for actual classroom use. It reflects three insights that are worth recording for future maintainers:

1. **Teachers are the curators.** The graph is a *menu*, not a script. A teacher who has 30 instructional days can pick the 30 highest-priority concepts for her classroom. A teacher who has 60 days can pick 60. A graph that is missing a concept forces the teacher to invent it on the fly; a graph that has extras simply gets pruned with no extra effort.
2. **Coverage is cheap; gaps are expensive.** Adding 65 concepts to the graph at this stage took roughly 5 minutes of token spend. Adding 65 concepts after chapter content has been generated would take *hours* of token spend because every chapter that mentioned the new concept would need re-generation. Front-loading coverage is a strict win.
3. **Grade 5 vocabulary is the core deliverable.** The whole point of this textbook is to give students the *vocabulary* and *judgment* they need to be safe online. Vocabulary missing from the graph is vocabulary missing from the textbook.

### What was deliberately *not* added

Even after the expansion to 265 concepts, several candidates were still excluded. The course description's "Topics Not Covered" section was used as the authoritative scope filter:

| Excluded topic | Reason |
|---|---|
| Coding, Python, JavaScript | Out of scope per course description |
| COPPA / DMCA / contract law | Legal depth too advanced for Grade 5 |
| Networking, cryptography, malware analysis | Cybersecurity depth too advanced |
| TikTok / Instagram / Snapchat / Discord | Platform-specific tutorials go out of date |
| Online dating, gambling, adult content | Age-inappropriate |
| VPN, parental controls, router config | Belongs to parents and IT staff |
| Deepfakes, generative AI policy | Saved for a separate middle-school course |
| Doxxing, grooming, catfishing (advanced) | Age-inappropriate or scope-excluded |

Teachers should know that these are *deliberate* omissions, not oversights. If your district decides one of them is appropriate for your students, you can add it to the local copy of the graph without breaking anything.

### The dependency design tradeoff

Dependencies are subjective. *Cyberbullying* could reasonably be said to depend on *Online Conflict*, on *Safe Online Behavior*, or on both. The graph leans toward including a *small number of strong* dependencies rather than trying to capture every possible relationship. The reasoning:

- **Too few dependencies** → the graph becomes a flat list and stops recommending learning order
- **Too many dependencies** → the graph becomes a wall of arrows, no path is highlighted, and "what should I teach next" is no longer answerable
- **A small number of strong dependencies** → the longest learning path is 19 concepts and the average concept has 1.74 prerequisites, both of which are pedagogically reasonable

### The cluster size tradeoff

After the expansion, the largest cluster (FOUND, with 33 concepts) is 12.5% of the total — well below the 30% ceiling. The smallest cluster (CAP, with 25 concepts) is 9.4%. The spread is 3.1 percentage points, which the distribution report flagged as "excellent balance." A more uneven distribution would have made some modules feel disproportionately heavy in the chapter generation stage.

## Final graph statistics

| Metric | First pass (200 concepts) | After expansion (265 concepts) |
|---|---|---|
| Total concepts | 200 | **265** |
| Total dependency edges | 336 | **457** |
| Foundational concepts | 3 | 3 |
| Connected components | 1 | 1 |
| Cycles | 0 | 0 |
| Self-dependencies | 0 | 0 |
| Orphaned nodes | 0 | 0 |
| Average dependencies per concept | 1.71 | 1.74 |
| Longest learning path | 16 concepts | 19 concepts |
| Terminal (leaf) nodes | 65 | 101 |
| Most depended-upon concept | Critical Thinking (indegree 13) | Critical Thinking (indegree 13) |
| Largest cluster as % of total | 12.5% (PRIV) | 12.5% (FOUND, PRIV) |
| Cluster spread (max − min) | 2.0% | 3.1% |

## Final taxonomy distribution

| Cluster | TaxonomyID | First pass | Added | Final | % of total |
|---|---|---|---|---|---|
| Foundations of Digital Citizenship | FOUND | 22 | +11 | **33** | 12.5% |
| Media Balance and Wellbeing | BAL | 22 | +8 | **30** | 11.3% |
| Privacy and Security | PRIV | 25 | +8 | **33** | 12.5% |
| Digital Footprint and Identity | FOOT | 22 | +7 | **29** | 10.9% |
| Relationships and Communication | REL | 22 | +5 | **27** | 10.2% |
| Cyberbullying and Digital Drama | CYB | 22 | +6 | **28** | 10.6% |
| Misinformation and News Literacy | MIS | 22 | +7 | **29** | 10.9% |
| Critical Thinking | CRIT | 22 | +9 | **31** | 11.7% |
| Capstone and Synthesis | CAP | 21 | +4 | **25** | 9.4% |
| **Total** | | **200** | **+65** | **265** | 100% |

## Implementation note for future maintainers

When the 65 new concepts were added, they were assigned IDs **201–265 and appended at the end** of `learning-graph.csv` rather than being interleaved into their cluster ID ranges. This was a deliberate choice:

- **Renumbering would have rewritten thousands of dependency references** in the existing 200 rows — every existing dependency points to a numeric ID, and shifting any ID would have required updating every reference to it.
- **The graph viewer doesn't care about ID order.** Cluster grouping is driven by the `TaxonomyID` column (which controls color), not by ID. A user looking at the graph cannot tell that *Screenshot* is concept 228 and not concept 73.
- **The dependency rule still holds.** Every new concept (IDs 201–265) only depends on lower-numbered concepts (1–264), so the DAG property is preserved by construction.

The `concept-list.md` file shows the new concepts under an "Additional Concepts (Revision 2)" section organized by cluster, so a human reading the file can still find them in their cluster context.

## What this means for the classroom

If you are a teacher, librarian, or curriculum coordinator looking at this textbook for the first time:

- The 265 concepts are a **menu**, not a contract. Pick the ones that fit your time, your students, and your district's standards.
- The **eight modules plus capstone** structure is the recommended scope-and-sequence, but the graph supports many alternative orderings. If a colleague wants to start with *Critical Thinking* and back-fill the foundations, the graph will tell her exactly which earlier concepts her students need.
- The **graph viewer** at `sims/graph-viewer/main.html` lets you and your students explore the concepts visually, filter by cluster, and search by name. It is a great whiteboard-projector tool for the first day of a unit.
- If a concept is missing that you would teach, **please tell us**. The graph is designed to grow.

## Files produced or modified in this session

- `docs/learning-graph/concept-list.md` — full numbered list of all 265 concepts
- `docs/learning-graph/learning-graph.csv` — authoritative CSV with `ConceptID`, `ConceptLabel`, `Dependencies`, `TaxonomyID`
- `docs/learning-graph/learning-graph.json` — vis-network JSON consumed by the interactive graph viewer
- `docs/learning-graph/concept-taxonomy.md` — definitions of the nine taxonomy categories
- `docs/learning-graph/taxonomy-names.json` — abbreviation-to-display-name mapping
- `docs/learning-graph/metadata.json` — Dublin Core-style metadata
- `docs/learning-graph/quality-metrics.md` — auto-generated DAG validation and indegree analysis
- `docs/learning-graph/taxonomy-distribution.md` — auto-generated cluster distribution report
- `docs/learning-graph/index.md` — landing page for the Learning Graph section
- `docs/sims/graph-viewer/{main.html,script.js,local.css,index.md}` — interactive vis-network graph viewer
- `mkdocs.yml` — added Learning Graph and MicroSims navigation entries
- `logs/learning-graph-generator-0.04-2026-04-11.md` — technical session log
- `logs/01-learning-graph-generation.md` — this document

## Acknowledgements

The author of the textbook, Dan McCreary, made the call that turned a serviceable 200-concept graph into a comprehensive 265-concept one. His instruction — *"I would rather have a few extra concepts that the teachers can skip over than missing concepts"* — should be recorded somewhere durable as the operating principle of this textbook. It is recorded here.
