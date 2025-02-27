const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10; // Размер клетки
const canvasSize = 300;
let snake = [{ x: 50, y: 50 }];
let food = { x: 100, y: 100 };
let score = 0;
let direction = 'RIGHT';
let gameInterval;

// Функция для старта игры
function startGame() {
    gameInterval = setInterval(updateGame, 100);
}

// Функция для обновления игры
function updateGame() {
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
        clearInterval(gameInterval);
        alert("Игра окончена!");
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(gameInterval);
            alert("Игра окончена!");
        }
    }
}

// Рисуем игровое поле
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку
    snake.forEach(part => {
        ctx.fillStyle = 'green';
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });

    // Рисуем еду
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Обновляем счёт
    document.getElementById('score').textContent = `Очки: ${score}`;
}

// Генерация случайной еды
function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Обработчик клавиш
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

// Запускаем игру
startGame();
