const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
let snake = [{ x: 50, y: 50 }];
let food = { x: 100, y: 100 };
let score = 0;
let direction = 'RIGHT';
let gameInterval;
let isGameOver = false;

// Подгружаем изображения для змейки и еды
const snakeImage = new Image();
snakeImage.src = 'https://example.com/snake.png'; // Замените на ссылку на ваше изображение змейки

const foodImage = new Image();
foodImage.src = 'https://example.com/food.png'; // Замените на ссылку на ваше изображение еды

const gridSize = 10;
const canvasSize = 300;

function startGame() {
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    score = 0;
    direction = 'RIGHT';
    isGameOver = false;
    gameInterval = setInterval(updateGame, 100);
    restartBtn.style.display = 'none'; // Скрыть кнопку "Возродиться"
}

function updateGame() {
    moveSnake();
    checkCollision();
    drawGame();
}

function moveSnake() {
    const head = Object.assign({}, snake[0]);

    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    isGameOver = true;
    restartBtn.style.display = 'block'; // Показать кнопку "Возродиться"
    alert("Игра окончена!");
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку с изображением
    snake.forEach(part => {
        ctx.drawImage(snakeImage, part.x, part.y, gridSize, gridSize);
    });

    // Рисуем еду с изображением
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);

    // Обновляем счёт
    document.getElementById('score').textContent = `Очки: ${score}`;
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

restartBtn.addEventListener('click', startGame);

startGame();
