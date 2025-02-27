const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let snake = [{ x: 50, y: 50 }];
let food = { x: 100, y: 100 };
let score = 0;
let direction = 'RIGHT';
let gameInterval;
let isGameOver = false;

const gridSize = 10;
const canvasSize = 300;

// Функция для старта игры
function startGame() {
    gameInterval = setInterval(updateGame, 100);
    isGameOver = false;
    score = 0;
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('restartBtn').style.display = 'none';
}

// Функция для обновления игры
function updateGame() {
    if (isGameOver) return;

    moveSnake();
    checkCollision();
    drawGame();
}

// Двигаем змейку
function moveSnake() {
    const head = Object.assign({}, snake[0]);

    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    snake.unshift(head);

    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = generateFood();
    } else {
        snake.pop();
    }
}

// Проверка на столкновения
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

// Рисуем игровое поле
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку с голубым градиентом
    snake.forEach((part) => {
        let gradient = ctx.createRadialGradient(part.x + gridSize / 2, part.y + gridSize / 2, 0, part.x + gridSize / 2, part.y + gridSize / 2, gridSize);
        gradient.addColorStop(0, 'lightblue');
        gradient.addColorStop(1, 'deepskyblue');
        ctx.fillStyle = gradient;
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });

    // Рисуем еду с голубым и белым цветами
    ctx.fillStyle = 'lightblue';
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'deepskyblue';

    // Обновляем счёт
    document.getElementById('score').textContent = `Очки: ${score}`;
}

// Генерация случайной еды
function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Игра окончена
function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    document.getElementById('restartBtn').style.display = 'block';
}

// Обработчики для кнопок
document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});

document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP';
});

document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN';
});

document.getElementById('restartBtn').addEventListener('click', startGame);

// Запуск игры
startGame();
