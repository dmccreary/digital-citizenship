// The Four-Wheeled Wagon - Interactive Digital Citizenship Habits MicroSim
// CANVAS_HEIGHT: 580
// A visual metaphor: the four habits of a digital citizen are four wheels
// on a wagon. All four are needed for the wagon to roll smoothly.

let canvasWidth = 800;
let drawHeight = 400;
let infoHeight = 180;
let canvasHeight = drawHeight + infoHeight;
let margin = 20;

const habits = [
  {
    name: "Etiquette",
    color: "#2e6f8e",
    definition: "Being kind and polite when you talk to others online.",
    example: "Saying 'please' in a chat, or waiting your turn in a group call."
  },
  {
    name: "Ethics",
    color: "#4a9c5b",
    definition: "Doing the right thing online, even when no one is watching.",
    example: "Not sharing a classmate's photo, even if it would be funny."
  },
  {
    name: "Law",
    color: "#e0a93b",
    definition: "Following the rules that keep you and others safe online.",
    example: "Only downloading games and music from places that are allowed."
  },
  {
    name: "Safety",
    color: "#e07a5f",
    definition: "Protecting yourself and your friends from online harm.",
    example: "Keeping your home address private and using strong passwords."
  }
];

let selectedHabit = -1;
let hoveredHabit = -1;
let wheelPositions = [];
let wheelRadius = 55;

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  updateCanvasSize();
  textFont('Segoe UI, Tahoma, sans-serif');
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;
  const w = mainEl.getBoundingClientRect().width;
  canvasWidth = Math.max(400, Math.min(900, Math.floor(w)));
  resizeCanvas(canvasWidth, canvasHeight);
}

function windowResized() {
  updateCanvasSize();
}

function draw() {
  drawSky();
  drawHills();
  drawGround();
  drawTrees();
  drawWagon();
  drawStudent();
  drawInfoPanel();
}

function drawSky() {
  noStroke();
  fill('#cfe8f5');
  rect(0, 0, canvasWidth, drawHeight - 80);
  // Sun
  fill('#fff5b0');
  circle(canvasWidth - 80, 60, 50);
}

function drawHills() {
  noStroke();
  fill('#8ec76a');
  arc(canvasWidth * 0.2, drawHeight - 60, 420, 180, PI, TWO_PI);
  fill('#76b85a');
  arc(canvasWidth * 0.75, drawHeight - 60, 520, 210, PI, TWO_PI);
}

function drawGround() {
  noStroke();
  fill('#9fd370');
  rect(0, drawHeight - 80, canvasWidth, 80);
  fill('#d9c29a');
  rect(0, drawHeight - 30, canvasWidth, 30);
}

function drawTrees() {
  drawMapleTree(70, drawHeight - 100);
  drawMapleTree(canvasWidth - 55, drawHeight - 110);
}

function drawMapleTree(x, y) {
  noStroke();
  fill('#6b4423');
  rect(x - 5, y, 10, 45);
  fill('#3d8b3d');
  circle(x, y, 42);
  circle(x - 15, y + 10, 32);
  circle(x + 15, y + 10, 32);
  fill('#4fa24f');
  circle(x - 4, y - 8, 26);
}

function drawWagon() {
  const wagonY = drawHeight - 90;
  const wagonWidth = 440;
  const wagonX = (canvasWidth - wagonWidth) / 2;

  // Handle
  stroke('#8b5a2b');
  strokeWeight(5);
  line(wagonX - 45, wagonY - 25, wagonX, wagonY + 12);
  noStroke();
  fill('#8b5a2b');
  circle(wagonX - 45, wagonY - 25, 14);

  // Wagon body
  fill('#c1272d');
  rect(wagonX, wagonY, wagonWidth, 50, 6);
  fill('#a3181f');
  rect(wagonX, wagonY + 30, wagonWidth, 20, 6);

  // Cargo: laptop, tablet, book
  fill('#505050');
  rect(wagonX + 40, wagonY - 25, 55, 25, 3);
  fill('#87ceeb');
  rect(wagonX + 43, wagonY - 22, 49, 19);

  fill('#2c2c2c');
  rect(wagonX + 170, wagonY - 30, 38, 30, 3);
  fill('#f4f4f4');
  rect(wagonX + 173, wagonY - 27, 32, 24);

  fill('#d4a017');
  rect(wagonX + 300, wagonY - 30, 50, 30, 2);
  fill('#fff');
  rect(wagonX + 305, wagonY - 27, 40, 3);
  rect(wagonX + 305, wagonY - 21, 40, 3);
  rect(wagonX + 305, wagonY - 15, 40, 3);

  // Wheels
  wheelPositions = [];
  const wheelY = wagonY + 55;
  const spacing = wagonWidth / 5;
  for (let i = 0; i < 4; i++) {
    const wx = wagonX + spacing * (i + 1);
    wheelPositions.push({ x: wx, y: wheelY, habit: i });
    drawWheel(wx, wheelY, habits[i], i === selectedHabit, i === hoveredHabit);
  }
}

