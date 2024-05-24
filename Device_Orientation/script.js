const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const basket = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 30,
    width: 50,
    height: 20,
    color: 'blue',
    speed: 0
};

const fruit = {
    x: Math.random() * canvas.width,
    y: 0,
    radius: 10,
    color: 'red',
    speed: 2
};

let score = 0;

function drawBasket() {
    ctx.fillStyle = basket.color;
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawFruit() {
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
    ctx.fillStyle = fruit.color;
    ctx.fill();
    ctx.closePath();
}

function updateFruitPosition() {
    fruit.y += fruit.speed;
    if (fruit.y > canvas.height) {
        fruit.y = 0;
        fruit.x = Math.random() * canvas.width;
    }
}

function detectCatch() {
    if (fruit.y + fruit.radius > basket.y &&
        fruit.x > basket.x &&
        fruit.x < basket.x + basket.width) {
        score++;
        fruit.y = 0;
        fruit.x = Math.random() * canvas.width;
    }
}

function updateBasketPosition(event) {
    const { gamma } = event; // gamma is tilt left-to-right
    basket.speed = gamma * 0.1;

    basket.x += basket.speed;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 8, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBasket();
    drawFruit();
    updateFruitPosition();
    detectCatch();
    drawScore();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('deviceorientation', updateBasketPosition);
gameLoop();
