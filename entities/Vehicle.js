// Classe de base pour tous les véhicules mobiles (émotions, pensées, serpents)
class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);        // Position actuelle du véhicule
    this.vel = p5.Vector.random2D();      // Vitesse initiale aléatoire
    this.acc = createVector(0, 0);        // Accélération initiale (sera modifiée par les forces)

    this.maxSpeed = 2;                     // Vitesse maximale
    this.maxForce = 0.1;                   // Force maximale appliquée pour le steering
    this.r = 12;                           // Taille du véhicule pour l'affichage
  }

  // Applique une force sur le véhicule (ajoute à l'accélération)
  applyForce(f) {
    this.acc.add(f);
  }

  // Comportement "seek" : aller vers une cible
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos); // vecteur vers la cible
    desired.setMag(this.maxSpeed);                 // vitesse souhaitée
    let steer = p5.Vector.sub(desired, this.vel); // vecteur de steering
    steer.limit(this.maxForce);                    // limite la force pour éviter des mouvements trop brusques
    return steer;
  }

  // Comportement "flee" : fuir une cible
  flee(target) {
    return this.seek(target).mult(-1);            // inverse la direction de la force de seek
  }

  // Comportement "wander" : mouvement aléatoire léger
  wander() {
    let wanderForce = p5.Vector.random2D();       // direction aléatoire
    wanderForce.setMag(this.maxForce * 0.7);     // amplitude plus douce
    return wanderForce;
  }

  // Comportement de séparation : éviter les autres véhicules proches
  separation(others) {
    let desiredSep = 40;                          // distance minimale désirée
    let steer = createVector(0, 0);               // force de steering accumulée
    let count = 0;                                // nombre de voisins trop proches

    for (let o of others) {
      let d = p5.Vector.dist(this.pos, o.pos);   // distance entre ce véhicule et l'autre
      if (d > 0 && d < desiredSep) {             // si trop proche
        let diff = p5.Vector.sub(this.pos, o.pos); // vecteur direction opposée
        diff.normalize();                         // normalise
        diff.div(d);                              // plus proche → plus de force
        steer.add(diff);                           // ajoute au steering total
        count++;
      }
    }

    if (count > 0) steer.div(count);             // moyenne des forces si plusieurs voisins
    steer.limit(this.maxForce * 1.2);            // limite la force totale

    return steer;
  }

  // Évite les zones (ex. zones protégées ou positives)
  avoidZone(zone) {
    let d = p5.Vector.dist(this.pos, zone.pos); // distance à la zone
    if (d < zone.r + 20) {                      // si trop proche
      let flee = this.flee(zone.pos);           // force de fuite
      flee.mult(1.5);                           // amplifie pour s'éloigner plus vite
      return flee;
    }
    return createVector(0, 0);                  // pas de force si pas de danger
  }

  // Met à jour la position et la vitesse en appliquant l'accélération
  update() {
    this.vel.add(this.acc);        // ajout de l'accélération à la vitesse
    this.vel.limit(this.maxSpeed); // limite la vitesse
    this.pos.add(this.vel);        // mise à jour de la position
    this.acc.set(0, 0);            // réinitialise l'accélération pour le prochain frame
  }

  // Gère le rebord du canvas (wrap-around)
  edges() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  // Affiche le véhicule sous forme de triangle orienté selon la vitesse
  show(col) {
    push();                          // sauvegarde l'état graphique
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());       // rotation pour suivre la direction du mouvement
    fill(col);
    stroke(255);
    strokeWeight(1);
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0); // triangle représentant le véhicule
    pop();                           // restaure l'état graphique
  }
}
