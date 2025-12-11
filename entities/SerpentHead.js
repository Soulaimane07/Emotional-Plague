class SerpentHead extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.color = color(255, 165, 0);
    this.segments = [];
    this.target = createVector(width/2, height/2); // cible initiale
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  update() {
    let force = this.seek(this.target);
    this.applyForce(force);
    super.update();
    
    // mettre à jour les segments après déplacement de la tête
    this.segments.forEach((s, i) => {
      if(i === 0) s.follow(this.pos);
      else s.follow(this.segments[i-1].pos);
    });
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.color);
    noStroke();
    circle(0, 0, this.r*2);
    pop();
    this.segments.forEach(s => s.show());
  }
}
