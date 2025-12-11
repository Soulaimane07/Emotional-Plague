# Emotional Plague
Les émotions sont des créatures vivantes · Steering Behaviors AI Game

```
Emotional Plague est un jeu expérimental où les émotions toxiques deviennent des créatures vivantes qui envahissent un cerveau stylisé et abstrait.
Le joueur incarne une petite Pensée Claire, chargée de rétablir l’équilibre émotionnel.

Le jeu repose entièrement sur des Steering Behaviors (Seek, Flee, Arrive, Wander, Separation, Obstacle Avoidance…) pour simuler le mouvement naturel, organique et poétique des émotions.

Aucun ennemi n’utilise un mouvement “fixe” : tout est basé sur des forces, des vecteurs, des réactions – comme un écosystème émotionnel vivant.
```

## Concept Narratif

```
Dans ce monde métaphorique :

La peur, la colère, l’anxiété et le doute sont des “émotions toxiques”, des créatures lumineuses qui cherchent les zones fragiles du cerveau.
Les pensées positives sont des entités protectrices qui t’accompagnent, utilisant des comportement d’arrive et de pursuit pour traquer les émotions toxiques.
Des zones cognitives (Mémoire, Motivation, Calme…) servent de points à défendre.
Le but du jeu est d’empêcher les émotions toxiques d’envahir totalement l’esprit.
```

## 🧬 Enemies & Behaviors
### 🔥 Émotions toxiques
```
Chaque émotion toxique (Rage, Peur, Anxiété, Doute) utilise :
    - Seek : cherche une zone cognitive vulnérable
    - Wander : mouvement organique instable
    - Separation : évite les autres émotions pour éviter les “amas mentaux”
    - Obstacle Avoidance : évite les zones lumineuses “saines”
    - Arrive : ralentit avant de s’installer dans une zone

Elles ont des comportements différents :
    - La Rage : seek agressif
    - L’Anxiété : wander + jitter
    - Le Doute : seek lent + séparation forte
    - La Peur : flee quand détecte trop de pensées positives
```

### 💡 Alliés : Pensées Positives
```
Elles aident automatiquement le joueur :
    - Pursuit : suivent les émotions toxiques pour les neutraliser
    - Arrive : se stabilisent autour des zones protégées
    - Flocking (optionnel) : se déplacent en groupe coordonné

Elles représentent ton “clarté mentale”.
```

### 🐍 Boss : The Burnout Serpent
```
Un ennemi majeur : un serpent émotionnel composite, symbole de surcharge mentale

Tête :
    - Pursuit du joueur
    - Obstacle avoidance
    - Seek zones cognitives majeures

Segments :
    - Follow the leader
    - Separation entre segments
    - Oscillation (micro jitter) pour donner un effet organique
    - Wander léger pour imprévisibilité

Plus le serpent perd de segments, plus il devient rapide et agressif.
```
