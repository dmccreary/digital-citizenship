// Skeptic or Cynic? MicroSim
// Helps students tell the difference between a healthy skeptic (who asks
// good questions) and a cynic (who has given up on the truth).
// Explore mode: two side-by-side columns of sample phrases.
// Quiz mode: identify a single phrase as skeptic or cynic; 10 correct
// answers triggers a celebration animation.

// ---- Responsive canvas globals ----
let containerWidth;
let canvasWidth = 720;
let drawHeight = 520;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// ---- Data ----
let phrasesData;
let mode = 'explore'; // 'explore' or 'quiz'

// ---- Explore mode state ----
let exploreSkeptics = [];
let exploreCynics = [];

// ---- Quiz mode state ----
let quizPhrase = '';
let quizAnswer = null; // 'skeptic' | 'cynic'
let quizCorrect = 0;
let quizTotal = 0;
let quizFeedback = '';
let quizFeedbackColor = '#333';
let quizShowNextButton = false;

// ---- Celebration ----
let celebrating = false;
let celebrationParticles = [];
let celebrationStart = 0;

// ---- UI ----
let modeButton;
let moreButton;
let skepticButton;
let cynicButton;
let resetButton;
let nextButton;

function preload() {
  phrasesData = loadJSON('phrases.json');
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');
  textSize(defaultTextSize);

  modeButton = createButton('Switch to Quiz Mode');
  modeButton.mousePressed(toggleMode);

  moreButton = createButton('More...');
  moreButton.mousePressed(resampleExplore);

  skepticButton = createButton('Skeptic Phrase');
  skepticButton.mousePressed(() => answerQuiz('skeptic'));

  cynicButton = createButton('Cynic Phrase');
  cynicButton.mousePressed(() => answerQuiz('cynic'));

  resetButton = createButton('Reset Score');
  resetButton.mousePressed(resetQuiz);

  nextButton = createButton('Next Phrase');
  nextButton.mousePressed(newQuizPhrase);

  styleButton(modeButton, '#2e6f8e', 'white');
  styleButton(moreButton, '#4a9c5b', 'white');
  styleButton(skepticButton, '#2e6f8e', 'white');
  styleButton(cynicButton, '#e07a5f', 'white');
  styleButton(resetButton, '#888888', 'white');
  styleButton(nextButton, '#e0a93b', '#222');

  resampleExplore();
  newQuizPhrase();
  updateUI();

  describe('Interactive simulation with an explore mode and a quiz mode that helps students tell skeptical phrases apart from cynical phrases.', LABEL);
}

function styleButton(btn, bg, fg) {
  btn.style('background-color', bg);
  btn.style('color', fg);
  btn.style('border', 'none');
  btn.style('padding', '8px 14px');
  btn.style('border-radius', '6px');
  btn.style('cursor', 'pointer');
  btn.style('font-size', '14px');
  btn.style('font-family', 'Arial, Helvetica, sans-serif');
}

function updateUI() {
  // Mode button always in the control area
  modeButton.position(margin, drawHeight + 15);

  if (mode === 'explore') {
    moreButton.show();
    moreButton.position(margin + 230, drawHeight + 15);
    skepticButton.hide();
    cynicButton.hide();
    resetButton.hide();
    nextButton.hide();
  } else {
    moreButton.hide();
    resetButton.show();
    resetButton.position(margin + 230, drawHeight + 15);

    if (celebrating) {
      skepticButton.hide();
      cynicButton.hide();
      nextButton.hide();
    } else {
      skepticButton.show();
      cynicButton.show();
      // place answer buttons centered, a little above bottom of draw area
      skepticButton.position(canvasWidth / 2 - 170, drawHeight - 90);
      cynicButton.position(canvasWidth / 2 + 20, drawHeight - 90);
      if (quizShowNextButton) {
        nextButton.show();
        nextButton.position(canvasWidth / 2 - 55, drawHeight - 50);
      } else {
        nextButton.hide();
      }
    }
  }
}

function toggleMode() {
  mode = (mode === 'explore') ? 'quiz' : 'explore';
  modeButton.html(mode === 'explore' ? 'Switch to Quiz Mode' : 'Switch to Explore Mode');
  if (mode === 'quiz') {
    // fresh phrase when entering quiz
    newQuizPhrase();
  }
  updateUI();
}

