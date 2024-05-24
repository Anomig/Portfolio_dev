const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 0,
    dy: 0
};

const walls = [
    {x: 50, y: 50, width: 300, height: 10},
    {x: 50, y: 100, width: 10, height: 300},
    {x: 50, y: 400, width: 300, height: 10},
    {x: 350, y: 50, width: 10, height: 300}
];

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawWalls() {
    ctx.fillStyle = '#000';
    for (let wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
}

function detectCollision() {
    for (let wall of walls) {
        if (ball.x + ball.radius > wall.x && ball.x - ball.radius < wall.x + wall.width &&
            ball.y + ball.radius > wall.y && ball.y - ball.radius < wall.y + wall.height) {
            // Simple collision resolution by reversing direction
            ball.dx = -ball.dx;
            ball.dy = -ball.dy;
        }
    }

    // Check canvas bounds
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawWalls();
    updateBallPosition();
    detectCollision();
    requestAnimationFrame(gameLoop);
}

function handleOrientation(event) {
    let x = event.beta;  // In degree in the range [-180,180]
    let y = event.gamma; // In degree in the range [-90,90]

    // Clamp values to be within [-90, 90]
    if (x > 90) { x = 90; }
    if (x < -90) { x = -90; }
    if (y > 90) { y = 90; }
    if (y < -90) { y = -90; }

    // Update ball speed based on orientation
    ball.dx = y / 10;
    ball.dy = x / 10;
}

window.addEventListener('deviceorientation', handleOrientation);
requestAnimationFrame(gameLoop);
