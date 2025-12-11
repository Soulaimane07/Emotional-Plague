class PositiveThought extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.color = color(0, 255, 0);
  }

  pursue(emotions) {
    if(emotions.length === 0) return;
    let targetEmotion = emotions[0];
    let force = this.seek(targetEmotion.pos);
    this.applyForce(force);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.color);
    circle(0, 0, this.r * 1.5);
    pop();
  }
}
