// diagram.js — Interactive Diagram MicroSim
// Layouts : 'side-panel'  (image left 65%, labels right 35% — default)
//            'top-bottom'  (labels above and below image)
//            'dual-panel'  (labels left 22% | image center 56% | labels right 22%)
// Modes   : explore (click marker/label to reveal info)
//           quiz    (labels hidden, click to identify)
//           edit    (?edit=true — drag markers to calibrate positions)
// Data flags:
//   clickOnly (bool, default false) — if true, suppresses both the hover-
//     reveal behavior in explore mode AND the CSS hover feedback on markers
//     and label rows. cursor:pointer remains as the only hover affordance.
//     Use for content where hover would mislead users on touch devices
//     (WCAG 2.1 1.4.13).
//   quizMode (string, default "identify") — quiz interaction style:
//     "identify"   — classic: prompt names a structure, student clicks the
//                    matching marker. Each callout shown once, in random
//                    order. Score = correct identifications.
//     "select-all" — student is given a single prompt (data.quizPrompt) and
//                    must click every callout whose quizCorrect === true.
//                    Wrong picks flash red but do not penalize. Quiz ends
//                    when all correct callouts have been clicked.
//   quizPrompt (string, used only when quizMode === "select-all") — the
//     instruction text shown to the student during the quiz.
//   Per-callout quizCorrect (bool, used only when quizMode === "select-all")
//     — true marks a callout as a valid answer to the quizPrompt. Default
//     is false (callout is a distractor).

class DiagramSim {
  // Line width helpers — normal / edit mode
  get lw()       { return this.editMode ? 4.5 : 3; }
  get lwActive() { return this.editMode ? 6   : 4; }

  constructor() {
    this.data             = null;
    this.layout           = 'side-panel';
    this.mode             = 'explore';
    this.editMode         = false;
    this.titleEl          = null;
    this.showNumbers      = true;
    this.markers          = new Map();   // id → <button>
    this.labelRows        = new Map();   // id → .label-row element
    this.leaderLines      = new Map();   // id → <path>
    this.activeId         = null;
    this.quizQueue        = [];
    this.quizIndex        = 0;
    this.quizCorrect      = 0;
    this.quizLocked       = false;
    // Layout-specific panel references
    this.labelPanel       = null;  // side-panel
    this.labelPanelTop    = null;  // top-bottom
    this.labelPanelBottom = null;  // top-bottom
    this.labelPanelLeft   = null;  // dual-panel
    this.labelPanelRight  = null;  // dual-panel
  }

  // ── Boot ──────────────────────────────────────────────────────────────────

