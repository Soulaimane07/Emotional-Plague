let zones = [];
let emotions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  zones.push(new Zone(400, 300, "Memory"));
  zones.push(new Zone(800, 600, "Calm"));
  zones.push(new Zone(1200, 400, "Motivation"));

  for (let i = 0; i < 10; i++)
    emotions.push(new Emotion(random(width), random(height), "Fear"));

  for (let i = 0; i < 10; i++)
    emotions.push(new Emotion(random(width), random(height), "Anxiety"));

  for (let i = 0; i < 10; i++)
    emotions.push(new Emotion(random(width), random(height), "Doubt"));
}

function draw() {
  background(0);

  drawHUD(zones);

  zones.forEach(z => z.show());

  emotions.forEach(e => {
    e.behave(zones, emotions);
    e.update();
    e.edges();
    e.show(e.color);

    // Attack nearest zone
    let nearest = null;
    let minDist = 9999;
    for (let z of zones) {
      let d = p5.Vector.dist(e.pos, z.pos);
      if (d < minDist) { minDist = d; nearest = z; }
    }

    if (minDist < nearest.r)
      nearest.health = max(0, nearest.health - 0.05);
  });
}

function calculateDominance(zones) {
  // On calcule la moyenne des health des zones
  let totalHealth = zones.reduce((sum, z) => sum + z.health, 0);
  let avgHealth = totalHealth / zones.length;

  // La dominance des émotions toxiques = 100 - moyenne de la santé
  let dominance = 100 - avgHealth;
  return dominance;
}


function drawHUD(zones) {
  let total = zones.reduce((s, z) => s + z.health, 0) / zones.length;
  let dominance = calculateDominance(zones);

  push();
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  text("🧠 Brain Health: " + floor(total) + "%", 20, 20);
  text("☠️ Bad Emotions Dominance: " + floor(dominance) + "%", 20, 50);

  textSize(14);
  let y = 80;
  for (let z of zones) {
    text(z.name + ": " + floor(z.health) + "%", 20, y);
    y += 20;
  }
  pop();
}
