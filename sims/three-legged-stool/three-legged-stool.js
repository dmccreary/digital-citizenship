// The Three-Legged Stool - Interactive Digital Citizenship MicroSim
// CANVAS_HEIGHT: 580
// A visual metaphor: Opportunities, Responsibilities, and Rights are the
// three legs of a digital citizen's stool. Remove one and it tips over.

let canvasWidth = 800;
let drawHeight = 400;
let infoHeight = 180;
let canvasHeight = drawHeight + infoHeight;
let margin = 20;

const legs = [
  {
    name: "Opportunities",
    color: "#2e6f8e",
    definition: "All the cool things you get to do because of the internet.",
    example: "Learn from videos, meet friends in a class, or share art with people far away."
  },
  {
    name: "Responsibilities",
    color: "#4a9c5b",
    definition: "The things you are expected to do to be a good online citizen.",
    example: "Being kind in comments and not sharing a classmate's photo without asking."
  },
  {
    name: "Rights",
    color: "#e0a93b",
    definition: "The protections that help keep you safe and treated fairly online.",
    example: "Having a say in what happens with your information, and asking for help when something is wrong."
  }
];

let selectedLeg = -1;
let hoveredLeg = -1;
let missingLeg = -1;
let legHitboxes = [];
let removeBtn = null;
let tiltAngle = 0;
let targetTilt = 0;

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
  tiltAngle = lerp(tiltAngle, targetTilt, 0.12);

  drawBackground();
  drawStool();
  drawInfoPanel();
}

function drawBackground() {
  noStroke();
  fill('#fdf6e3');
  rect(0, 0, canvasWidth, drawHeight);
  // Soft dot grid
  fill('#ead9b8');
  for (let x = 25; x < canvasWidth; x += 32) {
    for (let y = 25; y < drawHeight - 15; y += 32) {
      circle(x, y, 3);
    }
  }
}

function drawStool() {
  const cx = canvasWidth / 2;
  const seatY = 210;

  push();
  translate(cx, seatY);
  rotate(tiltAngle);

  // Draw back leg first, then seat, then front legs
  drawLeg(1, 0, 8, 150, true);  // center-back leg (Responsibilities)

  // Seat - ellipse for 3/4 view
  noStroke();
  fill('#6b4423');
  ellipse(0, 18, 280, 42);
  fill('#c8955a');
  ellipse(0, 0, 280, 42);
  // Wood grain
  stroke('#8b5a2b');
  strokeWeight(1);
  noFill();
  arc(-40, 0, 120, 26, -PI * 0.25, PI * 0.25);
  arc(60, 0, 100, 22, PI * 0.75, PI * 1.25);
  noStroke();

  // Student on top
  drawStudent(0, -20);

  // Front legs
  drawLeg(0, -115, 14, 150, false); // Opportunities (left-front)
  drawLeg(2, 115, 14, 150, false);  // Rights (right-front)

  pop();

  // Hitboxes (screen coordinates, no tilt applied — acceptable for upright default)
  legHitboxes = [
    { x: cx - 115 - 16, y: seatY + 14, w: 32, h: 155, index: 0 },
    { x: cx + 0 - 16,   y: seatY + 8,  w: 32, h: 155, index: 1 },
    { x: cx + 115 - 16, y: seatY + 14, w: 32, h: 155, index: 2 }
  ];
}

function drawLeg(index, offsetX, offsetY, height, isBack) {
  const leg = legs[index];
  const isMissing = index === missingLeg;
  const isSelected = index === selectedLeg;
  const isHovered = index === hoveredLeg;

  const legWidth = isBack ? 14 : 16;

  if (isMissing) {
    // Ghost outline
    noFill();
    stroke(leg.color);
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    rect(offsetX - legWidth / 2, offsetY, legWidth, height, 3);
    drawingContext.setLineDash([]);
    noStroke();
    // Still show label as ghost
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(12);
    fill(leg.color);
    text(leg.name, offsetX, offsetY + height + 18);
    return;
  }

  // Selection / hover highlight
  if (isSelected) {
    noFill();
    stroke('#ffd700');
    strokeWeight(4);
    rect(offsetX - legWidth / 2 - 5, offsetY - 4, legWidth + 10, height + 10, 5);
  } else if (isHovered) {
    noFill();
    stroke('#ffffff');
    strokeWeight(3);
    rect(offsetX - legWidth / 2 - 3, offsetY - 2, legWidth + 6, height + 6, 4);
  }

  // Leg body
  noStroke();
  fill(leg.color);
  rect(offsetX - legWidth / 2, offsetY, legWidth, height, 3);
  // Shading stripe on right side
  fill(shadeHex(leg.color, -30));
  rect(offsetX + legWidth / 2 - 4, offsetY, 4, height, 1);
  // Foot
  fill(shadeHex(leg.color, -40));
  ellipse(offsetX, offsetY + height, 30, 9);

  // Label
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(13);
  stroke('#000');
  strokeWeight(3);
  fill('#fff');
  text(leg.name, offsetX, offsetY + height - 18);
  noStroke();
  fill('#fff');
  text(leg.name, offsetX, offsetY + height - 18);
}

function shadeHex(hex, amount) {
  const c = color(hex);
  return color(
    constrain(red(c) + amount, 0, 255),
    constrain(green(c) + amount, 0, 255),
    constrain(blue(c) + amount, 0, 255)
  );
}

