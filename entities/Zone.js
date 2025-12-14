// Classe représentant une zone du cerveau (Memory, Calm, Motivation)
class Zone {
  constructor(x, y, name) {
    this.pos = createVector(x, y); // Position de la zone
    this.r = 70;                    // Rayon de la zone
    this.name = name;               // Nom de la zone
    this.health = 100;              // Santé initiale (100%)

    this.lastAttackFrame = 0;   // Numéro de frame de la dernière attaque reçue
    this.healDelay = 60;       // Délai avant régénération en frames (~3 sec si 60fps)
  }

  // Enregistre qu'une attaque a eu lieu, pour bloquer la régénération temporairement
  registerAttack() {
    this.lastAttackFrame = frameCount;
  }

  // Régénère la santé si assez de temps s'est écoulé depuis la dernière attaque
  heal() {
    // Si la zone a été attaquée récemment, ne régénère pas
    if (frameCount - this.lastAttackFrame < this.healDelay) return;

    // Régénération lente de la santé (0.02 par frame)
    this.health = min(100, this.health + 0.02);
  }

  // Affiche la zone sur le canvas
  show() {
    push(); // Sauvegarde l'état graphique

    // Couleur selon la santé
    let col;
    if (this.health > 60) col = color(0, 255, 60, 170);       // Vert clair → sain
    else if (this.health > 30) col = color(255, 150, 0, 240); // Orange → fragile
    else col = color(255, 40, 50, 250);                       // Rouge → critique

    noStroke();
    fill(col);
    circle(this.pos.x, this.pos.y, this.r * 2); // Dessine le cercle de la zone

    // Affiche le nom de la zone
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.name, this.pos.x, this.pos.y - 35);

    // Affiche la santé en pourcentage
    textSize(14);
    text("Health: " + floor(this.health) + "%", this.pos.x, this.pos.y + 10);

    pop(); // Restaure l'état graphique
  }
}
