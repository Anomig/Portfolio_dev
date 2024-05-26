let video;
let handpose;
let predictions = [];
let balls = [];
let gameStarted = false;
let modelReadyFlag = false;
let score = 0;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    video.elt.addEventListener('loadeddata', () => {
        console.log('Video is loaded and playing');
    });

    // Set the detection confidence here
    handpose = ml5.handpose(video, { detectionConfidence: 0.8 }, () => {
        console.log('Model Loaded');
        modelReadyFlag = true;
    })

    handpose.on('predict', results => {
        predictions = results;
    });

    let startButton = select('#startButton');
    startButton.mousePressed(startGame);
    console.log('Setup complete');
}

function startGame() {
    let startButton = select('#startButton');
    startButton.hide();

    for (let i = 0; i < 10; i++) {
        balls.push(new Ball(random(width), random(height), random(15, 30)));
    }

    gameStarted = true;
    score = 0;
    console.log('Game Started');
}

function draw() {
    if (!gameStarted || !modelReadyFlag) {
        return;
    }

    background(220);

    image(video, 0, 0, width, height);

    drawKeypoints();

    for (let ball of balls) {
        ball.update();
        ball.display();
    }

    fill(0);
    textSize(24);
    text(`Score: ${score}`, 10, 30);
}

function drawKeypoints() {
    if (predictions.length === 0) {
        console.log('No hand detected');
        return;
    }

    for (let i = 0; i < predictions.length; i++) {
        let prediction = predictions[i];
        let indexFinger = prediction.landmarks[8]; // Index vinger punt

        fill(255, 0, 0);
        noStroke();
        ellipse(indexFinger[0], indexFinger[1], 10, 10);

        for (let ball of balls) {
            ball.checkCollision(indexFinger);
        }
    }
}

class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.xSpeed = random(-2, 2);
        this.ySpeed = random(-2, 2);
    }

    update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x < this.r || this.x > width - this.r) {
            this.xSpeed *= -1;
        }
        if (this.y < this.r || this.y > height - this.r) {
            this.ySpeed *= -1;
        }
    }

    display() {
        fill(0, 0, 255);
        noStroke();
        ellipse(this.x, this.y, this.r * 2);
    }

    checkCollision(finger) {
        if (finger && finger[0] !== undefined && finger[1] !== undefined) {
            let d = dist(this.x, this.y, finger[0], finger[1]);
            if (d < this.r + 10) {
                this.xSpeed *= -1.1;
                this.ySpeed *= -1.1;
                score++;
                console.log('Collision detected! Score:', score);
            }
        }
    }
}