function drawStudent(x, y) {
  // Crossed legs
  noStroke();
  fill('#1e3a8a');
  ellipse(x - 12, y + 16, 38, 14);
  ellipse(x + 12, y + 16, 38, 14);

  // Torso (t-shirt)
  fill('#8b5cf6');
  rect(x - 20, y - 18, 40, 35, 8);

  // Arms
  // Left arm resting on knee
  stroke('#8b6a4f');
  strokeWeight(6);
  line(x - 18, y - 8, x - 26, y + 12);
  // Right arm with thumbs-up
  line(x + 18, y - 8, x + 30, y - 20);
  noStroke();
  fill('#8b6a4f');
  circle(x + 30, y - 24, 12);
  // Thumb
  stroke('#8b6a4f');
  strokeWeight(3);
  line(x + 30, y - 30, x + 30, y - 38);
  noStroke();

  // Head
  fill('#8b6a4f');
  circle(x, y - 36, 32);

  // Short hair
  fill('#3b2817');
  arc(x, y - 40, 34, 26, PI, TWO_PI);
  rect(x - 17, y - 40, 34, 4);

  // Eyes
  fill('#222');
  circle(x - 6, y - 36, 3);
  circle(x + 6, y - 36, 3);

  // Mouth - smile or worried based on stool state
  stroke('#2a1a0a');
  strokeWeight(1.8);
  noFill();
  if (missingLeg === -1) {
    arc(x, y - 30, 14, 7, 0, PI);
  } else {
    arc(x, y - 26, 12, 6, PI, TWO_PI);
  }
  noStroke();

  // Thought bubble with globe + wifi
  if (missingLeg === -1) {
    // Small bubble trail
    fill('#fff');
    stroke('#bbb');
    strokeWeight(1);
    circle(x + 22, y - 60, 6);
    circle(x + 30, y - 72, 9);
    // Main thought bubble
    fill('#fff');
    ellipse(x + 48, y - 92, 70, 50);
    noStroke();
    // Globe
    fill('#6ab7d6');
    circle(x + 48, y - 92, 28);
    // Continents
    fill('#4a9c5b');
    ellipse(x + 42, y - 96, 10, 7);
    ellipse(x + 53, y - 89, 9, 6);
    // Wifi arcs above globe
    stroke('#2e6f8e');
    strokeWeight(2);
    noFill();
    arc(x + 48, y - 92, 38, 38, -PI * 0.85, -PI * 0.65);
    arc(x + 48, y - 92, 48, 48, -PI * 0.82, -PI * 0.68);
    noStroke();
  }
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

  if (selectedLeg === -1) {
    fill('#1a3a6c');
    textSize(17);
    textStyle(BOLD);
    text("Click a leg to learn what holds up a digital citizen.", margin, y + 20);
    textStyle(NORMAL);
    textSize(14);
    fill('#555');
    text("Three things always travel together: Opportunities, Responsibilities, and Rights.",
         margin, y + 55, canvasWidth - 2 * margin);
    text("Like a stool, all three are needed to stay balanced.",
         margin, y + 85);
    fill('#888');
    textStyle(ITALIC);
    textSize(13);
    text("If even one leg is missing, the stool tips over.", margin, y + 120);
    removeBtn = null;
  } else {
    const leg = legs[selectedLeg];
    // Color swatch + title
    fill(leg.color);
    rect(margin, y + 18, 14, 22, 3);
    textSize(22);
    textStyle(BOLD);
    text(leg.name, margin + 24, y + 15);

    fill('#222');
    textSize(15);
    textStyle(NORMAL);
    text(leg.definition, margin, y + 55, canvasWidth - 2 * margin);

    fill('#555');
    textStyle(ITALIC);
    textSize(14);
    text("Example: " + leg.example, margin, y + 100, canvasWidth - 2 * margin);

    // Toggle button
    const btnW = 240;
    const btnH = 32;
    const btnX = canvasWidth - margin - btnW;
    const btnY = y + infoHeight - margin - btnH;
    removeBtn = { x: btnX, y: btnY, w: btnW, h: btnH };

    const isThisMissing = missingLeg === selectedLeg;
    fill(isThisMissing ? '#4a9c5b' : '#c1272d');
    rect(btnX, btnY, btnW, btnH, 6);
    fill('#fff');
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(BOLD);
    const btnLabel = isThisMissing
      ? "Put " + leg.name + " back"
      : "What if " + leg.name + " was missing?";
    text(btnLabel, btnX + btnW / 2, btnY + btnH / 2);
    textAlign(LEFT, TOP);
  }
}

function mouseMoved() {
  hoveredLeg = -1;
  let cursorSet = false;
  for (let hb of legHitboxes) {
    if (mouseX >= hb.x && mouseX <= hb.x + hb.w &&
        mouseY >= hb.y && mouseY <= hb.y + hb.h) {
      hoveredLeg = hb.index;
      cursor(HAND);
      cursorSet = true;
      break;
    }
  }
  if (!cursorSet && removeBtn &&
      mouseX >= removeBtn.x && mouseX <= removeBtn.x + removeBtn.w &&
      mouseY >= removeBtn.y && mouseY <= removeBtn.y + removeBtn.h) {
    cursor(HAND);
    cursorSet = true;
  }
  if (!cursorSet) cursor(ARROW);
}

function mousePressed() {
  // Button first
  if (removeBtn &&
      mouseX >= removeBtn.x && mouseX <= removeBtn.x + removeBtn.w &&
      mouseY >= removeBtn.y && mouseY <= removeBtn.y + removeBtn.h) {
    if (missingLeg === selectedLeg) {
      missingLeg = -1;
      targetTilt = 0;
    } else {
      missingLeg = selectedLeg;
      // Tilt toward the missing side
      const tilts = [-0.35, 0.18, 0.35];
      targetTilt = tilts[missingLeg];
    }
    return;
  }

  // Legs
  for (let hb of legHitboxes) {
    if (mouseX >= hb.x && mouseX <= hb.x + hb.w &&
        mouseY >= hb.y && mouseY <= hb.y + hb.h) {
      selectedLeg = hb.index;
      return;
    }
  }
}
