// Логика игры
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10; // Размер клетки
const canvasWidth = canvas.width;  // Ширина канваса (350px)
const canvasHeight = canvas.height; // Высота канваса (300px)
let snake;
let food;
let score;
let direction;
let gameInterval;

const foodColor = 'white'; // Белая еда

function initializeGame() {
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    score = 0;
    direction = 'RIGHT';
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('restartBtn').style.display = 'none'; // Скрываем кнопку "Возродиться"
    startGame();
}

function startGame() {
    gameInterval = setInterval(updateGame, 100); // обновляем каждую сотую секунды
}

function updateGame() {
    moveSnake(); // Двигаем змейку
    checkCollision(); // Проверка на столкновение
    drawGame(); // Рисуем игру
}

function moveSnake() {
    const head = Object.assign({}, snake[0]);

    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        endGame();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('restartBtn').style.display = 'block';
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.forEach((part, index) => {
        const alpha = 1 - index * 0.1;
        const gradient = ctx.createLinearGradient(part.x, part.y, part.x + gridSize, part.y + gridSize);
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(0.5, 'gray');
        gradient.addColorStop(1, 'white');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(part.x + gridSize / 2, part.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    document.getElementById('score').textContent = `Очки: ${score}`;
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}

// Управление змейкой через кнопки
document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP';
});
document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN';
});
document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});
document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

// Кнопка для перезапуска игры
document.getElementById('restartBtn').addEventListener('click', () => {
    initializeGame();
});

// Обработчик для кнопки профиля
document.getElementById('profile-button').addEventListener('click', () => {
    document.getElementById('profile-modal').style.display = 'block'; // Открыть модальное окно
});

// Обработчик для закрытия модального окна
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('profile-modal').style.display = 'none'; // Закрыть модальное окно
});

initializeGame();
