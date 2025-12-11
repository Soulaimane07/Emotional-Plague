class Emotion extends Vehicle {
  constructor(x, y, type) {
    super(x, y);
    this.type = type;

    this.color = {
      "Fear": color(150, 150, 255),
      "Anxiety": color(255, 100, 100),
      "Doubt": color(180, 100, 255)
    }[type];
  }

  behave(zones, emotions) {
    let forces = [];

    // 1. Find nearest zone
    let nearest = null;
    let minDist = 999999;

    for (let z of zones) {
      let d = p5.Vector.dist(this.pos, z.pos);
      if (d < minDist) {
        minDist = d;
        nearest = z;
      }
    }

    // ▬▬▬▬▬ TYPE-SPECIFIC BEHAVIOR ▬▬▬▬▬

    if (this.type === "Fear") {
      forces.push(this.seek(nearest.pos)); 
      // Flees positivity (zones with > 80% health)
      if (nearest.health > 80) forces.push(this.flee(nearest.pos).mult(2));
    }

    if (this.type === "Anxiety") {
      forces.push(this.wander().mult(1.5));
      forces.push(p5.Vector.random2D().mult(0.1)); // jitter
      forces.push(this.seek(nearest.pos).mult(0.5));
    }

    if (this.type === "Doubt") {
      forces.push(this.seek(nearest.pos).mult(0.5)); // slow
      forces.push(this.separation(emotions).mult(2));
    }

    // Avoid all healthy (light) zones
    for (let z of zones) {
      if (z.health > 70) forces.push(this.avoidZone(z));
    }

    // Apply all forces
    for (let f of forces) this.applyForce(f);
  }
}
