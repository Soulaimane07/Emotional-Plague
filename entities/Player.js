class Player {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    this.r = 18;
    this.speed = 5;

    // Interaction ranges
    this.pushRadius = 120;
    this.pushForce = 0.6;
    this.boostRadius = 80;

    this.color = color(100, 200, 255);
  }

  // ─────────────────────────────
  // Movement
  // ─────────────────────────────
  moveMouse(x, y) {
    let target = createVector(x, y);
    let desired = p5.Vector.sub(target, this.pos);
    desired.limit(this.speed);
    this.vel = desired;
  }

  moveKeyboard() {
    let dir = createVector(0, 0);

    if (keyIsDown(65)) dir.x -= 1; // A
    if (keyIsDown(68)) dir.x += 1; // D
    if (keyIsDown(87)) dir.y -= 1; // W
    if (keyIsDown(83)) dir.y += 1; // S

    if (dir.mag() > 0) {
      dir.normalize().mult(this.speed);
      this.vel = dir;
    } else {
      this.vel.mult(0.8); // friction
    }
  }

  update() {
    this.pos.add(this.vel);
    this.edges();
  }

  edges() {
    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    this.pos.y = constrain(this.pos.y, this.r, height - this.r);
  }

  // ─────────────────────────────
  // Interactions
  // ─────────────────────────────
  pushEmotions(emotions) {
    for (let e of emotions) {
      let d = p5.Vector.dist(this.pos, e.pos);
      if (d < this.pushRadius) {
        let force = p5.Vector.sub(e.pos, this.pos);
        force.normalize();
        force.mult(this.pushForce * (1 - d / this.pushRadius));
        e.applyForce(force);
      }
    }
  }

  boostPositives(positives) {
    for (let p of positives) {
      let d = p5.Vector.dist(this.pos, p.pos);
      if (d < this.boostRadius) {
        p.maxSpeed = 6;
        p.color = color(0, 255, 150);
      }
    }
  }

  show() {
    push();
    noStroke();

    // Push radius
    fill(100, 200, 255, 30);
    ellipse(this.pos.x, this.pos.y, this.pushRadius * 2);

    // Player body
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2);

    pop();
  }
}