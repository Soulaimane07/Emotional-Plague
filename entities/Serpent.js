class Serpent {
  constructor(x, y) {
    this.segments = [];        // array of positions (vectors)
    this.segmentLength = 20;   // distance between dots
    this.segments.push(createVector(x, y)); // head
    this.vel = p5.Vector.random2D().mult(2);
    this.acc = createVector();
    this.maxSpeed = 3.0;
    this.maxForce = 0.15;
    this.eatRadius = 20;
    this.color = color(40, 40, 120, 220);
  }

  behave(positives) {
    if (!positives || positives.length === 0) {
      this.wander();
      return;
    }

    // Seek nearest positive
    let nearest = null;
    let minD = Infinity;
    for (let p of positives) {
      let d = p5.Vector.dist(this.segments[0], p.pos);
      if (d < minD) { minD = d; nearest = p; }
    }

    if (nearest) {
      this.applyForce(this.seek(nearest.pos));
    }
  }

  applyForce(f) {
    this.acc.add(f);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.segments[0]);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  wander() {
    let wanderForce = p5.Vector.random2D().mult(0.05);
    this.applyForce(wanderForce);
  }

  update() {
    // Move head
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.segments[0].add(this.vel);
    this.acc.mult(0);

    // Move each segment to follow the previous one
    for (let i = 1; i < this.segments.length; i++) {
      let target = p5.Vector.sub(this.segments[i-1], this.segments[i]);
      let d = target.mag();
      if (d > this.segmentLength) {
        target.setMag(d - this.segmentLength);
        this.segments[i].add(target);
      }
    }

    this.maxSpeed = 2 + positives.length * 0.02;

  // move segments
  for (let i = 1; i < this.segments.length; i++) {
    let target = p5.Vector.sub(this.segments[i-1], this.segments[i]);
    let d = target.mag();
    if (d > this.segmentLength) {
      target.setMag(d - this.segmentLength);
      this.segments[i].add(target);
    }
  }
  }

  edges() {
    // wrap-around for head
    let head = this.segments[0];
    if (head.x > width) head.x = 0;
    if (head.x < 0) head.x = width;
    if (head.y > height) head.y = 0;
    if (head.y < 0) head.y = height;
  }

  eat(positives) {
    for (let i = positives.length - 1; i >= 0; i--) {
      let p = positives[i];
      let d = p5.Vector.dist(this.segments[0], p.pos);
      if (d < this.eatRadius + p.r) {
        // Eat the positive
        positives.splice(i, 1);
        // Add new segment at the last segment's position
        let last = this.segments[this.segments.length - 1].copy();
        this.segments.push(last);

        // Damage zones slightly
        for (let z of zones) {
          z.health = max(0, z.health - 0.5);
        }
        break; // eat only one per frame
      }
    }
  }

  show() {
    push();
    noStroke();
    fill(this.color);

    // Draw all segments
    for (let i = this.segments.length - 1; i >= 0; i--) {
      let s = this.segments[i];
      let size = map(i, 0, this.segments.length - 1, 30, 10); // head bigger
      ellipse(s.x, s.y, size);
    }

    // Optional eyes on head
    let head = this.segments[0];
    fill(20);
    let eyeOffset = 6;
    ellipse(head.x - eyeOffset, head.y - 3, 6);
    ellipse(head.x + eyeOffset, head.y - 3, 6);

    // Label
    fill(220);
    textAlign(CENTER);
    textSize(12);
    text("Depression", head.x, head.y + 20);

    pop();
  }
}
