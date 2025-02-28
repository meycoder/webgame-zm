const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10; 
const canvasWidth = canvas.width;  
const canvasHeight = canvas.height; 
let snake;
let food;
let score;
let direction;
let gameInterval;

// Загружаем изображение еды
const foodImage = new Image();
foodImage.src = 'food.png'; // Убедись, что этот файл есть в проекте

// Функция для инициализации игры
function initializeGame() {
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    score = 0;
    direction = 'RIGHT';
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('restartBtn').style.display = 'none';
    startGame();
}

// Запуск игры
function startGame() {
    gameInterval = setInterval(updateGame, 100);
}

// Обновление игры
function updateGame() {
    moveSnake();
    checkCollision();
    drawGame();
}

// Двигаем змейку
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    // **Фикс выхода за границы**
    if (head.x < 0) head.x = 0;
    if (head.x >= canvasWidth) head.x = canvasWidth - gridSize;
    if (head.y < 0) head.y = 0;
    if (head.y >= canvasHeight) head.y = canvasHeight - gridSize;

    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop(); // Удаляем хвост
    }

    snake.unshift(head);
}

// Проверка на столкновение с собой
function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

// Завершаем игру
function endGame() {
    clearInterval(gameInterval);
    document.getElementById('restartBtn').style.display = 'block';
}

// Отрисовка игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку (теперь красиво)
    snake.forEach((part, index) => {
        ctx.fillStyle = `rgba(0, 0, 0, ${1 - index * 0.1})`; // Градиент чёрного цвета
        ctx.beginPath();
        ctx.arc(part.x + gridSize / 2, part.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Рисуем еду (изображение)
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);

    document.getElementById('score').textContent = `Очки: ${score}`;
}

// Генерация еды в случайном месте
function generateFood() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}

// Управление
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

// Кнопка "Возродиться"
document.getElementById('restartBtn').addEventListener('click', () => {
    initializeGame();
});

// Запуск игры
initializeGame();
