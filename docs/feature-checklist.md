# Intelligent Textbook Feature Checklist

This checklist helps authors and product managers understand what features are available in the MkDocs Material intelligent textbook ecosystem. For each feature, you'll see whether it's implemented in this book and how much effort it takes to add.

!!! note
    A level 2+ textbook is one that has rich interactivity but does not store any
    personal student data. A level 2+ textbook can be converted to a level 3
    textbook by sending event data to a learning record store (LRS) to create
    a hyper-personalized learning experience for each student. The five levels
    of intelligent textbooks are described in the [Intelligent Textbooks](https://dmccreary.github.io/intelligent-textbooks/) course.

An **intelligent textbook** goes beyond static text to include interactive simulations, personalized learning paths, auto-graded quizzes, and AI-generated content. This checklist tracks which of these capabilities are present in this textbook.

**Legend:**

- :white_check_mark: Feature is implemented and working
- :x: Feature is not yet implemented
- :construction: Feature is partially implemented

## Effort Levels

| Level | Description | Human Time | With GenAI | With GenAI Skills |
|-------|-------------|------------|------------|-------------------|
| **Trivial** | Config change or copy template | Minutes | Seconds | Seconds |
| **Low** | Single file creation with standard content | Hours | Minutes | Seconds |
| **Medium** | Multiple files, some customization needed | Day | Hours | Minutes |
| **High** | Significant content generation or custom code | Days | Hours | Minutes |
| **Very High** | Complex integration, AI generation, or external tools | Week+ | Day | Hours |

---

## Basic Features

These features come by default with MkDocs Material or require minimal configuration.

| Feature | Status | Effort | Notes |
|---------|--------|--------|-------|
| Navigation sidebar | :white_check_mark: | Trivial | Left-side menu showing all chapters and sections |
| Search functionality | :white_check_mark: | Trivial | Instant search across all pages as you type |
| Table of contents (per page) | :white_check_mark: | Trivial | Right-side outline of headings on current page |
| Site title and description | :white_check_mark: | Trivial | `site_name` and `site_description` configured |
| Site author metadata | :white_check_mark: | Trivial | `site_author: Dan McCreary` |
| GitHub repository link | :white_check_mark: | Trivial | `repo_url` points to GitHub |
| Custom logo | :white_check_mark: | Trivial | Maka mascot logo (`img/mascot/neutral.png`) |
| Custom favicon | :white_check_mark: | Trivial | Maka favicon (`img/mascot/favicon.png`) |
| Color theme (primary/accent) | :white_check_mark: | Trivial | River-blue custom primary (#2e6f8e), amber accent |
| Footer navigation (prev/next) | :white_check_mark: | Trivial | `navigation.footer` enabled |
| Navigation expand on hover | :white_check_mark: | Trivial | `navigation.expand` enabled |
| Back to top button | :white_check_mark: | Trivial | `navigation.top` enabled |
| Navigation path breadcrumbs | :white_check_mark: | Trivial | `navigation.path` enabled |
| Section index pages | :white_check_mark: | Trivial | `navigation.indexes` enabled |
| License page | :white_check_mark: | Low | CC BY-NC-SA 4.0 |
| Contact page | :white_check_mark: | Low | Contact information |
| About page | :white_check_mark: | Low | About this book |
| How We Built This Site | :x: | Medium | Describe tools and process |
| Copyright on every footer | :white_check_mark: | Trivial | `copyright` configured in mkdocs.yml |

---

## Intermediate Features

These features require plugins, extensions, or moderate configuration.

### Content Enhancement

These features make your content more engaging and easier to read.

| Feature | Status | Effort | Notes |
|---------|--------|--------|-------|
| GLightBox (image zoom) | :x: | Low | Click any image for lightbox popup; requires `mkdocs-glightbox` Python library |
| MathJax equation rendering | :white_check_mark: | Low | `pymdownx.arithmatex` + MathJax 3 via CDN |
| Admonitions (callout boxes) | :white_check_mark: | Trivial | `admonition` extension enabled; used extensively for mascot boxes |
| Code blocks with copy button | :white_check_mark: | Trivial | `content.code.copy` enabled |
| Syntax highlighting with line numbers | :white_check_mark: | Trivial | `pymdownx.highlight` with `linenums: true` |
| Tabbed content blocks | :x: | Trivial | Add `pymdownx.tabbed` to extensions |
| Task list checkboxes | :x: | Trivial | Add `pymdownx.tasklist` to extensions |
| Mark/highlight text | :x: | Trivial | Add `pymdownx.mark` to extensions |
| Strikethrough text | :x: | Trivial | Add `pymdownx.tilde` to extensions |
| Magic links (auto-linking) | :x: | Trivial | Add `pymdownx.magiclink` to extensions |
| Snippets (file includes) | :x: | Trivial | Add `pymdownx.snippets` to extensions |
| Emoji support | :white_check_mark: | Trivial | `pymdownx.emoji` with twemoji |
| Collapsible details blocks | :white_check_mark: | Trivial | `pymdownx.details` enabled; used for quiz answers |
| Mermaid diagrams | :white_check_mark: | Trivial | `pymdownx.superfences` enabled |
| Footnotes | :white_check_mark: | Trivial | `footnotes` extension enabled |
| HTML in markdown | :white_check_mark: | Trivial | `md_in_html` enabled; used for quiz upper-alpha divs |
| Attribute lists | :white_check_mark: | Trivial | `attr_list` enabled |

### Site-Wide Resources

These are pages and files that support the entire textbook rather than individual chapters.

| Feature | Status | Effort | Notes |
|---------|--------|--------|-------|
| Glossary | :white_check_mark: | Medium | 267 terms with ISO 11179 compliant definitions |
| FAQ page | :white_check_mark: | Medium | 91 answers to common student questions |
| References page | :x: | Medium | Curated bibliography with links per chapter or site-wide |
| Custom CSS styling | :white_check_mark: | Low | `css/extra.css` + `css/mascot.css` |
| Custom JavaScript | :white_check_mark: | Low | `js/extra.js` + `js/config.js` |
| Google Analytics | :x: | Trivial | Add `analytics.property` to `extra` in mkdocs.yml |

### Publishing Features

These features help your textbook look professional when shared on social media.

| Feature | Status | Effort | Notes |
|---------|--------|--------|-------|
| Social media preview cards | :x: | Medium | Add `- social` plugin; requires Pillow and CairoSVG |
| Edit page button | :white_check_mark: | Trivial | `content.action.edit` enabled |

---

## Advanced Features

These features require significant effort, custom code, or AI assistance.

### Interactive Learning

MicroSims are small, browser-based simulations that let students experiment with concepts.

| Feature | Status | Effort | Notes |
|---------|--------|--------|-------|
| MicroSims (interactive simulations) | :white_check_mark: | High | 4 browser-based apps for hands-on learning |
| MicroSim index catalog | :white_check_mark: | Medium | Visual gallery with grid cards showing all simulations |
| Per-chapter quizzes | :white_check_mark: | High | 17 quiz files (170 questions) aligned to learning objectives |
| Graphic novel stories | :white_check_mark: | High | 1 story (Jordan's One-Second Choice) with panel illustrations |

### Learning Graph System

A learning graph maps every concept in the course and shows which concepts depend on others.

| Feature | Status | Effort | Notes |
|---------|--------|--------|-------|
| Course description | :white_check_mark: | Medium | ISTE-aligned goals and Bloom's Taxonomy outcomes |
| Concept list (~200 concepts) | :white_check_mark: | High | Every topic students need to learn |
| Learning graph CSV | :white_check_mark: | High | Spreadsheet defining concept dependencies |
| Learning graph JSON | :white_check_mark: | Low | Machine-readable format for the graph viewer |
| Learning graph viewer (vis-network) | :white_check_mark: | Medium | Interactive diagram with search and category filtering |
| Concept taxonomy classification | :white_check_mark: | Medium | Concepts grouped into categories |
| Taxonomy distribution report | :white_check_mark: | Low | Distribution analysis across taxonomy categories |
| Quality metrics report | :white_check_mark: | Low | Statistics about graph completeness and structure |
| Book metrics | :x: | Medium | Word counts, reading time, and chapter statistics |
| Chapter metrics | :x: | Medium | Detailed stats for each chapter individually |
| FAQ quality report | :white_check_mark: | Low | Check FAQ completeness |
| FAQ coverage gaps | :white_check_mark: | Low | Find concepts not addressed in FAQ |
| Quiz generation report | :white_check_mark: | Low | Quality report for generated quizzes |

### Content Generation

These features involve creating the actual educational content.

| Feature | Status | Effort | Notes |
|---------|--------|--------|-------|
| Chapter content | :white_check_mark: | Very High | 17 chapters (~50,000 words total) |
| Pedagogical Agent (Mascot) | :white_check_mark: | High | Maka the River Otter — 7 poses in custom CSS admonitions |
| Mascot design documentation | :white_check_mark: | Low | Style guide and design decisions documented |
| Sample prompts collection | :white_check_mark: | Medium | Saved AI prompts for content regeneration |
| Instructor's guide | :x: | Medium | Use instructor's-guide skill to generate |
| Custom 404 page | :x: | Low | Use custom-404-page installer with Maka |

---

## Feature Dependencies

Some features require others to be implemented first.

```
Course Description
    └── Concept List
        └── Learning Graph (CSV)
            ├── Learning Graph (JSON)
            │   └── Graph Viewer
            ├── Glossary
            │   └── Glossary Quality Report
            ├── FAQ
            │   ├── FAQ Quality Report
            │   └── FAQ Coverage Gaps
            └── Chapter Content
                ├── Per-Chapter Quizzes
                ├── Per-Chapter References
                ├── Graphic Novel Stories
                └── Book/Chapter Metrics
```

---

## Cost Considerations

Most intelligent textbook features use free, open-source software.

| Feature Category | License Cost | Notes |
|------------------|--------------|-------|
| MkDocs Material | Free (MIT) | Static site generator and theme |
| Python dependencies | Free | Pillow and CairoSVG for social preview images |
| vis-network.js | Free (MIT) | JavaScript library for interactive graph diagrams |
| p5.js | Free (LGPL) | JavaScript library for creative coding and simulations |
| KaTeX / MathJax | Free (MIT) | Math equation rendering in the browser |
| AI image generation | **$20+/month** | Required for creating infographics with DALL-E or ImageFX |
| Claude/ChatGPT for content | Varies | Used to draft chapters, quizzes, and glossary entries |

---

## Quick Start: Adding Missing Features

Start with the easiest wins and work your way up.

### Highest Impact, Lowest Effort

These can be done in under an hour:

1. **GLightbox** — Add `- glightbox` to plugins and `pip install mkdocs-glightbox`
2. **Social media cards** — Add `- social` plugin for auto-generated preview images
3. **Google Analytics** — Add `analytics.property: G-XXXXXXXXXX` to `extra`
4. **Custom 404 page** — Use the `/book-installer` custom-404-page feature with Maka

### Medium Effort, High Value

These use Claude Code skills to generate content:

1. **References page** — Use the reference-generator skill for curated bibliography
2. **Book metrics** — Use the book-metrics-generator skill to track completeness
3. **Instructor's guide** — Use the instructors-guide skill to help teachers adopt the textbook

### High Effort, Transformative

These take more time but significantly enhance the learning experience:

1. **Additional MicroSims** — Each simulation takes 2–4 hours; aim for 10–20 total
2. **Additional graphic novel stories** — Use the story-generator skill for chapter companions
3. **AI-generated infographics** — Requires paid image generation subscription

---

*Generated by book-installer feature-checklist-generator*

*Last updated: April 2026*
