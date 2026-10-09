// Browser Window Tour - click the parts of a pretend web browser to learn their names
// CANVAS_HEIGHT: 500
// Bloom L1-L2 (Remember, Understand): students identify and name the address bar, the URL,
// the search box, and the page area. Clicking a part highlights it and shows a one-sentence
// explanation that uses the same wording as Chapter 1, so the MicroSim reinforces the
// chapter's definitions instead of introducing new ones.

let containerWidth;
let canvasWidth = 600;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 20;
let defaultTextSize = 16;

// the light blue glow named in the chapter specification
const HIGHLIGHT = '#4a8aab';

// Three example websites. The page area is a pretend page, not a copy of the real site.
const SITES = [
  { url: 'www.isd197.org', heading: 'Our School District', accent: 'steelblue', kind: 'school' },
  { url: 'www.nasa.gov', heading: 'Exploring Space', accent: 'midnightblue', kind: 'space' },
  { url: 'kids.nationalgeographic.com', heading: 'Animals and Nature', accent: 'darkgoldenrod', kind: 'nature' }
];

// Explanations use the chapter's own sentences
const PARTS = {
  address: { name: 'Address bar',
    text: 'The address bar is the strip at the top of a web browser where the URL lives.' },
  url: { name: 'URL',
    text: 'A URL is the address of a website.' },
  search: { name: 'Search box',
    text: 'A search engine is a special website that helps you find other websites when you don\'t know the URL.' },
  page: { name: 'Page area',
    text: 'A website is a place on the internet that you visit using a special app called a web browser.' }
};

let siteSelect, resetButton;
let selectedPart = null;    // 'address', 'url', 'search', 'page', or null
let found = {};             // parts the student has clicked so far

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  const mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  siteSelect = createSelect();
  siteSelect.parent(mainElement);
  for (const s of SITES) siteSelect.option(s.url);
  siteSelect.position(88, drawHeight + 13);

  resetButton = createButton('Reset');
  resetButton.parent(mainElement);
  resetButton.mousePressed(() => { selectedPart = null; found = {}; });
  positionControls();

  describe('A drawing of a web browser window with a title bar, an address bar showing a URL, a search box, and a page area. ' +
    'Click a part to highlight it and read what it is called and what it does. A dropdown changes the example website.', LABEL);
}

function positionControls() {
  resetButton.position(canvasWidth - 70, drawHeight + 13);
}

function currentSite() {
  return SITES[siteSelect.elt.selectedIndex];
}

// Work out where every part of the browser is for the current canvas width
function layout() {
  const bx = margin, by = 44, bw = canvasWidth - 2 * margin, bh = 290;
  const titleH = 30, toolH = 46;
  const searchW = constrain(bw * 0.24, 84, 170);
  const address = { x: bx + 62, y: by + titleH + 8, w: bw - 62 - searchW - 22, h: 30 };
  const search = { x: address.x + address.w + 10, y: address.y, w: searchW, h: 30 };
  // the URL text shrinks if the address bar is narrow
  let urlSize = 17;
  textSize(urlSize);
  while (textWidth(currentSite().url) > address.w - 46 && urlSize > 10) {
    urlSize -= 1;
    textSize(urlSize);
  }
  const url = { x: address.x + 28, y: address.y + 4, w: textWidth(currentSite().url) + 10, h: 22 };
  const page = { x: bx + 1, y: by + titleH + toolH, w: bw - 2, h: bh - titleH - toolH - 1 };
  return { bx, by, bw, bh, titleH, toolH, address, search, url, urlSize, page };
}

