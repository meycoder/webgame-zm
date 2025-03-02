const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10; // Размер клетки
const canvasWidth = canvas.width;  // Ширина канваса (350px)
const canvasHeight = canvas.height; // Высота канваса (300px)
let snake;
let food;
let score;
let direction;
let lastFrameTime = 0; // Время последнего обновления
let speed = 10; // Скорость игры (каждые 100ms, можно уменьшить для более медленного хода)
let canChangeDirection = true; // Флаг, чтобы избежать смены направления сразу после предыдущего

const foodColor = 'white'; // Белая еда

// Инициализация игры
function initializeGame() {
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    score = 0;
    direction = 'RIGHT'; // Начальное направление
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('restartBtn').style.display = 'none'; // Скрываем кнопку "Возродиться"
    startGame();
}

function startGame() {
    requestAnimationFrame(updateGame); // Используем requestAnimationFrame для начала игры
}

function updateGame(timestamp) {
    // Определяем время, прошедшее с последнего обновления
    const deltaTime = timestamp - lastFrameTime;

    // Если прошло больше времени, чем нужно для одного шага игры
    if (deltaTime > 1000 / speed) {
        lastFrameTime = timestamp; // Обновляем время последнего обновления
        moveSnake(); // Двигаем змейку
        checkCollision(); // Проверка на столкновение
        drawGame(); // Рисуем игру
    }

    // Запрашиваем следующий кадр игры
    requestAnimationFrame(updateGame);
}

function moveSnake() {
    const head = Object.assign({}, snake[0]); // Копируем голову змейки для того, чтобы изменить

    // В зависимости от направления изменяем координаты головы змейки
    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    // Проверка на столкновение с границами экрана
    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        endGame();
        return;
    }

    // Проверка на столкновение с едой
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = generateFood(); // Генерация новой еды
    } else {
        snake.pop(); // Убираем хвост змейки, если еда не съедена
    }

    snake.unshift(head); // Добавляем новую голову на начало массива
}

function checkCollision() {
    const head = snake[0];

    // Проверка на столкновение с самим собой
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    cancelAnimationFrame(updateGame); // Останавливаем игру
    document.getElementById('restartBtn').style.display = 'block'; // Показываем кнопку для перезапуска
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas

    // Рисуем змейку
    snake.forEach((part, index) => {
        const alpha = 1 - index * 0.1;
        const gradient = ctx.createLinearGradient(part.x, part.y, part.x + gridSize, part.y + gridSize);
        gradient.addColorStop(0, 'DodgerBlue');
        gradient.addColorStop(0.5, 'Aqua');
        gradient.addColorStop(1, 'Turquoise');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(part.x + gridSize / 2, part.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Рисуем еду
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Обновляем счет
    document.getElementById('score').textContent = `Очки: ${score}`;
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}

// Управление змейкой через кнопки
function changeDirection(newDirection) {
    // Проверка, что новое направление не противоположное текущему
    if ((newDirection === 'UP' && direction !== 'DOWN') ||
        (newDirection === 'DOWN' && direction !== 'UP') ||
        (newDirection === 'LEFT' && direction !== 'RIGHT') ||
        (newDirection === 'RIGHT' && direction !== 'LEFT')) {
        direction = newDirection;
    }
}

// События для кнопок на экране
document.getElementById('up').addEventListener('click', () => changeDirection('UP'));
document.getElementById('down').addEventListener('click', () => changeDirection('DOWN'));
document.getElementById('left').addEventListener('click', () => changeDirection('LEFT'));
document.getElementById('right').addEventListener('click', () => changeDirection('RIGHT'));

// События для клавиш на ПК
window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        changeDirection('UP');
    } else if (event.key === 'ArrowDown') {
        changeDirection('DOWN');
    } else if (event.key === 'ArrowLeft') {
        changeDirection('LEFT');
    } else if (event.key === 'ArrowRight') {
        changeDirection('RIGHT');
    }
});

// Кнопка для перезапуска игры
document.getElementById('restartBtn').addEventListener('click', () => {
    initializeGame();
});

// Модальное окно для профиля
const profileButton = document.getElementById('profile-button');
const profileModal = document.getElementById('profile-modal');
const closeModalButton = document.getElementById('close-modal');

// Открытие модального окна при нажатии на кнопку профиля
profileButton.addEventListener('click', () => {
    profileModal.style.display = 'block';
    const savedUsername = localStorage.getItem('username');
    const usernameInput = document.getElementById('username');
    // Если имя сохранено, выводим его в поле ввода
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }
});

// Закрытие модального окна
closeModalButton.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

// Закрытие модального окна при клике по фону
window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
        profileModal.style.display = 'none';
    }
});

// Обработчик для сохранения имени пользователя
const saveUsernameButton = document.getElementById('save-username');
const usernameInput = document.getElementById('username');

// Сохранение имени пользователя
saveUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username); // Сохраняем имя пользователя в localStorage
        profileModal.style.display = 'none'; // Закрыть окно после сохранения
    } else {
        alert('Пожалуйста, введите имя.');
    }
});

// Инициализация игры
initializeGame();
