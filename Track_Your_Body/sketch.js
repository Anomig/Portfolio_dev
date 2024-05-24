let handposeModel;
let video;
let predictions = [];

let objects = [];

function setup() {
    createCanvas(640, 480);

    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    handposeModel = ml5.handpose(video, modelReady);
    handposeModel.on('predict', gotHandposes);
}

function modelReady() {
    console.log('Model loaded!');
}

function gotHandposes(results) {
    predictions = results;
}

function draw() {
    image(video, 0, 0, width, height);

    for (let i = 0; i < predictions.length; i++) {
        let hand = predictions[i].annotations;

        // Teken een cirkel op de positie van elke vinger
        for (let j = 0; j < hand.thumb.length; j++) {
            let thumbX = hand.thumb[j][0];
            let thumbY = hand.thumb[j][1];
            ellipse(thumbX, thumbY, 10);
        }

        // Pak objecten op
        for (let object of objects) {
            if (dist(hand.indexFinger[3][0], hand.indexFinger[3][1], object.x, object.y) < 20) {
                object.x = hand.indexFinger[3][0];
                object.y = hand.indexFinger[3][1];
            }
        }
    }

    // Teken objecten op het scherm
    for (let object of objects) {
        fill(object.color);
        ellipse(object.x, object.y, 30);
    }
}

function mouseClicked() {
    objects.push({x: mouseX, y: mouseY, color: color(random(255), random(255), random(255))});
}
