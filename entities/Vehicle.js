class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);

    this.maxSpeed = 2;
    this.maxForce = 0.1;
    this.r = 12;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  flee(target) {
    return this.seek(target).mult(-1);
  }

  wander() {
    let wanderForce = p5.Vector.random2D();
    wanderForce.setMag(this.maxForce * 0.7);
    return wanderForce;
  }

  separation(others) {
    let desiredSep = 40;
    let steer = createVector(0, 0);
    let count = 0;

    for (let o of others) {
      let d = p5.Vector.dist(this.pos, o.pos);
      if (d > 0 && d < desiredSep) {
        let diff = p5.Vector.sub(this.pos, o.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) steer.div(count);
    steer.limit(this.maxForce * 1.2);

    return steer;
  }

  avoidZone(zone) {
    let d = p5.Vector.dist(this.pos, zone.pos);
    if (d < zone.r + 20) {
      let flee = this.flee(zone.pos);
      flee.mult(1.5);
      return flee;
    }
    return createVector(0, 0);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  edges() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  show(col) {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    fill(col);
    stroke(255);
    strokeWeight(1);
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }
}