// ---- Sampling ----
function sample(arr, n) {
  let shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

function resampleExplore() {
  if (!phrasesData) return;
  exploreSkeptics = sample(phrasesData.skeptic, 5);
  exploreCynics = sample(phrasesData.cynic, 5);
}

// ---- Quiz logic ----
function newQuizPhrase() {
  if (!phrasesData) return;
  let pool = [];
  phrasesData.skeptic.forEach(p => pool.push({ text: p, type: 'skeptic' }));
  phrasesData.cynic.forEach(p => pool.push({ text: p, type: 'cynic' }));
  let choice = pool[Math.floor(Math.random() * pool.length)];
  quizPhrase = choice.text;
  quizAnswer = choice.type;
  quizFeedback = '';
  quizShowNextButton = false;
  if (skepticButton) skepticButton.elt.disabled = false;
  if (cynicButton) cynicButton.elt.disabled = false;
  updateUI();
}

function answerQuiz(choice) {
  if (quizShowNextButton || celebrating) return;
  quizTotal++;
  if (choice === quizAnswer) {
    quizCorrect++;
    quizFeedback = 'Correct! That is a ' + quizAnswer + ' phrase.';
    quizFeedbackColor = '#1f7a38';
  } else {
    quizFeedback = 'Not quite. That one is a ' + quizAnswer + ' phrase.';
    quizFeedbackColor = '#b8003e';
  }
  quizShowNextButton = true;
  skepticButton.elt.disabled = true;
  cynicButton.elt.disabled = true;

  if (quizCorrect >= 10 && !celebrating) {
    celebrating = true;
    celebrationStart = millis();
    spawnCelebrationParticles();
  }
  updateUI();
}

function resetQuiz() {
  quizCorrect = 0;
  quizTotal = 0;
  celebrating = false;
  celebrationParticles = [];
  newQuizPhrase();
}

// ---- Draw loop ----
function draw() {
  // width-responsive
  let prevWidth = canvasWidth;
  updateCanvasSize();
  if (canvasWidth !== prevWidth) {
    resizeCanvas(canvasWidth, canvasHeight);
    updateUI();
  }

  // drawing area background
  noStroke();
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);

  // control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // borders
  noFill();
  stroke('silver');
  strokeWeight(1);
  rect(0.5, 0.5, canvasWidth - 1, drawHeight - 1);
  rect(0.5, drawHeight + 0.5, canvasWidth - 1, controlHeight - 1);
  noStroke();

  // title
  fill('#1a1a1a');
  textAlign(CENTER, TOP);
  textSize(28);
  textStyle(BOLD);
  text('Skeptic or Cynic?', canvasWidth / 2, margin - 4);
  textStyle(NORMAL);

  if (mode === 'explore') {
    drawExplore();
  } else {
    drawQuiz();
  }

  // reset defaults
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  noStroke();
}

// ---- Explore mode ----
function drawExplore() {
  textAlign(CENTER, TOP);
  textSize(14);
  fill('#444');
  text('A skeptic asks good questions. A cynic has given up on the truth.',
       canvasWidth / 2, margin + 32);

  let colTop = margin + 60;
  let colBottom = drawHeight - 20;
  let gap = 16;
  let colWidth = (canvasWidth - margin * 2 - gap) / 2;
  let leftX = margin;
  let rightX = margin + colWidth + gap;

  // column bodies
  noStroke();
  fill('#e6f2f8');
  rect(leftX, colTop, colWidth, colBottom - colTop, 10);
  fill('#fbe9e3');
  rect(rightX, colTop, colWidth, colBottom - colTop, 10);

  // column headers
  fill('#2e6f8e');
  rect(leftX, colTop, colWidth, 38, 10, 10, 0, 0);
  fill('#e07a5f');
  rect(rightX, colTop, colWidth, 38, 10, 10, 0, 0);

  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  fill('white');
  text('Skeptical Phrases', leftX + colWidth / 2, colTop + 19);
  text('Cynical Phrases', rightX + colWidth / 2, colTop + 19);
  textStyle(NORMAL);

  // phrase rows
  textAlign(LEFT, TOP);
  textSize(14);
  let listTop = colTop + 48;
  let listBottom = colBottom - 8;
  let listHeight = listBottom - listTop;
  let rowH = listHeight / 5;

  for (let i = 0; i < exploreSkeptics.length; i++) {
    let y = listTop + i * rowH;
    fill('#2e6f8e');
    noStroke();
    circle(leftX + 14, y + 12, 7);
    fill('#1a1a1a');
    text(exploreSkeptics[i], leftX + 26, y + 2, colWidth - 34, rowH - 4);
  }
  for (let i = 0; i < exploreCynics.length; i++) {
    let y = listTop + i * rowH;
    fill('#e07a5f');
    noStroke();
    circle(rightX + 14, y + 12, 7);
    fill('#1a1a1a');
    text(exploreCynics[i], rightX + 26, y + 2, colWidth - 34, rowH - 4);
  }
}

