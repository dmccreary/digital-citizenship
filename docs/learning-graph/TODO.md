---
title: "Build TODO — Unresolved mkdocs Warnings"
description: "Actionable list of unresolved warnings from the most recent mkdocs build, grouped by type and location, for triage and cleanup."
---

# Build TODO — Unresolved mkdocs Warnings

Generated from `mkdocs build` on 2026-04-16. Each item below corresponds to a warning emitted during the site build. Work through them in any order — they are independent.

## 1. Nav / docs-directory mismatches

### 1a. File in docs but not in nav

- [ ] `docs/learning-graph/linkedin-announcement.md` exists but is not listed in `mkdocs.yml`.
  - **Fix:** either add it to the nav (likely under the learning-graph / administrator section) or, if it is intentionally unlisted, move it out of `docs/` or leave it and accept the info message.

### 1b. Nav references a missing file

- [ ] `mkdocs.yml` references `prompts/index.md`, but `docs/prompts/` has no `index.md`.
  - **Current contents of `docs/prompts/`:** `01-seed.md`, `cover-prompt.md`, `economy-mode-chapter.md`.
  - **Fix options:**
    1. Create `docs/prompts/index.md` as a landing page that links to the three existing prompt files, or
    2. Change the nav entry from `prompts/index.md` to one of the existing files (e.g. `prompts/01-seed.md`), or
    3. Remove the prompts nav entry entirely if prompts are internal-only.

## 2. Broken internal links

### 2a. Missing `teachers-guide/` directory

- [ ] `docs/chapters/index.md` links to `../teachers-guide/index.md`, but `docs/teachers-guide/` does not exist.
  - **Fix options:**
    1. Create the teachers-guide section (see `CLAUDE.md` — the teacher persona is documented and expects this path), or
    2. Remove or comment out the link from `docs/chapters/index.md` until the teachers-guide is written.

## 3. Missing story panel images

The story-generator skill expects every panel referenced in `index.md` to have a matching PNG in the story directory. The following panels are linked but not yet generated.

### 3a. `docs/stories/deshawns-group-chat/` — all 8 panels missing

Only `cover.png` and `index.md` exist. Missing panels:

- [ ] `panel-01.png`
- [ ] `panel-02.png`
- [ ] `panel-03.png`
- [ ] `panel-04.png`
- [ ] `panel-05.png`
- [ ] `panel-06.png`
- [ ] `panel-07.png`
- [ ] `panel-08.png`

**Fix:** run `generate-images.py` (or the story-generator image pass) for this story. If the story is still a stub, confirm it is wired correctly for the two-pass workflow before generating images.

### 3b. `docs/stories/mayas-art-and-the-missing-name/` — 2 panels missing

- [ ] `panel-06.png` — note: directory contains `panel-06-wrong-bubble-speaker.png` and `panel-06-wrong-person talking.png` (the latter filename also contains a space, which should be fixed). Pick the correct candidate, rename to `panel-06.png`, and delete the rejected alternate.
- [ ] `panel-07.png` — not yet generated.

### 3c. `docs/stories/noahs-quiz-trap/` — 2 panels missing

- [ ] `panel-03.png` (directory jumps from `panel-02.png` to `panel-04.png`)
- [ ] `panel-05.png` (directory jumps from `panel-04.png` to `panel-06.png`)

## Quick verification

After fixing any of the above, re-run:

```bash
mkdocs build
```

The warning count should drop by the number of items resolved. A clean build produces only the `INFO` lines for cleaning and building, with no `WARNING` lines.
