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
    co
