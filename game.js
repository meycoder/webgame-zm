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

// Функция для инициализации игры
function initializeGame() {
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    score = 0;
    direction = 'RIGHT';
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('restartBtn').style.display = 'none'; // Скрываем кнопку "Возродиться"
    startGame();
}

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

    // Проверка на столкновение с границами канваса после движения головы
    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        endGame(); // Если выход за пределы канваса, заканчиваем игру
        return; // Выход из функции, чтобы не продолжать обновление
    }

    // Проверка на еду
    if (head.x === food.x && head.y === food.y) {
        score += 1; // Увеличиваем счёт
        food = generateFood(); // Генерируем новую еду
    } else {
        // Убираем последний элемент (хвост), если еда не съедена
        snake.pop();
    }

    snake.unshift(head); // Добавляем новый элемент в начало массива (голова)
}

// Проверка на столкновения
function checkCollision() {
    const head = snake[0];

    // Проверка на столкновение с самим собой
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame(); // Столкновение с хвостом
        }
    }
}

// Завершаем игру и показываем кнопку перезапуска
function endGame() {
    clearInterval(gameInterval); // Останавливаем игру
    document.getElementById('restartBtn').style.display = 'block'; // Показываем кнопку
}

// Рисуем игровое поле
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем поле перед рисованием

    // Рисуем змейку с эффектом тени
    snake.forEach((part, index) => {
        const alpha = 1 - index * 0.1; // Прозрачность хвоста уменьшается
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`; // Зеленый с прозрачностью
        ctx.fillRect(part.x, part.y, gridSize, gridSize); // Рисуем сегмент
    });

    // Рисуем еду с эффектом тени
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'; // Ярко-красная еда с небольшой прозрачностью
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Обновляем счёт
    document.getElementById('score').textContent = `Очки: ${score}`;
}

// Генерация случайной еды
function generateFood() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}

// Обработчики нажатий на кнопки управления
document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP'; // Изменяем направление
});
document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN'; // Изменяем направление
});
document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT'; // Изменяем направление
});
document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT'; // Изменяем направление
});

// Обработчик нажатия на кнопку "Возродиться"
document.getElementById('restartBtn').addEventListener('click', () => {
    initializeGame(); // Инициализируем и запускаем игру заново
});

// Инициализация игры при загрузке страницы
initializeGame();