  async init() {
    this.imgEl        = document.getElementById('diagram-img');
    this.markersLayer = document.getElementById('markers-layer');
    this.svgEl        = document.getElementById('leaders-svg');
    this.layoutEl     = document.getElementById('layout');

    const params = new URLSearchParams(window.location.search);
    this.editMode = params.get('edit') === 'true';

    try {
      const res = await fetch('data.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      this.data        = await res.json();
      this.showNumbers = this.data.showNumbers !== false;
      this.layout      = this.data.layout || 'side-panel';
      // Click-only mode: suppress hover visual feedback. Information reveal
      // is already click-driven; this flag also strips the hover-state CSS so
      // the affordance does not mislead users into expecting hover semantics.
      if (this.data.clickOnly === true) {
        document.body.classList.add('click-only');
      }
      this.injectTitle();
    } catch (err) {
      this.showFatalError('Could not load data.json: ' + err.message);
      return;
    }

    // Set up layout-specific DOM structure
    if (this.layout === 'top-bottom') {
      this.setupTopBottomDOM();
    } else if (this.layout === 'dual-panel') {
      this.setupDualPanelDOM();
    } else {
      this.labelPanel = document.getElementById('label-panel');
    }

    // Wait for image so layout dimensions are valid
    await new Promise(resolve => {
      if (this.imgEl.complete && this.imgEl.naturalWidth > 0) resolve();
      else this.imgEl.addEventListener('load', resolve, { once: true });
    });

    this.renderMarkers();
    this.renderLabels();

    requestAnimationFrame(() => {
      this.drawLeaders();
      this.resizeObserver = new ResizeObserver(() => { this.drawLeaders(); this.reportHeight(); });
      this.resizeObserver.observe(this.layoutEl);
    });

    if (this.editMode) {
      this.activateEditMode();
    } else {
      this.setMode('explore');
    }

    this.reportHeight();
  }

  // ── Iframe auto-resize ────────────────────────────────────────────────────
  // Sends the actual content height to the parent page via postMessage so the
  // parent can resize the iframe to fit.  No-op when running fullscreen.
  //
  // Anti-jitter design: this method also pins #infobox to its worst-case
  // height by setting an inline minHeight, so the #controls bar that lives
  // BELOW the infobox in DOM order never shifts vertically when the student
  // clicks between short and long callouts. The infobox text changes; the
  // box itself, the controls, and the iframe height all stay constant.

  reportHeight() {
    if (window.self === window.top) return;

    // Temporarily populate the infobox with the longest callout content
    // so scrollHeight reflects the worst-case height.
    const descEl    = document.getElementById('infobox-desc');
    const labelEl   = document.getElementById('infobox-label');
    const tipEl     = document.getElementById('infobox-ap-tip');
    const promptEl  = document.getElementById('infobox-prompt');
    const infoboxEl = document.getElementById('infobox');

    if (this.data && this.data.callouts && descEl) {
      const savedDesc   = descEl.textContent;
      const savedLabel  = labelEl.textContent;
      const savedTip    = tipEl ? tipEl.textContent : '';
      const savedTipVis = tipEl ? tipEl.style.display : '';
      const savedPrompt = promptEl ? promptEl.style.display : '';

      // Clear any min-height left over from a previous reportHeight() call so
      // the new measurement is fresh (e.g., after a window resize).
      if (infoboxEl) infoboxEl.style.minHeight = '';

      // Find the callout with the longest combined text
      let longest = this.data.callouts[0];
      let maxLen  = 0;
      for (const c of this.data.callouts) {
        const len = (c.description || '').length + (c.ap_tip || '').length;
        if (len > maxLen) { maxLen = len; longest = c; }
      }

      // Fill infobox with longest content to measure
      const contentEl     = document.getElementById('infobox-content');
      const savedContent  = contentEl ? contentEl.style.display : '';
      if (promptEl) promptEl.style.display = 'none';
      if (contentEl) contentEl.style.display = 'block';
      labelEl.textContent = longest.label || '';
      descEl.textContent  = longest.description || '';
      if (tipEl && longest.ap_tip) {
        tipEl.textContent   = longest.ap_tip;
        tipEl.style.display = 'block';
      }

      // Pin the infobox at its current (worst-case) height. Once this is
      // set, restoring shorter content will not shrink the infobox box, so
      // #controls below it stays at a fixed Y position no matter what
      // callout the student clicks.
      if (infoboxEl) {
        infoboxEl.style.minHeight = infoboxEl.offsetHeight + 'px';
      }

      const height = document.body.scrollHeight + 30;

      // Restore original infobox state
      if (contentEl) contentEl.style.display = savedContent;
      descEl.textContent  = savedDesc;
      labelEl.textContent = savedLabel;
      if (tipEl) { tipEl.textContent = savedTip; tipEl.style.display = savedTipVis; }
      if (promptEl) promptEl.style.display = savedPrompt;

      window.parent.postMessage({ type: 'microsim-resize', height: height }, '*');
    } else {
      const height = document.body.scrollHeight + 30;
      window.parent.postMessage({ type: 'microsim-resize', height: height }, '*');
    }
  }

  injectTitle() {
    if (!this.data || !this.data.title) return;

    if (!this.titleEl) {
      this.titleEl = document.getElementById('sim-title');
      if (!this.titleEl) {
        this.titleEl = document.createElement('h1');
        this.titleEl.id = 'sim-title';
        this.titleEl.className = 'sim-title';
        const layout = document.getElementById('layout');
        const controls = document.getElementById('controls');
        const anchor = layout || controls;
        if (anchor && anchor.parentNode) {
          anchor.parentNode.insertBefore(this.titleEl, anchor);
        } else {
          document.body.insertBefore(this.titleEl, document.body.firstChild);
        }
      }
    }

    this.titleEl.textContent = this.data.title;
  }

  // ── Top-bottom layout DOM setup ───────────────────────────────────────────

  setupTopBottomDOM() {
    this.layoutEl.classList.add('top-bottom-layout');

    const wrapper = document.getElementById('diagram-wrapper');

    // Top label strip — inserted before the diagram
    const topPanel = document.createElement('div');
    topPanel.id        = 'label-panel-top';
    topPanel.className = 'label-panel-strip';
    this.layoutEl.insertBefore(topPanel, wrapper);

    // Bottom label strip — appended after the diagram
    const botPanel = document.createElement('div');
    botPanel.id        = 'label-panel-bottom';
    botPanel.className = 'label-panel-strip';
    this.layoutEl.appendChild(botPanel);

    this.labelPanelTop    = topPanel;
    this.labelPanelBottom = botPanel;
  }

  // ── Dual-panel layout DOM setup ──────────────────────────────────────────

  setupDualPanelDOM() {
    this.layoutEl.classList.add('dual-panel-layout');

    const wrapper  = document.getElementById('diagram-wrapper');
    const oldPanel = document.getElementById('label-panel');

    // Left label panel — inserted before the diagram wrapper
    const leftPanel = document.createElement('div');
    leftPanel.id        = 'label-panel-left';
    leftPanel.className = 'label-panel-side';
    this.layoutEl.insertBefore(leftPanel, wrapper);

    // Right label panel — replace the default #label-panel
    if (oldPanel) {
      oldPanel.id        = 'label-panel-right';
      oldPanel.className = 'label-panel-side';
    } else {
      const rightPanel = document.createElement('div');
      rightPanel.id        = 'label-panel-right';
      rightPanel.className = 'label-panel-side';
      this.layoutEl.appendChild(rightPanel);
    }

    this.labelPanelLeft  = document.getElementById('label-panel-left');
    this.labelPanelRight = document.getElementById('label-panel-right');
  }

  // ── Markers (numbered dots on the image) ──────────────────────────────────

  renderMarkers() {
    this.markersLayer.innerHTML = '';
    this.markers.clear();

    for (const callout of this.data.callouts) {
      const btn = document.createElement('button');
      btn.className = 'marker';
      btn.textContent = this.showNumbers ? callout.id : '';
      btn.setAttribute('aria-label', callout.label);
      btn.style.left = callout.x + '%';
      btn.style.top  = callout.y + '%';
      btn.dataset.id = String(callout.id);
      this.markers.set(callout.id, btn);
      this.markersLayer.appendChild(btn);
    }
  }

  // ── Label rows ────────────────────────────────────────────────────────────

  renderLabels() {
    if (this.layout === 'top-bottom') {
      this.renderLabelsTopBottom();
    } else if (this.layout === 'dual-panel') {
      this.renderLabelsDualPanel();
    } else {
      this.renderLabelsSidePanel();
    }
  }

  renderLabelsSidePanel() {
    this.labelPanel.innerHTML = '';
    this.labelRows.clear();
    for (const callout of this.data.callouts) {
      const row = this.buildLabelRow(callout);
      this.labelPanel.appendChild(row);
      this.labelRows.set(callout.id, row);
    }
  }

  renderLabelsTopBottom() {
    this.labelPanelTop.innerHTML    = '';
    this.labelPanelBottom.innerHTML = '';
    this.labelRows.clear();
    for (const callout of this.data.callouts) {
      const row = this.buildLabelRow(callout);
      row.dataset.panel = callout.panel || 'top';
      const panel = (callout.panel === 'bottom') ? this.labelPanelBottom : this.labelPanelTop;
      panel.appendChild(row);
      this.labelRows.set(callout.id, row);
    }
  }

  renderLabelsDualPanel() {
    this.labelPanelLeft.innerHTML  = '';
    this.labelPanelRight.innerHTML = '';
    this.labelRows.clear();
    for (const callout of this.data.callouts) {
      const row = this.buildLabelRow(callout);
      row.dataset.panel = callout.panel || 'right';
      const panel = (callout.panel === 'left') ? this.labelPanelLeft : this.labelPanelRight;
      panel.appendChild(row);
      this.labelRows.set(callout.id, row);
    }
  }

  // Shared label row builder — used by all layout modes
  buildLabelRow(callout) {
    const row = document.createElement('div');
    row.className  = 'label-row';
    row.dataset.id = String(callout.id);

    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '⠿';
    handle.setAttribute('aria-hidden', 'true');
    handle.title = 'Drag to reorder';

    const num = document.createElement('span');
    num.className   = 'label-num';
    num.textContent = this.showNumbers ? callout.id : '';

    const text = document.createElement('span');
    text.className      = 'label-text';
    text.dataset.id     = String(callout.id);
    text.textContent    = callout.label;

    row.appendChild(handle);
    row.appendChild(num);
    row.appendChild(text);

    // Color swatch — visible only in edit mode; helps identify the structure in the image
    if (callout.color) {
      const swatch = document.createElement('span');
      swatch.className        = 'color-swatch';
      swatch.style.background = callout.color;
      swatch.title            = callout.color;
      row.appendChild(swatch);
    }

    // Hint text — visible only in edit mode; describes where/what to look for
    if (callout.hint) {
      const hint = document.createElement('span');
      hint.className   = 'label-hint';
      hint.textContent = callout.hint;
      row.appendChild(hint);
    }

    return row;
  }

  // ── SVG leader lines ───────────────────────────────────────────────────────

  drawLeaders() {
    if (this.layout === 'top-bottom') {
      this.drawLeadersTopBottom();
    } else if (this.layout === 'dual-panel') {
      this.drawLeadersDualPanel();
    } else {
      this.drawLeadersSidePanel();
    }
  }

  drawLeadersSidePanel() {
    const layoutRect = this.layoutEl.getBoundingClientRect();
    if (layoutRect.width === 0) return;

    this.svgEl.setAttribute('width',   layoutRect.width);
    this.svgEl.setAttribute('height',  layoutRect.height);
    this.svgEl.setAttribute('viewBox', `0 0 ${layoutRect.width} ${layoutRect.height}`);
    this.svgEl.innerHTML = '';
    this.leaderLines.clear();

    for (const callout of this.data.callouts) {
      const markerEl = this.markers.get(callout.id);
      const rowEl    = this.labelRows.get(callout.id);
      const numEl    = rowEl.querySelector('.label-num');

      const markerRect = markerEl.getBoundingClientRect();
      const numRect    = numEl.getBoundingClientRect();

      // Marker right-center → label-num left-center; horizontal S-curve
      const x1 = markerRect.right  - layoutRect.left;
      const y1 = markerRect.top + markerRect.height / 2 - layoutRect.top;
      const x2 = numRect.left      - layoutRect.left;
      const y2 = numRect.top + numRect.height / 2 - layoutRect.top;
      const mx = x1 + (x2 - x1) * 0.5;
      const d  = `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;

      const path = this.makePath(d, callout.id);
      this.svgEl.appendChild(path);
      this.leaderLines.set(callout.id, path);
    }

    if (this.activeId !== null) this.applyLineHighlight(this.activeId);
  }

  drawLeadersTopBottom() {
    const layoutRect = this.layoutEl.getBoundingClientRect();
    if (layoutRect.width === 0) return;

    this.svgEl.setAttribute('width',   layoutRect.width);
    this.svgEl.setAttribute('height',  layoutRect.height);
    this.svgEl.setAttribute('viewBox', `0 0 ${layoutRect.width} ${layoutRect.height}`);
    this.svgEl.innerHTML = '';
    this.leaderLines.clear();

    for (const callout of this.data.callouts) {
      const markerEl = this.markers.get(callout.id);
      const rowEl    = this.labelRows.get(callout.id);
      const numEl    = rowEl.querySelector('.label-num');

      const markerRect = markerEl.getBoundingClientRect();
      const numRect    = numEl.getBoundingClientRect();

      // Horizontal centers
      const markerCX = markerRect.left + markerRect.width  / 2 - layoutRect.left;
      const labelCX  = numRect.left    + numRect.width     / 2 - layoutRect.left;

      // Vertical S-curve: departs vertically from both endpoints
      let markerY, labelY;
      const panel = rowEl.dataset.panel || callout.panel || 'top';
      if (panel === 'bottom') {
        // Label is below → connect marker bottom to label top
        markerY = markerRect.bottom - layoutRect.top;
        labelY  = numRect.top       - layoutRect.top;
      } else {
        // Label is above → connect marker top to label bottom
        markerY = markerRect.top    - layoutRect.top;
        labelY  = numRect.bottom    - layoutRect.top;
      }

      const midY = markerY + (labelY - markerY) * 0.5;
      const d = `M ${markerCX} ${markerY} C ${markerCX} ${midY} ${labelCX} ${midY} ${labelCX} ${labelY}`;

      const path = this.makePath(d, callout.id);
      this.svgEl.appendChild(path);
      this.leaderLines.set(callout.id, path);
    }

    if (this.activeId !== null) this.applyLineHighlight(this.activeId);
  }

  drawLeadersDualPanel() {
    const layoutRect = this.layoutEl.getBoundingClientRect();
    if (layoutRect.width === 0) return;

    this.svgEl.setAttribute('width',   layoutRect.width);
    this.svgEl.setAttribute('height',  layoutRect.height);
    this.svgEl.setAttribute('viewBox', `0 0 ${layoutRect.width} ${layoutRect.height}`);
    this.svgEl.innerHTML = '';
    this.leaderLines.clear();

    for (const callout of this.data.callouts) {
      const markerEl = this.markers.get(callout.id);
      const rowEl    = this.labelRows.get(callout.id);
      const numEl    = rowEl.querySelector('.label-num');

      const markerRect = markerEl.getBoundingClientRect();
      const numRect    = numEl.getBoundingClientRect();

      const panel = rowEl.dataset.panel || callout.panel || 'right';
      let x1, y1, x2, y2;

      if (panel === 'left') {
        // Leader goes from label-num right-center → marker left-center
        x1 = numRect.right - layoutRect.left;
        y1 = numRect.top + numRect.height / 2 - layoutRect.top;
        x2 = markerRect.left - layoutRect.left;
        y2 = markerRect.top + markerRect.height / 2 - layoutRect.top;
      } else {
        // Leader goes from marker right-center → label-num left-center
        x1 = markerRect.right - layoutRect.left;
        y1 = markerRect.top + markerRect.height / 2 - layoutRect.top;
        x2 = numRect.left - layoutRect.left;
        y2 = numRect.top + numRect.height / 2 - layoutRect.top;
      }

      const mx = x1 + (x2 - x1) * 0.5;
      const d  = `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;

      const path = this.makePath(d, callout.id);
      this.svgEl.appendChild(path);
      this.leaderLines.set(callout.id, path);
    }

    if (this.activeId !== null) this.applyLineHighlight(this.activeId);
  }

  makePath(d, id) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#3a7a3a');
    path.setAttribute('stroke-width', this.lw);
    path.setAttribute('opacity', '0.3');
    path.dataset.id = String(id);
    return path;
  }

