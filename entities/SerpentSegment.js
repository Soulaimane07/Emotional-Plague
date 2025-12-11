class SerpentSegment extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.color = color(255, 140, 0);
  }

  follow(targetPos) {
    let force = this.seek(targetPos);
    this.applyForce(force);
    this.update();
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.color);
    noStroke();
    circle(0, 0, this.r*1.5);
    pop();
  }
}
