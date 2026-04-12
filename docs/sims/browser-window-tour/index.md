---
title: Browser Window Tour
description: Browser Window Tour
status: scaffold
library: p5.js
bloom_level: TBD
---

# Browser Window Tour

!!! warning "Scaffold"
    This MicroSim has been scaffolded from its specification. The interactive
    implementation has not been built yet.

## Learning Objective

TBD

- **Bloom Level:** TBD
- **Bloom Verb:** TBD
- **Library:** p5.js

## Preview

<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: "Chapter 1: Welcome to the Digital World"](../../chapters/01-welcome-to-digital-world/index.md).

```text
Type: microsim
**sim-id:** browser-window-tour<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom: Remember and Understand):** Given a stylized web browser window, the student can identify and name the address bar, URL, search box, and page area, and recall what each one does in their own words.

**Visual elements:**

- A responsive canvas (default 600 × 400, resizes with container width via `updateCanvasSize()` called first in `setup()`).
- A drawn web browser window with: a title bar containing three colored circles (red/yellow/green) for the close/minimize/maximize buttons, an address bar across the top showing one of three example URLs, a small search-box icon, and a stylized page area below showing a placeholder website (a logo, a heading, and a few colored rectangles representing text and images).
- Four clickable regions: address bar, URL text inside the address bar, search box, and page area.
- Hover state: a 2-pixel light blue (#4a8aab) glow draws around the region under the mouse.
- Click state: the clicked region stays highlighted and a one-sentence explanation appears in a label area below the canvas.
- All explanations use exactly the same wording as the chapter prose, so the MicroSim reinforces the definitions instead of introducing new ones.

**Controls (built-in p5.js controls per project rules):**

- `createSelect()` dropdown to switch between three example URLs: `www.isd197.org`, `www.nasa.gov`, `kids.nationalgeographic.com`. Switching the dropdown updates the URL shown in the address bar of the drawn browser.
- `createButton('Reset')` that clears the highlight and the label area.

**Behavior:**

- On `mouseMoved`, check which region the mouse is over and draw the hover highlight.
- On `mousePressed`, set a state variable to the clicked region and render its one-sentence explanation in the label area.
- On window resize, recompute the layout so the browser window scales with the container.

**Implementation notes:**

- File location: `docs/sims/browser-window-tour/` with `main.html`, `main.js`, and `index.md`.
- `main.html` uses a plain `<main></main>` tag with no `id` attribute, so teachers can copy `main.js` directly into the p5.js editor.
- In `setup()`, call `updateCanvasSize()` first, then `canvas.parent(document.querySelector('main'))`.
- Embedded into the chapter via an iframe in the chapter page once the sim files are built. The actual sim files are not part of this chapter task — only the spec lives here.

Implementation: p5.js sketch deployed at `docs/sims/browser-window-tour/`.
```

## Related Resources

- [Chapter 1: "Chapter 1: Welcome to the Digital World"](../../chapters/01-welcome-to-digital-world/index.md)
