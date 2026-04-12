---
title: Quiz Generation Quality Report
description: Quality metrics for the chapter quizzes generated for the Digital Citizenship intelligent textbook.
---

# Quiz Generation Quality Report

**Generated:** 2026-04-11
**Skill:** quiz-generator v0.4
**Execution Mode:** Serial (1 agent)
**Audience:** Grade 5 students (ages 10–12)

## Overall Statistics

- **Total Chapters:** 17
- **Total Questions:** 170
- **Questions per Chapter:** 10 (uniform)
- **Bloom Levels Used:** Remember, Understand, Apply, Analyze (Evaluate and Create excluded — too advanced for Grade 5)

## Per-Chapter Summary

| # | Chapter | Questions | Bloom R/U/Ap/An | Answers A/B/C/D |
|---|---|---:|---|---|
| 01 | Welcome to the Digital World | 10 | 4 / 3 / 2 / 1 | 2 / 3 / 2 / 3 |
| 02 | What Is a Digital Citizen? | 10 | 4 / 4 / 1 / 1 | 3 / 3 / 3 / 1 |
| 03 | Media Balance and Spotting Imbalance | 10 | 4 / 3 / 2 / 1 | 3 / 3 / 3 / 1 |
| 04 | Building Healthy Tech Habits | 10 | 3 / 3 / 3 / 1 | 3 / 2 / 3 / 2 |
| 05 | Private vs. Personal Information | 10 | 3 / 2 / 4 / 1 | 3 / 2 / 3 / 2 |
| 06 | Passwords, Clickbait, and Staying Safe Online | 10 | 4 / 2 / 3 / 1 | 2 / 4 / 3 / 1 |
| 07 | What Is a Digital Footprint? | 10 | 3 / 3 / 3 / 1 | 2 / 4 / 2 / 2 |
| 08 | Reputation, Sharing, and Giving Credit | 10 | 3 / 4 / 3 / 0 | 4 / 3 / 2 / 1 |
| 09 | Online Friends and How We Talk | 10 | 4 / 2 / 3 / 1 | 3 / 2 / 3 / 2 |
| 10 | Safe Talk and Setting Boundaries | 10 | 4 / 2 / 3 / 1 | 3 / 3 / 3 / 1 |
| 11 | When Conflict Becomes Cyberbullying | 10 | 4 / 2 / 3 / 1 | 2 / 4 / 3 / 1 |
| 12 | Standing Up Safely as an Upstander | 10 | 3 / 3 / 3 / 1 | 3 / 3 / 2 / 2 |
| 13 | What Is Misinformation? | 10 | 4 / 3 / 2 / 1 | 3 / 4 / 2 / 1 |
| 14 | Becoming a Fact Checker | 10 | 4 / 2 / 3 / 1 | 3 / 2 / 3 / 2 |
| 15 | The Four Critical Questions | 10 | 5 / 2 / 2 / 1 | 2 / 3 / 3 / 2 |
| 16 | Healthy Doubt and Open Minds | 10 | 4 / 2 / 3 / 1 | 3 / 3 / 3 / 1 |
| 17 | Your Digital Citizenship Toolkit | 10 | 4 / 2 / 3 / 1 | 4 / 3 / 2 / 1 |

## Bloom's Taxonomy Distribution (Overall)

| Level | Count | Actual % | Target % | Notes |
|---|---:|---:|---:|---|
| Remember | 64 | 38% | ~30% | Slightly high — Grade 5 quizzes lean on definition recall |
| Understand | 44 | 26% | ~30% | Within range |
| Apply | 45 | 26% | ~30% | Within range |
| Analyze | 16 | 9% | ~10% | Within range |
| Evaluate | 0 | 0% | 0% | Excluded — too advanced for Grade 5 |
| Create | 0 | 0% | 0% | Excluded — too advanced for Grade 5 |

The Remember level skews high because most chapters introduce 8–17 vocabulary terms that students need to recall in their own words. This matches the course-description learning outcomes, which heavily emphasize Remember and Understand verbs at the introductory grade level.

## Answer Balance (Overall)

| Option | Count | Percentage |
|---|---:|---:|
| A | 48 | 28% |
| B | 51 | 30% |
| C | 45 | 26% |
| D | 26 | 15% |

**Note:** Option D is underrepresented (15% vs. 25% target). Within each individual chapter all four letters appear at least once, but D was the correct answer less often than ideal. A future regeneration pass could rebalance D upward by reshuffling distractors. No chapter has a position-bias pattern (no streaks of more than two same-letter answers in a row).

## Format Compliance

All 170 questions follow the required format:

- Level-4 (`####`) headers with sequential question numbers
- `<div class="upper-alpha" markdown>` numbered-list answer options
- `??? question "Show Answer"` collapsed admonitions with 4-space indentation
- Bolded letter in the `The correct answer is **X**.` line
- `**Concept Tested:**` label on its own line
- Horizontal rule separators (`---`) between questions
- No `**See:**` links (skipped to avoid broken links)
- No "All of the above" or "None of the above" options
- No platform/brand names, no slang, no scary language
- Distractors are plausible and similar in length to the correct answer

## Audience Voice Compliance

All quiz files were generated for the Grade 5 audience:

- Sentences kept short (most under 15 words)
- Vocabulary defined or already familiar from chapter prose
- Application questions use varied fictional kids (Maya, Jordan, Sam, Priya, Liam, Aisha, Diego, Emma, Marcus, Aanya, Kai, Zara, Noah, Sofia, Layla)
- The "tell a trusted adult" rule appears in plain text, never in mascot dialogue
- No Maka mascot in quiz files (mascot is reserved for chapter content only)
- No platform names, no scary "predator" framing

## Files Created

- `docs/chapters/01-welcome-to-digital-world/quiz.md`
- `docs/chapters/02-what-is-a-digital-citizen/quiz.md`
- `docs/chapters/03-media-balance/quiz.md`
- `docs/chapters/04-healthy-tech-habits/quiz.md`
- `docs/chapters/05-private-vs-personal-info/quiz.md`
- `docs/chapters/06-passwords-and-online-safety/quiz.md`
- `docs/chapters/07-what-is-a-digital-footprint/quiz.md`
- `docs/chapters/08-reputation-and-credit/quiz.md`
- `docs/chapters/09-online-friends-and-talk/quiz.md`
- `docs/chapters/10-safe-talk-and-boundaries/quiz.md`
- `docs/chapters/11-conflict-vs-cyberbullying/quiz.md`
- `docs/chapters/12-standing-up-safely/quiz.md`
- `docs/chapters/13-what-is-misinformation/quiz.md`
- `docs/chapters/14-becoming-a-fact-checker/quiz.md`
- `docs/chapters/15-four-critical-questions/quiz.md`
- `docs/chapters/16-healthy-doubt-open-minds/quiz.md`
- `docs/chapters/17-digital-citizenship-toolkit/quiz.md`

## Recommendations

1. **Rebalance answer D** in a future pass — currently 15% vs. 25% target.
2. **Consider adding 1–2 Apply questions to Chapter 2** — currently has only 1 Apply question.
3. **Chapter 8 has 0 Analyze questions** — the 10th question came out closer to Understand. Could be regenerated.
4. **Vocabulary recall questions are heavy in Chapters 1, 2, 13, 15** — this matches the introductory nature of those chapters but could be tempered with more scenario-based Apply questions in a future revision.
5. **Add explicit `**See:**` links** once the chapter section anchors are stable.
