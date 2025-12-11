// ---------- minimal steering-based Emotional Plague (game.js) ----------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

// -----------------------
// VECTOR CLASS
// -----------------------
class Vec {
  constructor(x, y) { this.x = x; this.y = y; }
  add(v) { this.x += v.x; this.y += v.y; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; return this; }
  mult(n) { this.x *= n; this.y *= n; return this; }
  limit(n) {
    const m = Math.hypot(this.x, this.y);
    if (m > n && m > 0) { this.mult(n / m); }
    return this;
  }
  copy() { return new Vec(this.x, this.y); }
  static sub(a, b) { return new Vec(a.x - b.x, a.y - b.y); }
}

// -----------------------
// BASE VEHICLE CLASS
// -----------------------
class Vehicle {
  constructor(x, y, color, maxSpeed = 2) {
    this.pos = new Vec(x, y);
    this.vel = new Vec(Math.random()*1-0.5, Math.random()*1-0.5);
    this.acc = new Vec(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = 0.12;
    this.color = color || "#fff";
    this.radius = 10;
  }
  applyForce(f) { this.acc.add(f); }
  update() {
    this.vel.add(this.acc).limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    // wrap
    if (this.pos.x < -50) this.pos.x = canvas.width + 50;
    if (this.pos.x > canvas.width + 50) this.pos.x = -50;
    if (this.pos.y < -50) this.pos.y = canvas.height + 50;
    if (this.pos.y > canvas.height + 50) this.pos.y = -50;
  }
  draw() {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(Math.atan2(this.vel.y, this.vel.x));
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
  seek(target) {
    const desired = Vec.sub(target, this.pos);
    desired.limit(this.maxSpeed);
    const steer = desired.sub(this.vel);
    steer.limit(this.maxForce);
    return steer;
  }
  arrive(target) {
    const desired = Vec.sub(target, this.pos);
    const d = Math.hypot(desired.x, desired.y);
    let m = this.maxSpeed;
    if (d < 80) m = this.maxSpeed * (d / 80);
    desired.limit(m);
    const steer = desired.sub(this.vel);
    steer.limit(this.maxForce);
    return steer;
  }
  flee(target) {
    const desired = Vec.sub(this.pos, target);
    const d = Math.hypot(desired.x, desired.y);
    if (d < 140) {
      desired.limit(this.maxSpeed);
      const steer = desired.sub(this.vel);
      steer.limit(this.maxForce * 1.2);
      return steer;
    }
    return new Vec(0,0);
  }
  wander() {
    const jitter = 0.25;
    return new Vec((Math.random()-0.5)*jitter, (Math.random()-0.5)*jitter);
  }
  separation(others) {
    let steer = new Vec(0,0), count = 0;
    others.forEach(o => {
      if (o === this) return;
      const dx = this.pos.x - o.pos.x, dy = this.pos.y - o.pos.y;
      const d = Math.hypot(dx, dy);
      if (d > 0 && d < 40) {
        let diff = new Vec(dx, dy);
        diff.mult(1 / d);
        steer.add(diff);
        count++;
      }
    });
    if (count > 0) steer.mult(1/count);
    steer.limit(this.maxForce);
    return steer;
  }
}

// -----------------------
// EMOTION (enemy)
// -----------------------
class Emotion extends Vehicle {
  constructor(x, y, type) {
    const colors = { rage:"#FF3A3A", fear:"#3A8CFF", anxiety:"#A455FF", doubt:"#B5B5B5" };
    super(x, y, colors[type] || "#FF3A3A", 1.6 + (Math.random()*0.8));
    this.type = type;
    this.radius = 9 + Math.random()*4;
  }
  updateBehavior(zones, player, positives, allEmotions) {
    let force = new Vec(0,0);
    // choose nearest zone
    let zone = zones[Math.floor(Math.random()*zones.length)];
    if (this.type === "rage") force.add(this.seek(zone.pos));
    if (this.type === "anxiety") force.add(this.wander());
    if (this.type === "doubt") force.add(this.arrive(zone.pos));
    if (this.type === "fear") force.add(this.flee(player.pos));
    // avoid positives
    positives.forEach(p => force.add(this.flee(p.pos)));
    // separation
    force.add(this.separation(allEmotions).mult(1.0));
    this.applyForce(force);
  }
}

// -----------------------
// POSITIVE THOUGHT
// -----------------------
class PositiveThought extends Vehicle {
  constructor(x, y) { super(x, y, "#FFFF88", 2.4); this.radius = 8; }
  updateBehavior(emotions) {
    let closest = null, minD=Infinity;
    emotions.forEach(e => {
      const d = Math.hypot(e.pos.x - this.pos.x, e.pos.y - this.pos.y);
      if (d < minD) { minD = d; closest = e; }
    });
    if (closest) this.applyForce(this.arrive(closest.pos));
    // slight separation among positives
  }
}

// -----------------------
// ZONES
// -----------------------
class Zone {
  constructor(x,y,label) { this.pos = new Vec(x,y); this.radius = 40; this.label = label; }
  draw() {
    ctx.save();
    ctx.strokeStyle = "rgba(0,255,179,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle = "rgba(0,255,179,0.02)";
    ctx.fill();
    ctx.restore();
  }
}

// -----------------------
// SERPENT BOSS (head + segments)
// -----------------------
class SerpentHead extends Vehicle {
  constructor(x,y) { super(x,y,"#FF00AA", 2.6); this.radius = 14; }
  pursuit(player) {
    const future = player.pos.copy().add(player.vel.copy().mult(8));
    return this.seek(future);
  }
  updateBehavior(player) {
    this.applyForce(this.pursuit(player));
    this.applyForce(this.wander());
  }
}
class SerpentSegment extends Vehicle {
  constructor(leader) { super(leader.pos.x, leader.pos.y, "#AA0077", 2.0); this.leader = leader; this.radius = 11; }
  updateBehavior() { this.applyForce(this.arrive(this.leader.pos)); }
}

// -----------------------
// GAME SETUP
// -----------------------
const player = new Vehicle(innerWidth/2, innerHeight/2, "#FFFFFF", 3.0);
player.radius = 12;

const emotions = [];
const positives = [];
const zones = [];

// zones
const zoneLabels = ["Mémoire","Motivation","Calme","Focus","Créativité"];
for (let i=0;i<zoneLabels.length;i++) {
  zones.push(new Zone(Math.random()*innerWidth, Math.random()*innerHeight, zoneLabels[i]));
}

// spawn emotions
["rage","fear","anxiety","doubt"].forEach(type => {
  for (let i=0;i<6;i++) emotions.push(new Emotion(Math.random()*innerWidth, Math.random()*innerHeight, type));
});

// positives
for (let i=0;i<5;i++) positives.push(new PositiveThought(innerWidth/2, innerHeight/2));

// serpent
const serpentHead = new SerpentHead(100,100);
const serpentSegments = [];
for (let i=0;i<6;i++) serpentSegments.push(new SerpentSegment(i===0?serpentHead:serpentSegments[i-1]));

// input
let keys = {};
addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// simple collision helper
function collided(a,b){ const d = Math.hypot(a.pos.x-b.pos.x, a.pos.y-b.pos.y); return d < a.radius + b.radius; }

// main loop
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // player control
  let ctrl = new Vec(0,0);
  if (keys["w"]) ctrl.y -= 0.35;
  if (keys["s"]) ctrl.y += 0.35;
  if (keys["a"]) ctrl.x -= 0.35;
  if (keys["d"]) ctrl.x += 0.35;
  player.applyForce(ctrl);
  player.update();
  player.draw();

  // draw zones
  zones.forEach(z => z.draw());

  // update positives
  positives.forEach(p => { p.updateBehavior(emotions); p.update(); p.draw(); });

  // update emotions
  emotions.forEach(e => { e.updateBehavior(zones, player, positives, emotions); e.update(); e.draw(); });

  // serpent
  serpentHead.updateBehavior(player);
  serpentHead.update();
  serpentHead.draw();
  serpentSegments.forEach(s=>{ s.updateBehavior(); s.update(); s.draw(); });

  // simple interactions - positives neutralize nearby emotions
  positives.forEach(p=>{
    emotions.forEach((e,i)=>{
      if (collided(p,e)) {
        // neutralize: remove emotion
        emotions.splice(i,1);
      }
    });
  });

  requestAnimationFrame(animate);
}
animate();
// --------------------------------------------------------------------
