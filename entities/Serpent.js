// Classe représentant le serpent, symbole de la dépression qui attaque les pensées positives
class Serpent {
  constructor(x, y) {
    this.segments = [];                 // Tableau de segments pour simuler un corps flexible
    this.segmentLength = 20;            // Distance fixe entre chaque segment
    this.segments.push(createVector(x, y)); // Position initiale de la tête
    this.vel = p5.Vector.random2D().mult(2); // Vitesse initiale aléatoire
    this.acc = createVector();          // Accélération initiale
    this.maxSpeed = 3.0;                // Vitesse maximale
    this.maxForce = 0.15;               // Force maximale pour le steering
    this.eatRadius = 20;                // Rayon d'attaque pour manger les pensées positives
    this.color = color(40, 40, 120, 220); // Couleur du serpent
  }

  // Comportement principal du serpent
  behave(positives, zones) {
    if (!positives || positives.length === 0) { 
      this.wander(); // Si aucune pensée positive, le serpent erre
      return;
    }

    // Cherche la pensée positive la plus proche, mais seulement celles en dehors des zones
    let nearest = null;
    let minD = Infinity;
    for (let p of positives) {
      let safe = true;
      for (let z of zones) {
        if (p5.Vector.dist(p.pos, z.pos) < z.r) safe = false; // pensée dans une zone sûre → ignorer
      }
      if (safe) {
        let d = p5.Vector.dist(this.segments[0], p.pos);
        if (d < minD) { minD = d; nearest = p; }
      }
    }

    // Applique la force pour aller vers la pensée positive la plus proche
    if (nearest) this.applyForce(this.seek(nearest.pos));

    // Évite les zones protégées
    for (let z of zones) {
      let d = p5.Vector.dist(this.segments[0], z.pos);
      if (d < z.r + 10) {
        let fleeForce = this.flee(z.pos);
        fleeForce.setMag(0.5);
        this.applyForce(fleeForce);
      }
    }
  } 

  // Applique une force sur le serpent (accélération)
  applyForce(f) {
    this.acc.add(f);
  }

  // Force de "seek" : aller vers une cible
  seek(target) {
    let desired = p5.Vector.sub(target, this.segments[0]); // vecteur vers la cible
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);          // vecteur de steering
    steer.limit(this.maxForce);                             // limite la force
    return steer;
  }

  // Errance aléatoire si rien à attaquer
  wander() {
    let wanderForce = p5.Vector.random2D().mult(0.05); 
    this.applyForce(wanderForce);
  }

  // Mise à jour de la position et suivi des segments
  update() {
    // Déplacer la tête
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.segments[0].add(this.vel);
    this.acc.mult(0); // réinitialisation de l'accélération

    // Chaque segment suit le segment précédent
    for (let i = 1; i < this.segments.length; i++) {
      let target = p5.Vector.sub(this.segments[i-1], this.segments[i]);
      let d = target.mag();
      if (d > this.segmentLength) {
        target.setMag(d - this.segmentLength);
        this.segments[i].add(target);
      }
    }

    // La vitesse du serpent augmente avec le nombre de pensées positives restantes
    this.maxSpeed = 2 + positives.length * 0.02;

    // Déplacement des segments (double boucle pour garantir la distance constante)
    for (let i = 1; i < this.segments.length; i++) {
      let target = p5.Vector.sub(this.segments[i-1], this.segments[i]);
      let d = target.mag();
      if (d > this.segmentLength) {
        target.setMag(d - this.segmentLength);
        this.segments[i].add(target);
      }
    }
  }

  // Wrap-around si la tête dépasse les bords de l’écran
  edges() {
    let head = this.segments[0];
    if (head.x > width) head.x = 0;
    if (head.x < 0) head.x = width;
    if (head.y > height) head.y = 0;
    if (head.y < 0) head.y = height;
  }

  // Manger les pensées positives proches qui ne sont pas dans une zone
  eat(positives, zones) {
    for (let i = positives.length - 1; i >= 0; i--) {
      let p = positives[i];
      let d = p5.Vector.dist(this.segments[0], p.pos);
      let inZone = zones.some(z => p5.Vector.dist(p.pos, z.pos) < z.r);
      if (d < this.eatRadius + p.r && !inZone) {
        positives.splice(i, 1); // supprime la pensée
        let last = this.segments[this.segments.length - 1].copy(); // ajoute un segment
        this.segments.push(last);
        break; // mange seulement une pensée par frame
      }
    }
  }

  // Force de fuite : s’éloigner d’une cible
  flee(target) {
    let desired = p5.Vector.sub(this.segments[0], target);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Affichage du serpent et de sa tête
  show() {
    push();
    noStroke();
    fill(this.color);

    // Dessiner tous les segments (la tête plus grande)
    for (let i = this.segments.length - 1; i >= 0; i--) {
      let s = this.segments[i];
      let size = map(i, 0, this.segments.length - 1, 30, 10); // tête plus grande
      ellipse(s.x, s.y, size);
    }

    // Yeux de la tête
    let head = this.segments[0];
    fill(20);
    let eyeOffset = 6;
    ellipse(head.x - eyeOffset, head.y - 3, 6);
    ellipse(head.x + eyeOffset, head.y - 3, 6);

    // Étiquette
    fill(220);
    textAlign(CENTER);
    textSize(12);
    text("Depression", head.x, head.y + 20);

    pop();
  }
}