  applyLineHighlight(id) {
    for (const [lid, path] of this.leaderLines) {
      if (lid === id) {
        path.setAttribute('opacity',      '0.9');
        path.setAttribute('stroke-width', this.lwActive);
        path.setAttribute('stroke',       '#1f5c1f');
      } else {
        path.setAttribute('opacity',      '0.15');
        path.setAttribute('stroke-width', this.lw);
        path.setAttribute('stroke',       '#3a7a3a');
      }
    }
  }

  clearLineHighlights() {
    for (const path of this.leaderLines.values()) {
      path.setAttribute('opacity',      '0.3');
      path.setAttribute('stroke-width', this.lw);
      path.setAttribute('stroke',       '#3a7a3a');
    }
  }

  // ── Mode switching ────────────────────────────────────────────────────────

  setMode(newMode) {
    if (this.editMode) return;
    this.mode     = newMode;
    this.activeId = null;

    document.getElementById('btn-explore').classList.toggle('active', newMode === 'explore');
    document.getElementById('btn-quiz').classList.toggle('active',    newMode === 'quiz');

    for (const btn of this.markers.values()) {
      btn.className     = 'marker';
      btn.textContent   = this.showNumbers ? this.data.callouts.find(c => c.id == btn.dataset.id).id : '';
      btn.onpointerdown = null;
      btn.onpointerenter = null;
      btn.onpointerleave = null;
      btn.onclick       = null;
    }

    for (const row of this.labelRows.values()) {
      // Preserve panel affiliation across mode resets
      const panel = row.dataset.panel;
      row.className = 'label-row';
      if (panel) row.dataset.panel = panel;
      row.onclick        = null;
      row.onpointerenter = null;
      row.onpointerleave = null;
      row.querySelector('.label-text').classList.remove('quiz-hidden');
    }

    this.clearLineHighlights();
    this.resetInfobox();
    document.getElementById('quiz-score').style.display   = 'none';
    document.getElementById('quiz-restart').style.display = 'none';

    if (newMode === 'explore') this.initExplore();
    if (newMode === 'quiz') {
      if (this.data && this.data.quizMode === 'select-all') {
        this.initSelectAllQuiz();
      } else {
        this.initQuiz();
      }
    }
  }