// ---- Quiz mode ----
function drawQuiz() {
  textAlign(CENTER, TOP);
  textSize(15);
  fill('#444');
  text('Read the phrase. Is it a skeptic or a cynic?',
       canvasWidth / 2, margin + 32);

  // score line
  textSize(18);
  textStyle(BOLD);
  fill('#2e6f8e');
  text('Score: ' + quizCorrect + ' correct / ' + quizTotal + ' tries',
       canvasWidth / 2, margin + 62);
  textStyle(NORMAL);

  // progress bar toward 10
  let barW = min(canvasWidth - margin * 4, 420);
  let barX = canvasWidth / 2 - barW / 2;
  let barY = margin + 94;
  noStroke();
  fill('#e0e0e0');
  rect(barX, barY, barW, 14, 7);
  fill('#4a9c5b');
  let prog = constrain(quizCorrect / 10, 0, 1);
  rect(barX, barY, barW * prog, 14, 7);
  fill('#333');
  textSize(12);
  text('Goal: 10 correct answers', canvasWidth / 2, barY + 20);

  // phrase box
  let boxY = margin + 140;
  let boxH = 150;
  let boxX = margin + 30;
  let boxW = canvasWidth - (margin + 30) * 2;
  fill('white');
  stroke('#ccc');
  strokeWeight(1);
  rect(boxX, boxY, boxW, boxH, 12);
  noStroke();
  fill('#222');
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(ITALIC);
  text('"' + (quizPhrase || '') + '"',
       boxX + 16, boxY, boxW - 32, boxH);
  textStyle(NORMAL);

  // feedback line
  if (quizFeedback) {
    fill(quizFeedbackColor);
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(quizFeedback, canvasWidth / 2, boxY + boxH + 18);
    textStyle(NORMAL);
  }

  // celebration overlay
  if (celebrating) {
    drawCelebration();
  }
}

// ---- Celebration ----
function spawnCelebrationParticles() {
  celebrationParticles = [];
  let palette = ['#2e6f8e', '#4a9c5b', '#e0a93b', '#e07a5f', '#7a5fa0'];
  for (let i = 0; i < 100; i++) {
    celebrationParticles.push({
      x: random(canvasWidth),
      y: random(-drawHeight, 0),
      vx: random(-1.2, 1.2),
      vy: random(2, 6),
      size: random(7, 15),
      color: palette[Math.floor(random(palette.length))],
      angle: random(TWO_PI),
      spin: random(-0.22, 0.22)
    });
  }
}

function drawCelebration() {
  // soft overlay
  noStroke();
  fill(255, 255, 255, 190);
  rect(0, 0, canvasWidth, drawHeight);

  // particles
  for (let p of celebrationParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.angle += p.spin;
    if (p.y > drawHeight + 20) {
      p.y = random(-40, -5);
      p.x = random(canvasWidth);
      p.vy = random(2, 6);
    }
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    fill(p.color);
    rect(-p.size / 2, -p.size / 4, p.size, p.size / 2, 2);
    pop();
  }

  // celebration message
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(42);
  fill('#2e6f8e');
  text('You did it!', canvasWidth / 2, drawHeight / 2 - 36);
  textSize(20);
  textStyle(NORMAL);
  fill('#1a1a1a');
  text('You got 10 correct. Great thinking like a skeptic!',
       canvasWidth / 2, drawHeight / 2 + 6);
  textSize(15);
  fill('#444');
  text('Click "Reset Score" below to play again.',
       canvasWidth / 2, drawHeight / 2 + 38);
}

// ---- Responsive sizing ----
function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  updateUI();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = max(containerWidth, 360);
}
