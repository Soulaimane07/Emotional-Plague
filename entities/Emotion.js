// Classe représentant une émotion négative qui attaque les zones et réagit aux pensées positives
class Emotion extends Vehicle {
  constructor(x, y, type) {
    super(x, y);         // hérite de Vehicle (position, vitesse, forces)
    this.type = type;    // type d'émotion : "Fear", "Anxiety" ou "Doubt"

    // Couleurs spécifiques pour chaque émotion
    const EMOTION_COLORS = {
      "Fear": color(0, 100, 255),      // bleu foncé
      "Anxiety": color(200, 30, 30),   // rouge profond
      "Doubt": color(120, 0, 120)      // violet sombre
    };

    // Attribue la couleur selon le type
    this.color = EMOTION_COLORS[type];
  }

  // Comportement de l'émotion à chaque frame
  behave(zones, emotions, positives) {
    let forces = []; // tableau pour accumuler toutes les forces appliquées

    // 1️⃣ Trouver la zone la plus proche
    let nearest = null;
    let minDist = 999999;
    for (let z of zones) {
      let d = p5.Vector.dist(this.pos, z.pos);
      if (d < minDist) {
        minDist = d;
        nearest = z;
      }
    }

    // ▬▬▬▬ Comportements spécifiques selon le type d'émotion ▬▬▬▬
    if (this.type === "Fear") {
      forces.push(this.seek(nearest.pos));          // va vers la zone
      if (nearest.health > 80)                      // mais fuit si zone trop saine
        forces.push(this.flee(nearest.pos).mult(2));
    }

    if (this.type === "Anxiety") {
      forces.push(this.wander().mult(1.5));         // vagabonde un peu
      forces.push(p5.Vector.random2D().mult(0.1)); // léger jitter
      forces.push(this.seek(nearest.pos).mult(0.5));// avance vers la zone plus lentement
    }

    if (this.type === "Doubt") {
      forces.push(this.seek(nearest.pos).mult(0.5)); // avance lentement vers zone
      forces.push(this.separation(emotions).mult(2));// garde distance des autres émotions
    }

    // ▬▬▬▬ Fuit les pensées positives proches ▬▬▬▬
    if (positives && positives.length > 0) {
      for (let p of positives) {
        let d = p5.Vector.dist(this.pos, p.pos);
        if (d < 120) { // rayon de fuite
          let fleeForce = p5.Vector.sub(this.pos, p.pos); // direction opposée
          fleeForce.setMag(this.maxForce * 2);           // force plus forte
          forces.push(fleeForce);
        }
      }
    }

    // ▬▬▬▬ Évite les zones très saines ▬▬▬▬
    for (let z of zones) {
      if (z.health > 70) forces.push(this.avoidZone(z));
    }

    // Applique toutes les forces calculées à la vélocité
    for (let f of forces) this.applyForce(f);
  }
}
