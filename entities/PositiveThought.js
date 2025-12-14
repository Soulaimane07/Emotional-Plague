// Classe représentant une pensée positive qui protège les zones et fuit le danger
class PositiveThought extends Vehicle {
  constructor(x, y) {
    super(x, y);                       // Hérite de Vehicle pour gérer position, vitesse, accélération
    this.color = color(0, 255, 100);   // Couleur verte symbolisant la positivité
    this.r = 15;                        // Rayon de la pensée
  }

  // Comportement de la pensée : fuir serpents et chercher zones sûres
  behave(emotions, serpents = [], zones = []) {
    let force = createVector(); // vecteur de force total à appliquer

    // Trouver le serpent le plus proche
    let nearestSerpent = null;
    let minDist = Infinity;
    for (let s of serpents) {
      let d = p5.Vector.dist(this.pos, s.segments[0]); // distance tête-serpent
      if (d < minDist) { 
        minDist = d; 
        nearestSerpent = s; 
      }
    }

    // Si un serpent est proche, fuir et chercher une zone sûre
    if (nearestSerpent && minDist < 150) {
      // Force de fuite du serpent
      let fleeForce = p5.Vector.sub(this.pos, nearestSerpent.segments[0]);
      fleeForce.setMag(this.maxForce * 2); // fuir plus vite que la force maximale normale
      force.add(fleeForce);

      // Chercher la zone la plus proche
      let nearestZone = null;
      let zoneDist = Infinity;
      for (let z of zones) {
        let d = p5.Vector.dist(this.pos, z.pos);
        if (d < zoneDist) { 
          zoneDist = d; 
          nearestZone = z; 
        }
      }

      // Arriver doucement à la zone (arrive)
      if (nearestZone) {
        let seekForce = this.arrive(nearestZone.pos);
        seekForce.setMag(this.maxForce);
        force.add(seekForce);
      }
    }

    // Appliquer toutes les forces calculées
    this.applyForce(force);
  }

  // Méthode d'approche douce vers une cible (arrive)
  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos); // vecteur vers la cible
    let d = desired.mag();                         // distance à la cible
    let speed = this.maxSpeed;
    if (d < 100) speed = map(d, 0, 100, 0, this.maxSpeed); // ralentir en approchant
    desired.setMag(speed);                          // ajuster la vitesse désirée
    let steer = p5.Vector.sub(desired, this.vel);  // calcul du vecteur de steering
    steer.limit(this.maxForce);                     // limiter la force
    return steer;
  }

  // Affichage graphique de la pensée positive
  show() {
    push();
    translate(this.pos.x, this.pos.y); // déplacer au centre de la pensée
    rotate(this.vel.heading());         // orienter selon la direction du mouvement
    fill(this.color);                  // couleur verte
    stroke(255);                       // contour blanc
    strokeWeight(1);
    ellipse(0, 0, this.r * 2);         // dessiner un cercle représentant la pensée
    pop();
  }
}
