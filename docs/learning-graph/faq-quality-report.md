---
title: FAQ Quality Report
description: Quality metrics, Bloom's distribution, and recommendations for the Digital Citizenship FAQ.
generated_by: claude skill faq-generator
date: 2026-04-11
---

# FAQ Quality Report

Generated: 2026-04-11

## Overall Statistics

- **Total Questions:** 91
- **Overall Quality Score:** 68/100
- **Content Completeness Score:** 92/100 (excellent — full course description, complete glossary, 17 chapters, 265-concept learning graph)
- **Concept Coverage:** 54% (143 / 265 concepts)
- **Categories:** 6
- **Average Answer Word Count:** 83 words

## Category Breakdown

| Category | Questions | Avg Bloom | Notes |
|---|---|---|---|
| Getting Started | 12 | Remember / Understand | Course intro, audience, schedule, mascot |
| Core Concepts | 27 | Understand | All eight subject modules represented |
| Technical Details | 20 | Remember / Understand | Vocabulary, browser & device terms |
| Common Challenges | 12 | Apply | "What if…" scenarios, troubleshooting |
| Best Practices | 12 | Apply | "How do I…" how-to questions |
| Advanced Topics | 8 | Analyze / Evaluate / Create | Footprint, algorithms, bias, toolkit |

## Bloom's Taxonomy Distribution

Aggregate target derived from per-category targets in the skill spec.

| Level | Actual | Target | Deviation |
|---|---|---|---|
| Remember | 31% (28) | 21% | +10 |
| Understand | 33% (30) | 32% | +1 |
| Apply | 31% (28) | 25% | +6 |
| Analyze | 4% (4) | 14% | -10 |
| Evaluate | 0% (0) | 4% | -4 |
| Create | 1% (1) | 3% | -2 |
| **Total deviation** | | | **~32%** |

**Bloom Score: 10/25** — total deviation just above 30%. The FAQ format leans toward Remember / Understand / Apply because students typically search FAQs for definitions and how-to answers. The shortage is in Analyze / Evaluate / Create, which would require comparison-style and design-style questions. See recommendations below.

## Answer Quality Analysis

| Metric | Actual | Target | Score |
|---|---|---|---|
| Answers with examples / scenarios | 56 / 91 (62%) | ≥40% | 7 / 7 |
| Answers with source links | 85 / 91 (93%) | ≥60% | 7 / 7 |
| Average word count | 83 | 100–300 | 4 / 6 |
| Complete answers | 91 / 91 (100%) | 100% | 5 / 5 |
| **Answer Quality Score** | | | **23 / 25** |

The average answer is slightly below the 100-word floor. Many answers are concise on purpose (Grade 5 readability), but Core Concept and Advanced Topic answers could be expanded with one or two more sentences of context.

## Concept Coverage

- **Total concepts in learning graph:** 265
- **Concepts referenced in FAQ:** 143
- **Coverage:** 54%
- **Coverage Score:** 15 / 30

Coverage is moderate. The FAQ touches every cluster in the learning graph but skips many fine-grained capstone artifacts (e.g., *Personal Pledge*, *Reflection Journal*, *Buddy Class Sharing*) that are pedagogical activities rather than answerable questions, plus a number of granular vocabulary terms that students are unlikely to search for by name.

A separate document, [FAQ Coverage Gaps](faq-coverage-gaps.md), lists the uncovered concepts grouped by priority.

## Organization Quality

| Check | Result |
|---|---|
| Logical categorization | Pass |
| Progressive difficulty (basic → advanced) | Pass |
| No duplicate questions | Pass |
| Clear, searchable question phrasing | Pass |
| **Organization Score** | **20 / 20** |

## Link Validation

- **Total internal links:** 96
- **Anchor links (`#fragment`):** 0 (compliant — hard rule satisfied)
- **Broken links:** 0
- **Unique chapter targets linked:** 17 of 17 chapters

## Overall Quality Score: 68 / 100

| Component | Earned | Possible |
|---|---|---|
| Coverage | 15 | 30 |
| Bloom's Distribution | 10 | 25 |
| Answer Quality | 23 | 25 |
| Organization | 20 | 20 |
| **Total** | **68** | **100** |

The overall score is below the 75-point success threshold. The two pull-down factors are (1) moderate concept coverage and (2) Bloom's distribution that under-represents Analyze / Evaluate / Create. Both are improvable; see recommendations.

## Recommendations

### High Priority

1. **Add 6–8 Analyze-level questions** comparing pairs of related concepts. Examples:
    - "What is the relationship between data tracking and clickbait?"
    - "How are cyberbullying and ordinary online conflict different?"
    - "Why does a trusted source matter more than a viral post?"
2. **Add 3–4 Evaluate-level questions** that ask students to make a judgment:
    - "Which is the best way to respond to a mean comment?"
    - "When should I block someone vs. report someone?"
3. **Add 2–3 Create-level questions** about producing original work:
    - "How would I design a Family Media Plan that fits my home?"
    - "How would I write my own Personal Pledge?"
4. **Lengthen the shortest answers** (below 80 words) by one or two sentences of context, especially in the Core Concepts and Advanced Topics sections, to reach the 100-word minimum target.

### Medium Priority

1. **Add questions for high-value uncovered concepts** (see [FAQ Coverage Gaps](faq-coverage-gaps.md)):
    - Two-Factor Authentication
    - Phishing Basics
    - Block / Report / Mute Features
    - Targeted Ad
    - Edited Image
    - Stranger Online
    - Healthy Habits
2. **Cross-link more answers to multiple chapters** when a concept spans modules (e.g., privacy concepts that recur in Chapters 5, 6, and 7).

### Low Priority

1. Consider adding a Bloom-level field directly to chapter content for cross-validation.
2. Consider an "FAQ search index" for fuzzy keyword search in the chatbot data.
3. Re-run this report after Round 2 of FAQ additions to track score improvement.

## Suggested Additional Questions

Based on coverage gaps and Bloom shortfalls, consider adding these in a follow-up pass:

**Core Concepts (gap fillers):**

1. What is two-factor authentication, and why does it matter?
2. What is phishing, and how do I spot it?
3. What is the difference between blocking, muting, and reporting?
4. What is a targeted ad, and how does it know about me?
5. What is a stranger online, and why is the rule different from a stranger in real life?

**Analyze / Evaluate / Create boosters:**

1. How is cyberbullying different from a one-time online conflict? *(Analyze)*
2. Why does a viral post deserve more skepticism than a normal post? *(Analyze)*
3. Which is more important — strong passwords or two-factor authentication? *(Evaluate)*
4. When is it okay to ignore a mean comment, and when should I report it? *(Evaluate)*
5. How would I design a Personal Pledge for my own family? *(Create)*
6. How would I plan a one-week Digital Habit Tracker for myself? *(Create)*

## Notes

- The FAQ deliberately follows the Grade 5 voice rules from `CLAUDE.md`: short sentences, no slang, no platform names, no scary language, and no Maka admonitions (Maka is for chapter content only).
- All links point to chapter or page files only — zero anchor fragments — to satisfy the hard rule about anchor link fragility.
- Source data: `docs/course-description.md`, `docs/learning-graph/concept-list.md`, `docs/glossary.md`, and all 17 chapter `index.md` files (~50,000 words of source content).
