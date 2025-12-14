// Classe représentant le joueur contrôlant les pensées positives
class Player {
  constructor(x, y) {
    // Position et vitesse du joueur
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    this.r = 18;        // rayon du joueur
    this.speed = 5;     // vitesse maximale de déplacement

    // Zones d'interaction avec les émotions et pensées positives
    this.pushRadius = 120;  // distance d'influence pour repousser les émotions
    this.pushForce = 0.6;   // force appliquée sur les émotions
    this.boostRadius = 80;   // distance pour booster les pensées positives

    this.color = color(100, 200, 255); // couleur du joueur
  }

  // ─────────────────────────────
  // Déplacements
  // ─────────────────────────────
  // Déplacement suivant la position de la souris
  moveMouse(x, y) {
    let target = createVector(x, y);
    let desired = p5.Vector.sub(target, this.pos); // vecteur vers la souris
    desired.limit(this.speed);                     // limiter la vitesse
    this.vel = desired;                            // appliquer la vitesse
  }

  // Déplacement via le clavier (WASD)
  moveKeyboard() {
    let dir = createVector(0, 0);

    if (keyIsDown(65)) dir.x -= 1; // A -> gauche
    if (keyIsDown(68)) dir.x += 1; // D -> droite
    if (keyIsDown(87)) dir.y -= 1; // W -> haut
    if (keyIsDown(83)) dir.y += 1; // S -> bas

    if (dir.mag() > 0) {
      dir.normalize().mult(this.speed); // direction unitaire * vitesse
      this.vel = dir;
    } else {
      this.vel.mult(0.8); // friction pour ralentir naturellement
    }
  }

  // Met à jour la position selon la vitesse
  update() {
    this.pos.add(this.vel);
    this.edges(); // empêche le joueur de sortir de l'écran
  }

  // Contrainte pour rester dans les limites de la fenêtre
  edges() {
    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    this.pos.y = constrain(this.pos.y, this.r, height - this.r);
  }

  // ─────────────────────────────
  // Interactions avec autres entités
  // ─────────────────────────────
  // Repousse les émotions proches
  pushEmotions(emotions) {
    for (let e of emotions) {
      let d = p5.Vector.dist(this.pos, e.pos); // distance joueur → émotion
      if (d < this.pushRadius) {
        let force = p5.Vector.sub(e.pos, this.pos); // vecteur de répulsion
        force.normalize();                           // direction
        force.mult(this.pushForce * (1 - d / this.pushRadius)); // plus proche = plus fort
        e.applyForce(force);                         // applique la force sur l'émotion
      }
    }
  }

  // Boost les pensées positives proches (vitesse + couleur)
  boostPositives(positives) {
    for (let p of positives) {
      let d = p5.Vector.dist(this.pos, p.pos);
      if (d < this.boostRadius) {
        p.maxSpeed = 6;                  // augmente vitesse temporairement
        p.color = color(0, 255, 150);    // change la couleur pour montrer le boost
      }
    }
  }

  // Affichage graphique du joueur
  show() {
    push();
    noStroke();

    // Cercle indiquant le rayon de poussée des émotions
    fill(100, 200, 255, 30);
    ellipse(this.pos.x, this.pos.y, this.pushRadius * 2);

    // Corps du joueur
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r * 2);

    pop();
  }
}
