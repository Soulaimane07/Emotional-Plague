class PositiveThought extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.color = color(0, 255, 100);
    this.r = 15;
  }

  behave(emotions, serpents) {
    let nearestEmotion = null;
    let minDist = Infinity;

    // Seek / fight emotions
    for (let e of emotions) {
      let d = p5.Vector.dist(this.pos, e.pos);
      if (d < minDist) { 
        minDist = d; 
        nearestEmotion = e; 
      }
    }

    if (nearestEmotion) {
      let future = p5.Vector.add(nearestEmotion.pos, nearestEmotion.vel.copy().mult(10));
      let arriveForce = this.arrive(future);
      this.applyForce(arriveForce);

      if (minDist < this.r + 12) {
        nearestEmotion.damageDone = max(0, (nearestEmotion.damageDone || 0) - 0.2);
        let push = p5.Vector.sub(nearestEmotion.pos, this.pos).setMag(0.5);
        nearestEmotion.applyForce(push);
      }
    }

    // Flee serpents
    if (serpents) {
      for (let s of serpents) {
        let d = p5.Vector.dist(this.pos, s.segments[0]);
        if (d < 150) { // flee radius
          let fleeForce = p5.Vector.sub(this.pos, s.segments[0]);
          fleeForce.setMag(this.maxForce * 2);
          this.applyForce(fleeForce);
        }
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
    ellipse(0, 0, this.r * 2);
    pop();
  }
}
