class Zone {
  constructor(x, y, name) {
    this.pos = createVector(x, y);
    this.r = 70;
    this.name = name;
    this.health = 100;
  }

  show() {
    push();
    noFill();
    stroke(255, 200, 0);
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.r * 2);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.name, this.pos.x, this.pos.y - 35);

    textSize(14);
    text("Health: " + floor(this.health) + "%", this.pos.x, this.pos.y + 10);
    pop();
  }
}