function drawWheel(x, y, habit, isSelected, isHovered) {
  if (isSelected) {
    noFill();
    stroke('#ffd700');
    strokeWeight(5);
    circle(x, y, wheelRadius * 2 + 12);
  } else if (isHovered) {
    noFill();
    stroke('#ffffff');
    strokeWeight(3);
    circle(x, y, wheelRadius * 2 + 6);
  }

  noStroke();
  fill('#2a2a2a');
  circle(x, y, wheelRadius * 2);
  fill(habit.color);
  circle(x, y, wheelRadius * 2 - 12);
  fill('#f4f4f4');
  circle(x, y, 18);
  fill('#999');
  circle(x, y, 8);

  // Label on the wheel face
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  stroke('#000');
  strokeWeight(3);
  fill('#fff');
  text(habit.name, x, y + 28);
  noStroke();
  fill('#fff');
  text(habit.name, x, y + 28);
}

function drawStudent() {
  const wagonWidth = 440;
  const wagonX = (canvasWidth - wagonWidth) / 2;
  const sx = wagonX - 75;
  const sy = drawHeight - 125;

  // Legs
  stroke('#1e3a8a');
  strokeWeight(6);
  line(sx - 2, sy + 42, sx - 6, sy + 72);
  line(sx + 5, sy + 42, sx + 10, sy + 72);
  noStroke();
  fill('#ffffff');
  ellipse(sx - 6, sy + 74, 16, 6);
  ellipse(sx + 10, sy + 74, 16, 6);

  // Shirt
  fill('#8b5cf6');
  rect(sx - 12, sy + 15, 24, 30, 4);

  // Arm to handle
  stroke('#8b6a4f');
  strokeWeight(5);
  line(sx + 12, sy + 22, sx + 38, sy + 38);
  noStroke();

  // Head
  fill('#8b6a4f');
  circle(sx + 2, sy + 6, 22);

  // Braided hair
  fill('#3b2817');
  ellipse(sx + 2, sy - 4, 24, 11);
  rect(sx - 10, sy - 4, 4, 18, 2);
  rect(sx + 8, sy - 4, 4, 18, 2);

  // Smile
  stroke('#2a1a0a');
  strokeWeight(1.5);
  noFill();
  arc(sx + 2, sy + 10, 10, 6, 0, PI);
  noStroke();
  // Eyes
  fill('#222');
  circle(sx - 3, sy + 5, 2.5);
  circle(sx + 7, sy + 5, 2.5);
}

function drawInfoPanel() {
  const y = drawHeight;
  noStroke();
  fill('#fafafa');
  rect(0, y, canvasWidth, infoHeight);
  stroke('#d0d0d0');
  strokeWeight(1);
  line(0, y, canvasWidth, y);

  noStroke();
  textAlign(LEFT, TOP);

  if (selectedHabit === -1) {
    fill('#1a3a6c');
    textSize(17);
    textStyle(BOLD);
    text("Click a wheel to learn about one of the four habits.", margin, y + 20);
    textStyle(NORMAL);
    textSize(14);
    fill('#555');
    text("A digital citizen needs all four wheels to roll smoothly.",
         margin, y + 55);
    text("Etiquette, Ethics, Law, and Safety — each one matters.",
         margin, y + 80);
    fill('#888');
    textStyle(ITALIC);
    textSize(13);
    text("If one wheel is missing, the wagon tips over.",
         margin, y + 115);
  } else {
    const h = habits[selectedHabit];
    // Color swatch
    fill(h.color);
    rect(margin, y + 18, 14, 22, 3);
    fill(h.color);
    textSize(22);
    textStyle(BOLD);
    text(h.name, margin + 24, y + 15);

    fill('#222');
    textSize(15);
    textStyle(NORMAL);
    text(h.definition, margin, y + 60, canvasWidth - 2 * margin);

    fill('#555');
    textStyle(ITALIC);
    textSize(14);
    text("Example: " + h.example, margin, y + 110, canvasWidth - 2 * margin);
  }
}

function mouseMoved() {
  hoveredHabit = -1;
  for (let w of wheelPositions) {
    if (dist(mouseX, mouseY, w.x, w.y) <= wheelRadius) {
      hoveredHabit = w.habit;
      cursor(HAND);
      return;
    }
  }
  cursor(ARROW);
}

function mousePressed() {
  for (let w of wheelPositions) {
    if (dist(mouseX, mouseY, w.x, w.y) <= wheelRadius) {
      selectedHabit = w.habit;
      return;
    }
  }
}
