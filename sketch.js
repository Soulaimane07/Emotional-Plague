// =====================
// MAIN SKETCH
// =====================
let zones = [];
let emotions = [];
let positives = [];

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

  for (let z of zones) {
    positives.push(new PositiveThought(z.pos.x + random(-100,100), z.pos.y + random(-100,100), z));
  }
}

function draw() {
  background(0);

  drawHUD(zones, emotions);

  zones.forEach(z => z.show());

  emotions.forEach(e => {
    e.behave(zones, emotions, positives); // pass positives
    e.update();
    e.edges();
    e.show(e.color);

    // Attack nearest zone
    let nearest = null;
    let minDist = Infinity;
    for (let z of zones) {
      let d = p5.Vector.dist(e.pos, z.pos);
      if (d < minDist) { minDist = d; nearest = z; }
    }
    if (minDist < nearest.r) {
      nearest.health = max(0, nearest.health - 0.05);
      e.damageDone = (e.damageDone || 0) + 0.05;
    }
  });


  positives.forEach(p => {
    p.behave(emotions);
    p.update();
    p.edges();
    p.show();
  });

}

// =====================
// CALCULATE EMOTION DOMINANCE
// =====================
function calculateEmotionDominanceOnBrain(emotions, zones) {
  let dominance = {"Fear": 0, "Anxiety": 0, "Doubt": 0};
  let totalBrainDamage = zones.length * 100 - zones.reduce((sum, z) => sum + z.health, 0);

  for (let e of emotions) {
    dominance[e.type] += e.damageDone || 0;
  }

  // Normalize so sum = 100%
  let sumDamage = dominance.Fear + dominance.Anxiety + dominance.Doubt;
  if (sumDamage > 0) {
    for (let type in dominance) {
      dominance[type] = (dominance[type] / sumDamage) * 100;
    }
  }

  return dominance;
}

// =====================
// HUD
// =====================
function drawHUD(zones, emotions) {
  let totalHealth = zones.reduce((s, z) => s + z.health, 0) / zones.length;
  let totalDominance = 100 - totalHealth;

  let emotionDominance = calculateEmotionDominanceOnBrain(emotions, zones);

  push();
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  text("🧠 Brain Health: " + floor(totalHealth) + "%", 20, 20);

  let y = 50;
  for (let z of zones) {
    text(z.name + ": " + floor(z.health) + "%", 20, y);
    y += 20;
  }

  y += 30;
  text("☠️ Bad Emotions Dominance: " + floor(totalDominance) + "%", 20, y);
  y += 30;

  textSize(16);
  for (let type in emotionDominance) {
    fill({
      "Fear": color(0, 100, 255),
      "Anxiety": color(200, 30, 30),
      "Doubt": color(120, 0, 120)
    }[type]);
    text(type + ": " + floor(emotionDominance[type]) + "%", 20, y);
    y += 20;
  }
  pop();
}