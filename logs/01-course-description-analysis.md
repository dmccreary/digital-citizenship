# Course Description Analysis — Digital Citizenship

**Skill:** Course Description Analyzer (v0.03)
**Date:** 2026-04-11
**Source File:** `docs/course-description.md`

## Overall Score: 99 / 100

**Quality Rating:** Excellent — Ready for learning graph generation.

## Detailed Scoring Breakdown

| Element | Earned | Possible | Notes |
|---|---|---|---|
| Title | 5 | 5 | "Digital Citizenship: Building Safe, Kind, and Balanced Lives Online" — clear and descriptive. |
| Target Audience | 5 | 5 | Grade 5 and 6 students (ages 10–12), plus teachers, tech coaches, librarians, and parents. Reading-level constraints stated. |
| Prerequisites | 5 | 5 | Explicitly listed: mouse skills, basic keyboarding (copy/paste), basic reading, basic web-browser use. No coding assumed. |
| Main Topics Covered | 9 | 10 | Six numbered modules are well described and ISTE-tagged. The two newly added subject areas — *Detecting Misinformation* and *Critical Thinking* — appear in the Common Sense Education alignment list and in the learning outcomes, but are not yet broken out as their own numbered modules. See gap analysis below. |
| Topics Excluded | 5 | 5 | Strong "Topics Not Covered" section sets clear boundaries (no coding, no DMCA/COPPA depth, no platform tutorials, no AI/deepfake policy, etc.). |
| Learning Outcomes Header | 5 | 5 | "After completing this course, Grade 5 students will be able to:" present. |
| Remember Level | 10 | 10 | 9 specific, action-verb outcomes (define, list, recall, identify, name). Coverage of vocabulary, ISTE indicators, fact-check steps, and the four critical-thinking questions. |
| Understand Level | 10 | 10 | 9 outcomes (explain, classify, compare, summarize, describe). Misinformation vs. disinformation now covered. |
| Apply Level | 10 | 10 | 9 outcomes (use, demonstrate, apply, practice, create). Includes the fact-check checklist and the *slow down before you share* habit. |
| Analyze Level | 10 | 10 | 8 outcomes (analyze, distinguish, examine, compare, break down). Includes source comparison and viral-content red-flag analysis. |
| Evaluate Level | 10 | 10 | 8 outcomes (judge, assess, critique, justify, evaluate). Trustworthiness judgment and peer fact-check critique included. |
| Create Level | 10 | 10 | 8 outcomes including a strong capstone (Digital Citizenship Toolkit) that integrates habit tracker, pledge, upstander scripts, fact-check card, and critical-thinking questions. |
| Descriptive Context | 5 | 5 | "Why This Course Matters" section explains relevance, urgency (the Grade 5 digital threshold), and instructional approach. |
| **Total** | **99** | **100** | |

## Gap Analysis

**Single deduction (–1 point) — Module structure has not caught up with the two new subject areas.**

The user added *Detecting Misinformation* and *Critical Thinking* to the Common Sense Education alignment list, and the learning outcomes have been updated to cover both topics across all six Bloom levels. However, the numbered "Main Topics Covered" section still describes only six modules (Foundations, Media Balance, Privacy & Security, Digital Footprint, Relationships, Cyberbullying). A reader scanning the module list would not see "Detecting Misinformation" or "Critical Thinking" as first-class units.

**Why it matters for learning graph generation:**
- The 200-concept learning graph will be partitioned by module. If misinformation and critical thinking are not promoted to numbered modules, those concepts may be scattered or under-represented.
- The current text says "The six course modules explicitly address ISTE indicators..." — that count will need to change to seven or eight if the new areas become their own modules.

## Improvement Suggestions (priority-ordered)

1. **Promote the two new subject areas to numbered modules.** Add them as Module 7 (News & Media Literacy / Detecting Misinformation) and Module 8 (Critical Thinking) in the "Main Topics Covered" section, each with a 2–3 sentence description, an anchor MicroSim or activity, and an ISTE indicator tag (likely 1.2.2b for both). Update "The six course modules..." to "The eight course modules..."
2. **Clarify whether *News & Media Literacy* and *Detecting Misinformation* are one module or two.** The Common Sense Education list includes both. Consider merging them (e.g., "News & Media Literacy: Detecting Misinformation") to keep the module count manageable.
3. **Add anchor MicroSims for the new modules** in the same way the existing modules name flagship sims (Digital Habit Tracker, Digital Trails, etc.). Candidates: a *Headline Fact-Checker*, a *Source Trust Meter*, a *Spot the Red Flag* viral-post sim, a *Four Questions* critical-thinking workflow.
4. **Optional:** add 1–2 *Topics Not Covered* boundary statements specific to misinformation (e.g., "no political fact-checking of real living public figures," "no deepfake detection technology") to keep scope age-appropriate.

## Concept Generation Readiness

**Verdict: Ready.** The course description easily supports a 200-concept learning graph.

- **Topic breadth:** 6 strong modules + 2 emerging modules = 8 topical clusters. At ~25 concepts per cluster, that yields ~200 concepts naturally.
- **Bloom coverage:** All six levels have 8–9 specific, action-verb outcomes — each outcome typically spawns 3–5 learnable concepts.
- **Vocabulary density:** The description introduces ~25 named terms (digital citizenship, digital footprint, upstander, clickbait, media balance, private vs. personal information, fact-check, misinformation, disinformation, evidence, source, the four critical-thinking questions, etc.) — each becomes a concept node.
- **Anchor activities:** Named MicroSims and the capstone toolkit give the graph concrete project-based concepts to attach to.

The minor gap above (modules vs. new subject areas) does **not** block learning graph generation — it just means the graph generator should be told explicitly to treat misinformation and critical thinking as first-class clusters even though the numbered list lags behind.

## Next Steps

1. (Recommended) Apply suggestion #1 above to promote the two new subject areas to numbered modules. This is a 5-minute edit and would push the score to 100/100.
2. Proceed to the `learning-graph-generator` skill to produce the 200-concept learning graph.
3. Update `docs/course-description.md` metadata with `quality_score: 99` (done as part of this task).