  // ── Explore mode ──────────────────────────────────────────────────────────

  initExplore() {
    const clickOnly = this.data && this.data.clickOnly === true;

    for (const callout of this.data.callouts) {
      const btn = this.markers.get(callout.id);
      const row = this.labelRows.get(callout.id);

      const activate = () => {
        // In click-only mode, clicking a different marker should clear the
        // previous selection. (In hover mode, pointerleave handles that.)
        if (clickOnly) {
          for (const b of this.markers.values()) b.classList.remove('active');
          for (const r of this.labelRows.values()) r.classList.remove('active');
          this.clearLineHighlights();
        }
        this.activeId = callout.id;
        btn.classList.add('active');
        row.classList.add('active');
        this.applyLineHighlight(callout.id);
        this.showInfobox(callout);
      };
      const deactivate = () => {
        this.activeId = null;
        btn.classList.remove('active');
        row.classList.remove('active');
        this.clearLineHighlights();
      };

      if (clickOnly) {
        // No hover handlers at all — click does the full activate-and-reveal.
        btn.onclick = activate;
        row.onclick = activate;
      } else {
        btn.onpointerenter = activate;
        btn.onpointerleave = deactivate;
        btn.onclick        = () => this.showInfobox(callout);

        row.onpointerenter = activate;
        row.onpointerleave = deactivate;
        row.onclick        = () => this.showInfobox(callout);
      }
    }
  }

  showInfobox(callout) {
    document.getElementById('infobox-prompt').style.display  = 'none';
    document.getElementById('infobox-content').style.display = 'block';

    const labelEl = document.getElementById('infobox-label');
    labelEl.textContent = callout.label;
    labelEl.className   = '';

    document.getElementById('infobox-desc').textContent = callout.description;

    const tipEl = document.getElementById('infobox-ap-tip');
    if (callout.ap_tip) {
      tipEl.innerHTML    = '<strong>college placement Exam Tip:</strong> ' + callout.ap_tip;
      tipEl.style.display = 'block';
    } else {
      tipEl.style.display = 'none';
    }
  }

  resetInfobox() {
    document.getElementById('infobox-prompt').style.display  = 'block';
    document.getElementById('infobox-content').style.display = 'none';
  }

  // ── Quiz mode ─────────────────────────────────────────────────────────────

  initQuiz() {
    this.quizQueue   = [...this.data.callouts].sort(() => Math.random() - 0.5);
    this.quizIndex   = 0;
    this.quizCorrect = 0;
    this.quizLocked  = false;

    document.getElementById('quiz-score').style.display = '';
    this.updateScore();

    for (const callout of this.data.callouts) {
      this.labelRows.get(callout.id).querySelector('.label-text').classList.add('quiz-hidden');
      const btn = this.markers.get(callout.id);
      btn.classList.add('quiz-unknown');
      btn.textContent = '?';
    }

    this.showNextQuestion();
  }

  showNextQuestion() {
    this.quizLocked = false;

    if (this.quizIndex >= this.quizQueue.length) {
      this.showQuizComplete();
      return;
    }

    const target = this.quizQueue[this.quizIndex];

    for (const btn of this.markers.values())   btn.classList.remove('incorrect');
    for (const row of this.labelRows.values()) row.classList.remove('active');
    this.clearLineHighlights();

    this.labelRows.get(target.id).classList.add('active');
    this.applyLineHighlight(target.id);

    document.getElementById('infobox-prompt').style.display  = 'none';
    document.getElementById('infobox-content').style.display = 'block';
    document.getElementById('infobox-ap-tip').style.display  = 'none';
    document.getElementById('infobox-desc').textContent      = '';
    document.getElementById('quiz-restart').style.display    = 'none';

    const labelEl = document.getElementById('infobox-label');
    labelEl.className = 'prompt-label';
    labelEl.innerHTML = 'Click on: <em>' + target.label + '</em>';

    for (const callout of this.data.callouts) {
      this.markers.get(callout.id).onclick = () => this.handleAnswer(callout, target);
    }
  }

