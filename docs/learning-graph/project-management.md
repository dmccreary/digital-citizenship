# Project Management

## Kanban Board

This project uses a [GitHub Projects Kanban board](https://github.com/users/dmccreary/projects/11)
to track development progress.

### How to Access

1. Visit the [project board](https://github.com/users/dmccreary/projects/11)
2. Or from the repository page, click the **Projects** tab

### Kanban Columns

GitHub Projects uses a board view with three default columns:

| Column | Purpose | When to Move Here |
|--------|---------|-------------------|
| **Todo** | Work that has been identified but not started | New tasks and milestones start here |
| **In Progress** | Work that is actively being developed | Move here when you begin working on a task |
| **Done** | Completed work that has been verified | Move here after the work is committed, reviewed, and deployed |

### Priority Levels

Each item can be assigned a priority:

- **High** - Blocks other work or is needed for the next milestone
- **Medium** - Important but not blocking
- **Low** - Nice to have, can be deferred

### Textbook Development Workflow

The standard intelligent textbook development follows this sequence:

1. **Course description** - Define audience, prerequisites, and learning objectives
2. **Learning graph** - Enumerate concepts and map dependencies
3. **Chapter structure** - Design chapters respecting concept prerequisites
4. **Glossary** - Define all key terms (ISO 11179 standards)
5. **Chapter content** - Write detailed content with examples and exercises
6. **MicroSims** - Build interactive simulations for key concepts
7. **Quizzes** - Create assessments aligned to Bloom's Taxonomy
8. **FAQs** - Anticipate and answer common questions
9. **References** - Curate reliable sources for each chapter
10. **Cover image and home page** - Design visual identity and social metadata
11. **Learning graph viewer** - Add interactive concept explorer
12. **Metrics and QA** - Validate completeness and quality
13. **Deploy** - Publish to GitHub Pages

### Adding New Tasks

From the command line:

```bash
gh project item-create 11 --owner dmccreary \
  --title "Task title" \
  --body "Task description"
```

Or use the **+ Add item** button at the bottom of any column in the board view.

### Converting Drafts to Issues

Draft items on the board can be converted to full GitHub issues,
which enables assignment, labels, and cross-referencing in pull requests.
Click the draft item title, then select **Convert to issue** and
choose the repository.
