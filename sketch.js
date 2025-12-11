let zones = [];
let emotions = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    zones.push(new Zone(width/4, height/2, "Mémoire"));
    zones.push(new Zone(width/2, height/2, "Calme"));
    zones.push(new Zone(3*width/4, height/2, "Motivation"));

    emotions.push(new Emotion(random(width), random(height), 'red', zones[0]));
    emotions.push(new Emotion(random(width), random(height), 'blue', zones[0]));
}


function draw() {
    background(0);
    
    zones.forEach(zone => zone.show());
    
    emotions.forEach(e => {
        e.applyBehaviors();
        e.update();
        e.edges();
        e.show();
    });
}



