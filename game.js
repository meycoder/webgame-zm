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
    gameInterval = setInterval(updateGame, 100); // обновляем каждую сотую секунды
}

// Функция для обновления игры
function updateGame() {
    moveSnake(); // Двигаем змейку
    checkCollision(); // Проверка на столкновение
    drawGame(); // Рисуем игру
}

// Двигаем змейку
function moveSnake() {
    const head = Object.assign({}, snake[0]);

    // Определяем новое положение головы змейки в зависимости от направления
    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    snake.unshift(head); // Добавляем новый элемент в начало массива (голова)

    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        score += 1; // Увеличиваем счёт
        food = generateFood(); // Генерируем новую еду
    } else {
        snake.pop(); // Убираем последний элемент (хвост)
    }
}

// Проверка на столкновения
function checkCollision() {
    const head = snake[0];

    // Проверка на столкновение с границами поля
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        clearInterval(gameInterval);
        alert("Игра окончена!");
    }

    // Проверка на столкновение с самим собой
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(gameInterval);
            alert("Игра окончена!");
        }
    }
}

// Рисуем игровое поле
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем поле перед рисованием

    // Рисуем змейку
    snake.forEach(part => {
        ctx.fillStyle = 'green'; // Цвет змейки
        ctx.fillRect(part.x, part.y, gridSize, gridSize); // Рисуем сегмент
    });

    // Рисуем еду
    ctx.fillStyle = 'red'; // Цвет еды
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

// Обработчики нажатий на кнопки управления
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

// Запускаем игру
startGame();