  handleAnswer(clicked, target) {
    if (this.quizLocked) return;

    const clickedBtn = this.markers.get(clicked.id);

    if (clicked.id === target.id) {
      // ── Correct ──
      this.quizLocked = true;
      this.quizCorrect++;
      this.updateScore();

      const textEl = this.labelRows.get(target.id).querySelector('.label-text');
      textEl.classList.remove('quiz-hidden');
      this.labelRows.get(target.id).classList.add('correct-row');

      clickedBtn.classList.remove('quiz-unknown');
      clickedBtn.classList.add('correct');
      clickedBtn.textContent = this.showNumbers ? target.id : '';

      const path = this.leaderLines.get(target.id);
      if (path) {
        path.setAttribute('opacity',      '0.7');
        path.setAttribute('stroke',       '#2A8040');
        path.setAttribute('stroke-width', this.lwActive);
      }

      const labelEl = document.getElementById('infobox-label');
      labelEl.className   = 'correct-label';
      labelEl.textContent = '✓ ' + target.label;
      document.getElementById('infobox-desc').textContent = target.description;

      const tipEl = document.getElementById('infobox-ap-tip');
      if (target.ap_tip) {
        tipEl.innerHTML    = '<strong>college placement Exam Tip:</strong> ' + target.ap_tip;
        tipEl.style.display = 'block';
      }

      setTimeout(() => { this.quizIndex++; this.showNextQuestion(); }, 1800);

    } else {
      // ── Wrong ──
      clickedBtn.classList.add('incorrect');
      document.getElementById('infobox-desc').textContent =
        'Not quite — that is the ' + clicked.label + '. Try again.';
      setTimeout(() => clickedBtn.classList.remove('incorrect'), 500);
    }
  }

  showQuizComplete() {
    for (const row of this.labelRows.values()) {
      row.querySelector('.label-text').classList.remove('quiz-hidden');
      row.classList.remove('active');
    }
    this.clearLineHighlights();

    document.getElementById('infobox-label').className   = '';
    document.getElementById('infobox-label').textContent = 'Quiz complete!';
    document.getElementById('infobox-desc').textContent  =
      'You correctly identified ' + this.quizCorrect + ' of ' + this.quizQueue.length + ' structures.';
    document.getElementById('infobox-ap-tip').style.display  = 'none';
    document.getElementById('quiz-restart').style.display    = 'inline-block';

    this.launchCelebration();
  }

  // ── Quiz mode: select-all-that-fit ────────────────────────────────────────
  // Used when data.quizMode === 'select-all'. Student is given a single
  // prompt (data.quizPrompt) and must click every callout whose
  // quizCorrect === true. Wrong picks flash red but do not deduct from the
  // score. The quiz ends when every correct callout has been found.

  initSelectAllQuiz() {
    // Build the set of correct callout ids
    this.selectAllCorrectIds = new Set();
    for (const c of this.data.callouts) {
      if (c.quizCorrect === true) this.selectAllCorrectIds.add(c.id);
    }
    this.selectAllFound  = new Set();
    this.selectAllClicks = new Set();   // any callout already clicked (locks it)
    this.quizCorrect     = 0;

    // Score readout: "found / total correct"
    document.getElementById('score-val').textContent   = '0';
    document.getElementById('score-total').textContent = String(this.selectAllCorrectIds.size);
    document.getElementById('quiz-score').style.display = '';

    // Reset markers and labels — keep labels visible (this is not an
    // identification quiz, so showing the names is fine and helps Grade 5
    // readers connect the marker to the device).
    for (const btn of this.markers.values()) {
      btn.classList.remove('correct', 'incorrect', 'quiz-unknown');
    }
    for (const row of this.labelRows.values()) {
      row.classList.remove('correct-row', 'active');
      row.querySelector('.label-text').classList.remove('quiz-hidden');
    }
    this.clearLineHighlights();

    // Show the prompt in the infobox
    document.getElementById('infobox-prompt').style.display  = 'none';
    document.getElementById('infobox-content').style.display = 'block';
    document.getElementById('infobox-ap-tip').style.display  = 'none';
    document.getElementById('quiz-restart').style.display    = 'none';

    const labelEl = document.getElementById('infobox-label');
    labelEl.className   = 'prompt-label';
    labelEl.textContent = 'Quiz';
    document.getElementById('infobox-desc').textContent =
      this.data.quizPrompt ||
      'Click on every item that fits the question. Skip the ones that do not.';

    // Bind click handlers — both markers and label rows act as input.
    for (const callout of this.data.callouts) {
      const btn = this.markers.get(callout.id);
      const row = this.labelRows.get(callout.id);
      const handler = () => this.handleSelectAllAnswer(callout);
      btn.onclick = handler;
      row.onclick = handler;
    }
  }

  handleSelectAllAnswer(callout) {
    // Each callout can be clicked at most once per quiz session.
    if (this.selectAllClicks.has(callout.id)) return;
    this.selectAllClicks.add(callout.id);

    const btn = this.markers.get(callout.id);
    const row = this.labelRows.get(callout.id);
    const labelEl = document.getElementById('infobox-label');
    const descEl  = document.getElementById('infobox-desc');

    if (this.selectAllCorrectIds.has(callout.id)) {
      // ── Correct pick ──
      this.selectAllFound.add(callout.id);
      this.quizCorrect = this.selectAllFound.size;
      document.getElementById('score-val').textContent = String(this.quizCorrect);

      btn.classList.add('correct');
      row.classList.add('correct-row');

      const path = this.leaderLines.get(callout.id);
      if (path) {
        path.setAttribute('opacity',      '0.7');
        path.setAttribute('stroke',       '#2A8040');
        path.setAttribute('stroke-width', this.lwActive);
      }

      labelEl.className   = 'correct-label';
      labelEl.textContent = '✓ ' + callout.label;
      descEl.textContent  = callout.description;

      if (this.selectAllFound.size === this.selectAllCorrectIds.size) {
        setTimeout(() => this.showSelectAllComplete(), 1500);
      }
    } else {
      // ── Wrong pick ── (no score penalty, just feedback)
      btn.classList.add('incorrect');
      labelEl.className   = '';
      labelEl.textContent = '✗ ' + callout.label;
      descEl.textContent  = callout.description;
      // Leave the .incorrect class on the marker so the student can see
      // which one they got wrong; it gets cleared on quiz restart.
    }
  }

