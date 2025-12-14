class Zone {
  constructor(x, y, name) {
    this.pos = createVector(x, y);
    this.r = 70;
    this.name = name;
    this.health = 100;

    this.lastAttackFrame = 0;   // 👈 NEW
    this.healDelay = 180;       // 👈 frames (~3 seconds at 60fps)
  }

  registerAttack() {
    this.lastAttackFrame = frameCount;
  }

  heal() {
    if (this.health <= 0) return; // ❌ no revival

    // Heal only if not attacked recently
    if (frameCount - this.lastAttackFrame < this.healDelay) return;

    this.health = min(100, this.health + 0.02); // 🌱 slow regen
  }

  show() {
    push();

    let col;
    if (this.health > 60) col = color(0, 255, 60, 170);
    else if (this.health > 30) col = color(255, 150, 0, 240);
    else col = color(255, 40, 50, 250);

    noStroke();
    fill(col);
    circle(this.pos.x, this.pos.y, this.r * 2);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.name, this.pos.x, this.pos.y - 35);
    textSize(14);
    text("Health: " + floor(this.health) + "%", this.pos.x, this.pos.y + 10);

    pop();
  }
}
