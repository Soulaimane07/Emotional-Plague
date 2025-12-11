class Emotion extends Vehicle {
  constructor(x, y, color, target) {
    super(x, y);
    this.color = color;
    this.target = target;
  }

  applyBehaviors() {
    let force = this.seek(this.target.pos);
    this.applyForce(force);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.color);
    circle(0, 0, this.r*2);
    pop();
  }
}