  showSelectAllComplete() {
    document.getElementById('infobox-label').className   = 'correct-label';
    document.getElementById('infobox-label').textContent = '🎉 Great work!';
    document.getElementById('infobox-desc').textContent  =
      'You found all ' + this.selectAllCorrectIds.size +
      ' of them. Click "Try Again" to play once more, or switch back to Explore mode to read about each device.';
    document.getElementById('infobox-ap-tip').style.display = 'none';
    document.getElementById('quiz-restart').style.display   = 'inline-block';

    this.launchCelebration();
  }

  // ── Celebration animation ─────────────────────────────────────────────────

  launchCelebration() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:9999'
    ].join(';');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = [
      '#3a7a3a', '#7DB84A', '#a6e3a1',
      '#F5A623', '#FFD700',
      '#4A6FA5', '#89b4fa',
      '#2A8040', '#C45C2A'
    ];

    const particles = [];
    const addBurst  = (originX, spread) => {
      for (let i = 0; i < 70; i++) {
        particles.push({
          x:             originX + (Math.random() - 0.5) * spread,
          y:             canvas.height * 0.75,
          vx:            (Math.random() - 0.5) * 9,
          vy:            -(Math.random() * 12 + 7),
          w:             Math.random() * 7 + 3,
          h:             Math.random() * 13 + 5,
          rotation:      Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.25,
          color:         COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha:         1
        });
      }
    };

    addBurst(canvas.width * 0.25, 60);
    addBurst(canvas.width * 0.75, 60);

    const GRAVITY  = 0.3;
    const DURATION = 3500;
    let   startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = elapsed / DURATION;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillVisible = false;

      for (const p of particles) {
        p.vy       += GRAVITY;
        p.x        += p.vx;
        p.y        += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha     = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.4);

        if (p.alpha > 0 && p.y < canvas.height + 40) {
          stillVisible = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (elapsed < DURATION && stillVisible) requestAnimationFrame(animate);
      else canvas.remove();
    };

    requestAnimationFrame(animate);
  }

  restartQuiz() { this.setMode('quiz'); }

  updateScore() {
    document.getElementById('score-val').textContent   = this.quizCorrect;
    document.getElementById('score-total').textContent = this.quizQueue.length;
  }

  // ── Edit mode ─────────────────────────────────────────────────────────────

  activateEditMode() {
    document.getElementById('edit-panel').style.display = 'block';
    document.getElementById('btn-explore').disabled = true;
    document.getElementById('btn-quiz').disabled    = true;
    const editBtn = document.getElementById('btn-edit');
    if (editBtn) editBtn.style.display = 'none';

    const badge = document.createElement('span');
    badge.id          = 'edit-badge';
    badge.textContent = 'EDIT MODE';
    document.getElementById('controls').appendChild(badge);

    for (const callout of this.data.callouts) {
      const btn = this.markers.get(callout.id);
      btn.classList.add('edit-mode');
      btn.title        = 'Drag to reposition "' + callout.label + '"';
      btn.onpointerdown = (e) => this.startDrag(e, callout, btn);
    }

    this.enableLabelReorder();
    this.updateJSONOutput();
  }

  // ── Label reorder — dispatch ──────────────────────────────────────────────

  enableLabelReorder() {
    if (this.layout === 'top-bottom') {
      this.enableTopBottomReorder();
    } else if (this.layout === 'dual-panel') {
      this.enableDualPanelReorder();
    } else {
      this.enableSidePanelReorder();
    }
  }

  // ── Side-panel: vertical drag reorder ────────────────────────────────────

  enableSidePanelReorder() {
    for (const row of this.labelRows.values()) {
      row.classList.add('reorder-enabled');
      const handle = row.querySelector('.drag-handle');
      handle.onpointerdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.startSidePanelReorder(e, row);
      };
    }
  }

  startSidePanelReorder(e, rowEl) {
    const rowRect     = rowEl.getBoundingClientRect();
    const dragOffsetY = e.clientY - rowRect.top;

    const ghost = rowEl.cloneNode(true);
    ghost.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:1000',
      'width:'  + rowRect.width + 'px',
      'left:'   + rowRect.left  + 'px',
      'top:'    + (e.clientY - dragOffsetY) + 'px',
      'opacity:0.85', 'background:white', 'border-radius:5px',
      'box-shadow:0 4px 14px rgba(0,0,0,0.2)',
      'padding:4px 5px', 'display:flex', 'align-items:center', 'gap:7px'
    ].join(';');
    document.body.appendChild(ghost);

    const indicator = document.createElement('div');
    indicator.className = 'reorder-indicator';

    rowEl.classList.add('dragging');
    let dropTarget = null;

    const onMove = (mv) => {
      ghost.style.top = (mv.clientY - dragOffsetY) + 'px';

      const siblings = [...this.labelPanel.querySelectorAll('.label-row')]
        .filter(r => r !== rowEl);
      dropTarget = null;
      for (const sib of siblings) {
        const rect = sib.getBoundingClientRect();
        if (mv.clientY < rect.top + rect.height / 2) { dropTarget = sib; break; }
      }

      if (dropTarget) this.labelPanel.insertBefore(indicator, dropTarget);
      else            this.labelPanel.appendChild(indicator);
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
      ghost.remove();
      indicator.remove();
      rowEl.classList.remove('dragging');

      if (dropTarget) this.labelPanel.insertBefore(rowEl, dropTarget);
      else            this.labelPanel.appendChild(rowEl);

      // Pass 1 — resolve all old-ID references BEFORE any IDs are changed,
      // so overlapping IDs during renumbering never cause find() to grab the
      // wrong callout (the bug that caused reorder results to silently corrupt).
      const domRows = [...this.labelPanel.querySelectorAll('.label-row')];
      const entries = domRows.map((row, idx) => ({
        row,
        newId:     idx + 1,
        callout:   this.data.callouts.find(c => c.id === parseInt(row.dataset.id)),
        markerBtn: this.markers.get(parseInt(row.dataset.id))
      }));

      // Pass 2 — update everything now that all references are locked in
      const newMarkers   = new Map();
      const newLabelRows = new Map();

      entries.forEach(({ row, newId, callout, markerBtn }) => {
        callout.id     = newId;
        row.dataset.id = String(newId);
        row.querySelector('.label-num').textContent = this.showNumbers ? newId : '';
        const textSpan = row.querySelector('.label-text');
        if (textSpan) textSpan.dataset.id = String(newId);

        markerBtn.dataset.id  = String(newId);
        markerBtn.textContent = this.showNumbers ? String(newId) : '';
        markerBtn.setAttribute('aria-label', callout.label);

        newMarkers.set(newId, markerBtn);
        newLabelRows.set(newId, row);
      });

      this.data.callouts.sort((a, b) => a.id - b.id);
      this.markers   = newMarkers;
      this.labelRows = newLabelRows;
      this.drawLeaders();
      this.updateJSONOutput();
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp);
  }

  // ── Dual-panel: vertical drag reorder + left/right toggle ────────────────

  enableDualPanelReorder() {
    for (const [id, row] of this.labelRows) {
      row.classList.add('reorder-enabled');

      // ←/→ button moves the label between left and right panels
      const callout  = this.data.callouts.find(c => c.id === id);
      const toggle   = document.createElement('button');
      toggle.className   = 'panel-toggle-btn';
      toggle.textContent = (callout.panel === 'left') ? '→' : '←';
      toggle.title       = (callout.panel === 'left') ? 'Move to right panel' : 'Move to left panel';
      toggle.onclick     = (e) => { e.stopPropagation(); this.toggleDualPanel(id); };
      row.appendChild(toggle);

      // Drag handle for vertical reorder within the same panel
      const handle = row.querySelector('.drag-handle');
      handle.onpointerdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parentPanel = row.parentElement;
        this.startDualPanelReorder(e, row, parentPanel);
      };
    }
  }

  toggleDualPanel(id) {
    const callout = this.data.callouts.find(c => c.id === id);
    const row     = this.labelRows.get(id);
    const toggle  = row.querySelector('.panel-toggle-btn');

    if (callout.panel === 'left') {
      callout.panel     = 'right';
      row.dataset.panel = 'right';
      toggle.textContent = '←';
      toggle.title       = 'Move to left panel';
      this.labelPanelRight.appendChild(row);
    } else {
      callout.panel     = 'left';
      row.dataset.panel = 'left';
      toggle.textContent = '→';
      toggle.title       = 'Move to right panel';
      this.labelPanelLeft.appendChild(row);
    }

    this.drawLeaders();
    this.updateJSONOutput();
  }

  startDualPanelReorder(e, rowEl, parentPanel) {
    const rowRect     = rowEl.getBoundingClientRect();
    const dragOffsetY = e.clientY - rowRect.top;

    const ghost = rowEl.cloneNode(true);
    ghost.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:1000',
      'width:'  + rowRect.width + 'px',
      'left:'   + rowRect.left  + 'px',
      'top:'    + (e.clientY - dragOffsetY) + 'px',
      'opacity:0.85', 'background:white', 'border-radius:5px',
      'box-shadow:0 4px 14px rgba(0,0,0,0.2)',
      'padding:4px 5px', 'display:flex', 'align-items:center', 'gap:7px'
    ].join(';');
    document.body.appendChild(ghost);

    const indicator = document.createElement('div');
    indicator.className = 'reorder-indicator';

    rowEl.classList.add('dragging');
    let dropTarget = null;

    const onMove = (mv) => {
      ghost.style.top = (mv.clientY - dragOffsetY) + 'px';

      const siblings = [...parentPanel.querySelectorAll('.label-row')]
        .filter(r => r !== rowEl);
      dropTarget = null;
      for (const sib of siblings) {
        const rect = sib.getBoundingClientRect();
        if (mv.clientY < rect.top + rect.height / 2) { dropTarget = sib; break; }
      }

      if (dropTarget) parentPanel.insertBefore(indicator, dropTarget);
      else            parentPanel.appendChild(indicator);
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
      ghost.remove();
      indicator.remove();
      rowEl.classList.remove('dragging');

      if (dropTarget) parentPanel.insertBefore(rowEl, dropTarget);
      else            parentPanel.appendChild(rowEl);

      this.drawLeaders();
      this.updateJSONOutput();
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp);
  }

  // ── Top-bottom: horizontal drag reorder + panel toggle ───────────────────

  enableTopBottomReorder() {
    for (const [id, row] of this.labelRows) {
      row.classList.add('reorder-enabled');

      // ↓/↑ button moves the label between top and bottom panels
      const callout  = this.data.callouts.find(c => c.id === id);
      const toggle   = document.createElement('button');
      toggle.className   = 'panel-toggle-btn';
      toggle.textContent = (callout.panel === 'bottom') ? '↑' : '↓';
      toggle.title       = (callout.panel === 'bottom') ? 'Move to top panel' : 'Move to bottom panel';
      toggle.onclick     = (e) => { e.stopPropagation(); this.toggleLabelPanel(id); };
      row.appendChild(toggle);

      // Drag handle for left/right reorder within the same panel
      const handle = row.querySelector('.drag-handle');
      handle.onpointerdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.startTopBottomReorder(e, row);
      };
    }
  }

  toggleLabelPanel(id) {
    const callout = this.data.callouts.find(c => c.id === id);
    const row     = this.labelRows.get(id);
    const toggle  = row.querySelector('.panel-toggle-btn');

    if (callout.panel === 'bottom') {
      callout.panel     = 'top';
      row.dataset.panel = 'top';
      toggle.textContent = '↓';
      toggle.title       = 'Move to bottom panel';
      this.labelPanelTop.appendChild(row);
    } else {
      callout.panel     = 'bottom';
      row.dataset.panel = 'bottom';
      toggle.textContent = '↑';
      toggle.title       = 'Move to top panel';
      this.labelPanelBottom.appendChild(row);
    }

    this.drawLeaders();
    this.updateJSONOutput();
  }

  startTopBottomReorder(e, rowEl) {
    const parentPanel  = rowEl.parentElement;
    const rowRect      = rowEl.getBoundingClientRect();
    const dragOffsetX  = e.clientX - rowRect.left;

    const ghost = rowEl.cloneNode(true);
    ghost.style.cssText = [
      'position:fixed', 'pointer-events:none', 'z-index:1000',
      'height:' + rowRect.height + 'px',
      'top:'    + rowRect.top + 'px',
      'left:'   + (e.clientX - dragOffsetX) + 'px',
      'opacity:0.85', 'background:white', 'border-radius:5px',
      'box-shadow:0 4px 14px rgba(0,0,0,0.2)',
      'display:inline-flex', 'align-items:center', 'gap:7px', 'padding:4px 8px'
    ].join(';');
    document.body.appendChild(ghost);

    // Vertical bar indicates insertion point between chips
    const indicator = document.createElement('div');
    indicator.className = 'reorder-indicator-v';

    rowEl.classList.add('dragging');
    let dropTarget = null;

    const onMove = (mv) => {
      ghost.style.left = (mv.clientX - dragOffsetX) + 'px';

      const siblings = [...parentPanel.querySelectorAll('.label-row')]
        .filter(r => r !== rowEl);
      dropTarget = null;
      for (const sib of siblings) {
        const rect = sib.getBoundingClientRect();
        if (mv.clientX < rect.left + rect.width / 2) { dropTarget = sib; break; }
      }

      if (dropTarget) parentPanel.insertBefore(indicator, dropTarget);
      else            parentPanel.appendChild(indicator);
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup',   onUp);
      ghost.remove();
      indicator.remove();
      rowEl.classList.remove('dragging');

      if (dropTarget) parentPanel.insertBefore(rowEl, dropTarget);
      else            parentPanel.appendChild(rowEl);

      this.drawLeaders();
      this.updateJSONOutput();
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup',   onUp);
  }

  // ── Marker drag (edit mode) ───────────────────────────────────────────────

  startDrag(e, callout, markerEl) {
    e.preventDefault();
    e.stopPropagation();
    markerEl.setPointerCapture(e.pointerId);

    // Capture offset so the marker doesn't snap to the cursor on first move
    const imgRect0 = this.imgEl.getBoundingClientRect();
    const offsetX  = callout.x - (e.clientX - imgRect0.left) / imgRect0.width  * 100;
    const offsetY  = callout.y - (e.clientY - imgRect0.top)  / imgRect0.height * 100;

    const onMove = (ev) => {
      const rect = this.imgEl.getBoundingClientRect();
      const x = Math.round(Math.max(0, Math.min(100, (ev.clientX - rect.left)  / rect.width  * 100 + offsetX)) * 10) / 10;
      const y = Math.round(Math.max(0, Math.min(100, (ev.clientY - rect.top)   / rect.height * 100 + offsetY)) * 10) / 10;

      callout.x = x;
      callout.y = y;
      markerEl.style.left = x + '%';
      markerEl.style.top  = y + '%';

      const hintSuffix = callout.hint ? '  |  ' + callout.hint : '';
      document.getElementById('coord-display').textContent =
        '"' + callout.label + '"' + hintSuffix + '  →  x: ' + x.toFixed(1) + ',  y: ' + y.toFixed(1);

      this.drawLeaders();
      this.updateJSONOutput();
    };

    const onUp = () => {
      markerEl.releasePointerCapture(e.pointerId);
      markerEl.removeEventListener('pointermove', onMove);
      markerEl.removeEventListener('pointerup',   onUp);
    };

    markerEl.addEventListener('pointermove', onMove);
    markerEl.addEventListener('pointerup',   onUp);
  }

  // ── JSON export ───────────────────────────────────────────────────────────

  updateJSONOutput() {
    // Build callouts array from current DOM order so that drag-reorder
    // in dual-panel and top-bottom layouts is preserved in the export.
    let orderedCallouts;
    if (this.layout === 'dual-panel' && this.labelPanelLeft && this.labelPanelRight) {
      const leftRows  = [...this.labelPanelLeft.querySelectorAll('.label-row')];
      const rightRows = [...this.labelPanelRight.querySelectorAll('.label-row')];
      const domOrder  = [...leftRows, ...rightRows];
      orderedCallouts = domOrder.map(row => {
        const id = parseInt(row.dataset.id);
        return { ...this.data.callouts.find(c => c.id === id) };
      });
    } else if (this.layout === 'top-bottom' && this.labelPanelTop && this.labelPanelBottom) {
      const topRows    = [...this.labelPanelTop.querySelectorAll('.label-row')];
      const bottomRows = [...this.labelPanelBottom.querySelectorAll('.label-row')];
      const domOrder   = [...topRows, ...bottomRows];
      orderedCallouts = domOrder.map(row => {
        const id = parseInt(row.dataset.id);
        return { ...this.data.callouts.find(c => c.id === id) };
      });
    } else {
      orderedCallouts = this.data.callouts.map(c => ({ ...c }));
    }

    // IMPORTANT: spread `this.data` first so every top-level field that the
    // sim author put in data.json is preserved on export. Earlier versions
    // of this method whitelisted only {title, orientation, image, callouts,
    // layout, showNumbers}, which silently dropped any new top-level field
    // (clickOnly, quizMode, quizPrompt, quizCorrect-bearing callouts, future
    // fields, etc.) every time the user used edit-mode "Copy JSON" to
    // recalibrate marker positions. That regression cost the digital-
    // devices-explorer sim its click-only and select-all-quiz behavior.
    // Spread-then-override is the safe pattern: unknown fields ride along
    // unchanged, and only `callouts` (the thing edit mode actually mutates)
    // is replaced with the freshly ordered version.
    const exportData = {
      ...this.data,
      callouts: orderedCallouts
    };
    // showNumbers may have been toggled in edit mode; reflect the live value.
    if (!this.showNumbers) exportData.showNumbers = false;
    else delete exportData.showNumbers;  // omit when default (true)
    document.getElementById('json-output').value = JSON.stringify(exportData, null, 2);
  }

  copyJSON() {
    const text = document.getElementById('json-output').value;
    navigator.clipboard.writeText(text).then(() => {
      const el = document.getElementById('copy-confirm');
      el.textContent = 'Copied!';
      setTimeout(() => { el.textContent = ''; }, 2000);
    }).catch(() => {
      document.getElementById('json-output').select();
      document.execCommand('copy');
      document.getElementById('copy-confirm').textContent = 'Copied!';
      setTimeout(() => { document.getElementById('copy-confirm').textContent = ''; }, 2000);
    });
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  showFatalError(msg) {
    document.body.innerHTML =
      '<p style="color:red;padding:20px;font-family:monospace;">DiagramSim error: ' + msg + '</p>';
  }
}

const sim = new DiagramSim();
document.addEventListener('DOMContentLoaded', () => sim.init());
