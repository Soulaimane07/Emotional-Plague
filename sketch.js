// Déclaration des tableaux pour stocker les différentes entités du jeu
let zones = [];       // Zones du cerveau (Memory, Calm, Motivation)
let emotions = [];    // Pensées négatives / émotions toxiques
let positives = [];   // Pensées positives
let serpents = [];    // Serpent représentant la dépression
let player;           // Joueur contrôlant une pensée positive

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  // on crée un canvas de 800px par 800px
  createCanvas(windowWidth, windowHeight); 

  // Création des zones du cerveau
  zones.push(new Zone(400, 300, "Memory"));
  zones.push(new Zone(800, 600, "Calm"));
  zones.push(new Zone(1200, 400, "Motivation"));

  // Création des émotions négatives : Fear, Anxiety, Doubt
  // 8 émotions négatives par type
  for (let i = 0; i < 8; i++)
    emotions.push(new Emotion(random(width), random(height), "Fear"));
  for (let i = 0; i < 8; i++)
    emotions.push(new Emotion(random(width), random(height), "Anxiety"));
  for (let i = 0; i < 8; i++)
    emotions.push(new Emotion(random(width), random(height), "Doubt"));

  // Création des pensées positives autour des zones
  for (let z of zones) {
    for (let i = 0; i < 5; i++) {
      positives.push(new PositiveThought(
        z.pos.x + random(-100, 100), 
        z.pos.y + random(-100, 100), 
        z
      ));
    }
  }

  // Création d'un serpent (dépression) au centre du canvas
  serpents.push(new Serpent(width/2, height/2 - 100));



  // Création du joueur
  player = new Player(width / 2, height / 2);

  // Création d'une pensée positive contrôlée par le joueur
  playerPositive = new PositiveThought(width/2, height - 100);
}



// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  // fond noir pour le canvas
  background(0);

  drawHUD(zones, emotions); // Affiche l'interface HUD

  // Affichage les zones
  zones.forEach(z => z.show());

  // Gestion des émotions
  emotions.forEach(e => {
    e.behave(zones, emotions, positives); // IA des émotions
    e.update();  // Mise à jour position
    e.edges();   // Gestion rebond ou wrap autour du canvas
    e.show(e.color); // Affichage

    // Attaque la zone la plus proche
    let nearest = null;
    let minDist = Infinity;
    for (let z of zones) {
      let d = p5.Vector.dist(e.pos, z.pos);
      if (d < minDist) { minDist = d; nearest = z; }
    }
    if (minDist < nearest.r) { // Si assez proche
      nearest.health = max(0, nearest.health - 0.05); // Réduit santé zone
      nearest.registerAttack(); // Compteur d'attaques
      e.damageDone = (e.damageDone || 0) + 0.05; // Mesure de dominance émotionnelle
    }
  });

  // Soigne légèrement les zones à chaque frame
  for (let z of zones) {
    z.heal();
  }

  // Gestion des pensées positives
  positives.forEach(p => {
    p.behave(emotions, serpents, zones);  // IA : fuit serpents, se rapproche zones
    p.update();
    p.edges();
    p.show();
  });

  // Gestion des serpents (dépression)
  for (let s of serpents) {
    s.behave(positives, zones); // Cherche pensées positives
    s.update();                 // Déplacement
    s.edges();                  // Wrap autour du canvas
    s.eat(positives, zones);    // Mange les pensées positives si possible
    s.show();                   // Affichage
  }

  // Contrôle du joueur (avec la souris ou clavier)
  player.moveMouse(mouseX, mouseY); // Déplacement souris
  // player.moveKeyboard();         // Déplacement clavier (optionnel)

  player.update();
  player.pushEmotions(emotions);    // Pousse les émotions négatives
  player.boostPositives(positives); // Protège les pensées positives
  player.show();                    // Affichage
}

// =====================
// CALCULATE EMOTION DOMINANCE
// =====================

// Calcule la domination des émotions sur le cerveau
function calculateEmotionDominanceOnBrain(emotions, zones) {
  let dominance = {"Fear": 0, "Anxiety": 0, "Doubt": 0};
  let totalBrainDamage = zones.length * 100 - zones.reduce((sum, z) => sum + z.health, 0);

  for (let e of emotions) {
    dominance[e.type] += e.damageDone || 0;
  }

  // Normalisation pour que la somme soit 100%
  let sumDamage = dominance.Fear + dominance.Anxiety + dominance.Doubt;
  if (sumDamage > 0) {
    for (let type in dominance) {
      dominance[type] = (dominance[type] / sumDamage) * 100;
    }
  }

  return dominance;
}





// =====================
// HUD
// =====================

// Affichage de l'interface utilisateur
function drawHUD(zones, emotions) {
  let totalHealth = zones.reduce((s, z) => s + z.health, 0) / zones.length;
  let totalDominance = 100 - totalHealth;

  let emotionDominance = calculateEmotionDominanceOnBrain(emotions, zones);

  // Sauvegarde état graphique
  push();              
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  
  // Santé globale du cerveau
  text("🧠 Brain Health: " + floor(totalHealth) + "%", 20, 30);

  // Affichage de la santé des zones
  let y = 60;
  for (let z of zones) {
    text(z.name + ": " + floor(z.health) + "%", 20, y);
    y += 20;
  }

  y += 30;
  // Dominance totale des émotions négatives
  text("☠️ Bad Emotions Dominance: " + floor(totalDominance) + "%", 20, y);

  // Message poétique à l’écran
  text("À chaque vague de tristesse, l’esprit s’affaiblit et ne peut plus renaître.", 450, 30);
  y += 30;

  // Affichage dominance par type d’émotion
  textSize(16);
  for (let type in emotionDominance) {
    fill({
      "Fear": color(0, 100, 255),
      "Anxiety": color(200, 30, 30),
      "Doubt": color(120, 0, 120)
    }[type]);
    text(type + ": " + floor(emotionDominance[type]) + "%", 20, y);
    y += 20;
  }

  fill(255, 255, 0);
  textSize(20);
  textAlign(RIGHT, TOP);
  pop();  // Restaure état graphique

  // Déplace et affiche la pensée positive du joueur
  playerPositive.pos.x = mouseX;
  playerPositive.pos.y = mouseY;
  playerPositive.show();

  // Protège les pensées positives proches de la pensée du joueur
  for (let p of positives) {
    let d = p5.Vector.dist(playerPositive.pos, p.pos);
    if (d < 80) {
      let pushForce = p5.Vector.sub(p.pos, playerPositive.pos).setMag(0.5);
      p.applyForce(pushForce); // pousse vers sécurité
    }
  }

  // Vérifie la fin de la partie si toutes les zones sont détruites
  if (floor(totalHealth) <= 0) {
    noLoop(); // Stop le jeu
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(64);
    text("💀 Game Over 💀", width/2, height/2);
  }
};
