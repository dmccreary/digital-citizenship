# Digital Citizenship for Grade 5

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/digital-citizenship/)
[![GitHub](https://img.shields.io/badge/GitHub-dmccreary%2Fdigital--citizenship-blue?logo=github)](https://github.com/dmccreary/digital-citizenship)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Claude Skills](https://img.shields.io/badge/Uses-Claude%20Skills-DA7857?logo=anthropic)](https://github.com/dmccreary/claude-skills)
[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the interactive textbook at: [https://dmccreary.github.io/digital-citizenship/](https://dmccreary.github.io/digital-citizenship/)

## Overview

This is an interactive, AI-generated intelligent textbook on **Digital Citizenship** designed for Grade 5 students (ages 10-12) in ISD 197 (West St. Paul-Mendota Heights-Eagan Area Schools) in Minnesota. Built using MkDocs with the Material theme, it incorporates a learning graph with 265 concepts, interactive MicroSims built with p5.js, mini graphic novel stories, chapter quizzes, and AI-assisted content generation.

The textbook is aligned to the **ISTE Student Standards** and follows Bloom's Taxonomy (2001 revision) for learning outcomes. It uses concept dependency graphs to ensure proper prerequisite sequencing across 17 chapters covering media balance, online safety, digital footprints, cyberbullying, misinformation, and critical thinking.

The project features **Maka the River Otter** as a learning mascot — inspired by the river otters that live at the confluence of the Minnesota and Mississippi rivers near Bdote, a place sacred to the Dakota people. Maka guides students through each chapter with the catchphrase: *"Pause, think, act!"*

## Site Metrics

| Metric | Count |
|--------|-------|
| Concepts in Learning Graph | 265 |
| Chapters | 17 |
| Markdown Files | 110 |
| Total Words | 190,661 |
| MicroSims | 7 |
| Mini Graphic Novel Stories | 15 |
| Glossary Terms | 267 |
| FAQ Questions | 98 |
| Quiz Questions | 170 |
| Images | 43 |
| Chapter Reference Lists | 17 |

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/digital-citizenship.git
cd digital-citizenship
```

### Install Dependencies

This project uses MkDocs with the Material theme:

```bash
pip install mkdocs
pip install mkdocs-material
pip install mkdocs-glightbox
```

### Build and Serve Locally

Serve locally for development (with live reload):

```bash
mkdocs serve
```

Open your browser to `http://localhost:8000/digital-citizenship/`

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

### Using the Book

- Use the left sidebar to browse chapters, stories, and MicroSims
- Click the search icon to search all content
- Each chapter includes a quiz and curated references
- Interactive MicroSims run standalone in your browser with adjustable controls

## Repository Structure

```
digital-citizenship/
├── docs/                          # MkDocs documentation source
│   ├── chapters/                  # 17 chapter directories
│   │   ├── 01-welcome-to-digital-world/
│   │   │   ├── index.md          # Chapter content
│   │   │   ├── quiz.md           # Chapter quiz
│   │   │   └── references.md     # Curated references
│   │   └── ...
│   ├── stories/                   # 15 mini graphic novel stories
│   │   ├── jordan-one-second-choice/
│   │   │   └── index.md
│   │   └── ...
│   ├── sims/                      # Interactive p5.js MicroSims
│   │   ├── graph-viewer/
│   │   │   ├── main.html         # Standalone simulation
│   │   │   └── index.md          # Documentation page
│   │   └── ...
│   ├── learning-graph/            # Learning graph data and analysis
│   │   ├── concept-list.md       # 200 concepts with dependencies
│   │   └── quality-metrics.md    # Quality analysis
│   ├── img/mascot/               # Maka the River Otter images
│   ├── glossary.md               # 267 defined terms
│   ├── faq.md                    # 98 frequently asked questions
│   └── css/                      # Custom styling and mascot CSS
├── overrides/                     # MkDocs Material theme overrides
├── mkdocs.yml                     # MkDocs configuration
├── CLAUDE.md                      # AI assistant project instructions
└── README.md                      # This file
```

## Reporting Issues

Found a bug, typo, or have a suggestion for improvement? Please report it:

[GitHub Issues](https://github.com/dmccreary/digital-citizenship/issues)

When reporting issues, please include:

- Description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (if applicable)

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**

- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

**Under the following terms:**

- **Attribution** — Give appropriate credit with a link to the original
- **NonCommercial** — No commercial use without permission
- **ShareAlike** — Distribute contributions under the same license

See [LICENSE](docs/license.md) for full details.

## Acknowledgements

This project is built on the shoulders of giants in the open source community:

- **[MkDocs](https://www.mkdocs.org/)** — Static site generator optimized for project documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** — Beautiful, responsive theme
- **[p5.js](https://p5js.org/)** — Creative coding library for interactive MicroSims
- **[vis-network](https://visjs.org/)** — Network visualization library for the learning graph viewer
- **[Claude AI](https://claude.ai)** by Anthropic — AI-assisted content generation
- **[GitHub Pages](https://pages.github.com/)** — Free hosting for open source projects
- **[Common Sense Education](https://www.commonsense.org/education)** — Digital citizenship curriculum frameworks
- **[ISTE Standards](https://www.iste.org/standards/students)** — Student technology standards alignment

Special thanks to the educators at ISD 197 and the open source community for making educational resources accessible and interactive.

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, suggestions, or collaboration opportunities? Feel free to connect on LinkedIn or open an issue on GitHub.
