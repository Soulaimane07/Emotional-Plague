class PositiveThought extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.color = color(0, 255, 100); // greenish protective
    this.r = 15;
  }

  behave(emotions) {
    let nearest = null;
    let minDist = Infinity;

    // Find nearest toxic emotion
    for (let e of emotions) {
      let d = p5.Vector.dist(this.pos, e.pos);
      if (d < minDist) { minDist = d; nearest = e; }
    }

    if (nearest) {
      // Pursuit: target predicted position
      let future = p5.Vector.add(nearest.pos, nearest.vel.copy().mult(10));
      let arriveForce = this.arrive(future);
      this.applyForce(arriveForce);

      // Reduce emotion damage if reached
      if (minDist < this.r + 12) { // 12 = emotion radius
        nearest.damageDone = max(0, (nearest.damageDone || 0) - 0.2);
        // Push emotion away slightly
        let push = p5.Vector.sub(nearest.pos, this.pos).setMag(0.5);
        nearest.applyForce(push);
      }
    }
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) speed = map(d, 0, 100, 0, this.maxSpeed);
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    fill(this.color);
    stroke(255);
    strokeWeight(1);
    ellipse(0, 0, this.r * 2); // ellipse shape for positives
    pop();
  }
}