function inside(r) {
  return mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

// The URL sits inside the address bar, so it is tested first
function partUnderMouse(L) {
  if (inside(L.url)) return 'url';
  if (inside(L.address)) return 'address';
  if (inside(L.search)) return 'search';
  if (inside(L.page)) return 'page';
  return null;
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(24);
  text('Browser Window Tour', canvasWidth / 2, 10);

  const L = layout();
  const hovered = partUnderMouse(L);
  cursor(hovered ? HAND : ARROW);

  drawBrowser(L);
  drawPage(L);

  // hover and click highlights are drawn on top of the browser
  for (const key of ['page', 'search', 'address', 'url']) {
    const isSelected = selectedPart === key;
    if (!isSelected && hovered !== key) continue;
    const r = L[key];
    const glow = color(HIGHLIGHT);
    glow.setAlpha(isSelected ? 50 : 0);
    fill(glow);
    stroke(HIGHLIGHT);
    strokeWeight(isSelected ? 4 : 2);
    rect(r.x - 2, r.y - 2, r.w + 4, r.h + 4, key === 'page' ? 2 : 8);
  }

  drawLabelArea(L);

  // control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Website:', 12, drawHeight + 25);
}

function drawBrowser(L) {
  // window frame
  stroke('gray');
  strokeWeight(1.5);
  fill('white');
  rect(L.bx, L.by, L.bw, L.bh, 10);

  // title bar with close, minimize, and maximize buttons
  noStroke();
  fill('gainsboro');
  rect(L.bx + 1, L.by + 1, L.bw - 2, L.titleH, 9, 9, 0, 0);
  const dots = ['tomato', 'gold', 'limegreen'];
  for (let i = 0; i < dots.length; i++) {
    fill(dots[i]);
    circle(L.bx + 18 + i * 20, L.by + L.titleH / 2 + 1, 12);
  }
  // one open tab
  fill('whitesmoke');
  rect(L.bx + 84, L.by + 6, min(170, L.bw - 100), L.titleH - 5, 8, 8, 0, 0);
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textSize(13);
  text(currentSite().heading, L.bx + 94, L.by + L.titleH / 2 + 3);

  // toolbar
  fill('whitesmoke');
  rect(L.bx + 1, L.by + L.titleH, L.bw - 2, L.toolH);
  stroke('gray');
  strokeWeight(2.5);
  noFill();
  // back and forward arrows
  const ay = L.address.y + L.address.h / 2;
  line(L.bx + 14, ay, L.bx + 26, ay);
  line(L.bx + 14, ay, L.bx + 20, ay - 6);
  line(L.bx + 14, ay, L.bx + 20, ay + 6);
  line(L.bx + 36, ay, L.bx + 48, ay);
  line(L.bx + 48, ay, L.bx + 42, ay - 6);
  line(L.bx + 48, ay, L.bx + 42, ay + 6);

  // address bar
  stroke('darkgray');
  strokeWeight(1);
  fill('white');
  rect(L.address.x, L.address.y, L.address.w, L.address.h, 15);
  // small lock in front of the URL
  noStroke();
  fill('seagreen');
  rect(L.address.x + 11, ay - 2, 10, 8, 2);
  noFill();
  stroke('seagreen');
  strokeWeight(2);
  arc(L.address.x + 16, ay - 2, 7, 9, PI, TWO_PI);
  // the URL
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(L.urlSize);
  text(currentSite().url, L.url.x + 5, ay + 1);

  // search box with a magnifying glass
  stroke('darkgray');
  strokeWeight(1);
  fill('white');
  rect(L.search.x, L.search.y, L.search.w, L.search.h, 15);
  noFill();
  stroke('dimgray');
  strokeWeight(2);
  circle(L.search.x + 16, ay - 1, 10);
  line(L.search.x + 20, ay + 3, L.search.x + 25, ay + 8);
  noStroke();
  fill('gray');
  textSize(14);
  text('Search', L.search.x + 32, ay + 1);
}

// A pretend web page: a banner, a heading, some lines of text, and a picture
function drawPage(L) {
  const site = currentSite();
  const p = L.page;

  noStroke();
  fill('white');
  rect(p.x, p.y, p.w, p.h, 0, 0, 9, 9);

  // banner with a logo and the page heading
  fill(site.accent);
  rect(p.x, p.y, p.w, 44);
  fill('white');
  circle(p.x + 26, p.y + 22, 26);
  fill(site.accent);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text(site.heading.charAt(0), p.x + 26, p.y + 23);
  fill('white');
  textAlign(LEFT, CENTER);
  textSize(p.w < 420 ? 15 : 19);
  text(site.heading, p.x + 48, p.y + 23);
  textStyle(NORMAL);

  // gray bars stand in for lines of text
  const textW = p.w * 0.5;
  fill('lightgray');
  for (let i = 0; i < 5; i++) {
    rect(p.x + 16, p.y + 62 + i * 22, textW * (i % 2 === 0 ? 1 : 0.8), 10, 5);
  }
  fill(site.accent);
  rect(p.x + 16, p.y + 178, 90, 22, 11);

  // picture
  const ix = p.x + p.w * 0.6, iy = p.y + 58, iw = p.w * 0.36, ih = p.h - 74;
  if (site.kind === 'space') {
    fill('black');
    rect(ix, iy, iw, ih, 6);
    fill('white');
    for (let i = 0; i < 14; i++) {
      circle(ix + ((i * 53) % 100) / 100 * (iw - 10) + 5, iy + ((i * 37) % 100) / 100 * (ih - 10) + 5, 2 + (i % 3));
    }
    fill('orange');
    circle(ix + iw * 0.62, iy + ih * 0.52, min(iw, ih) * 0.42);
    stroke('wheat');
    strokeWeight(3);
    noFill();
    ellipse(ix + iw * 0.62, iy + ih * 0.52, min(iw, ih) * 0.72, min(iw, ih) * 0.2);
    noStroke();
  } else if (site.kind === 'nature') {
    fill('lightskyblue');
    rect(ix, iy, iw, ih, 6);
    fill('gold');
    circle(ix + iw * 0.8, iy + ih * 0.25, min(iw, ih) * 0.24);
    fill('forestgreen');
    arc(ix + iw * 0.35, iy + ih, iw * 0.9, ih * 1.1, PI, TWO_PI);
    fill('seagreen');
    arc(ix + iw * 0.75, iy + ih, iw * 0.7, ih * 0.7, PI, TWO_PI);
  } else {
    fill('lightskyblue');
    rect(ix, iy, iw, ih, 6);
    fill('yellowgreen');
    rect(ix, iy + ih * 0.8, iw, ih * 0.2, 0, 0, 6, 6);
    // school building with a door and a roof
    fill('indianred');
    rect(ix + iw * 0.2, iy + ih * 0.42, iw * 0.6, ih * 0.42);
    fill('saddlebrown');
    triangle(ix + iw * 0.14, iy + ih * 0.42, ix + iw * 0.86, iy + ih * 0.42, ix + iw * 0.5, iy + ih * 0.16);
    fill('white');
    rect(ix + iw * 0.44, iy + ih * 0.6, iw * 0.12, ih * 0.24);
  }
}

function drawLabelArea(L) {
  const x = margin, y = L.by + L.bh + 12;
  const w = canvasWidth - 2 * margin, h = drawHeight - y - 10;
  const narrow = w < 430;

  fill('white');
  stroke(selectedPart ? HIGHLIGHT : 'silver');
  strokeWeight(selectedPart ? 2 : 1);
  rect(x, y, w, h, 10);

  noStroke();
  textAlign(LEFT, TOP);
  if (!selectedPart) {
    fill('dimgray');
    textSize(narrow ? 15 : 18);
    text('Click a part of the browser to see what it is called.', x + 14, y + 12, w - 28, h - 20);
  } else {
    const part = PARTS[selectedPart];
    fill(HIGHLIGHT);
    textStyle(BOLD);
    textSize(narrow ? 17 : 20);
    text(part.name, x + 14, y + 9);
    textStyle(NORMAL);
    fill('black');
    textSize(narrow ? 14 : 17);
    text(part.text, x + 14, y + 36, w - 28, h - 40);
  }

  // progress: how many of the four parts have been found
  const count = Object.keys(found).length;
  fill('dimgray');
  textAlign(RIGHT, TOP);
  textSize(14);
  text('Found ' + count + ' of 4', x + w - 12, y + 10);
}

function mousePressed() {
  if (mouseY > drawHeight || mouseX < 0 || mouseX > canvasWidth || mouseY < 0) return;
  const part = partUnderMouse(layout());
  if (part) {
    selectedPart = part;
    found[part] = true;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
