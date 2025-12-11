class Zone {
  constructor(x, y, label) {
    this.pos = createVector(x, y);
    this.label = label;
    this.r = 50;
  }

  show() {
    push();
    noFill();
    stroke('yellow');
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.r * 2);
    fill('yellow');
    noStroke();
    textAlign(CENTER, CENTER);
    text(this.label, this.pos.x, this.pos.y);
    pop();
  }
}
