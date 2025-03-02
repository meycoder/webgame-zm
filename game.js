const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let snake;
let food;
let score;
let direction;
let nextDirection;
let gameInterval;
const foodColor = 'white';

function initializeGame() {
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    score = 0;
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('restartBtn').style.display = 'none';
    startGame();
}

function startGame() {
    gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
    if (isValidDirectionChange(nextDirection)) {
        direction = nextDirection;
    }
    moveSnake();
    checkCollision();
    drawGame();
}

function moveSnake() {
    const head = { ...snake[0] };

    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        endGame();
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        score++;
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
        ctx.fillStyle = 'black';
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
    document.getElementById('score').textContent = `Очки: ${score}`;
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}

// Проверяем, можно ли изменить направление
function isValidDirectionChange(newDirection) {
    return !(
        (newDirection === 'UP' && direction === 'DOWN') ||
        (newDirection === 'DOWN' && direction === 'UP') ||
        (newDirection === 'LEFT' && direction === 'RIGHT') ||
        (newDirection === 'RIGHT' && direction === 'LEFT')
    );
}

// Обработчик клавиатуры
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && isValidDirectionChange('UP')) nextDirection = 'UP';
    if (event.key === 'ArrowDown' && isValidDirectionChange('DOWN')) nextDirection = 'DOWN';
    if (event.key === 'ArrowLeft' && isValidDirectionChange('LEFT')) nextDirection = 'LEFT';
    if (event.key === 'ArrowRight' && isValidDirectionChange('RIGHT')) nextDirection = 'RIGHT';
});

// Обработчики кнопок на экране
document.getElementById('up').addEventListener('click', () => {
    if (isValidDirectionChange('UP')) nextDirection = 'UP';
});
document.getElementById('down').addEventListener('click', () => {
    if (isValidDirectionChange('DOWN')) nextDirection = 'DOWN';
});
document.getElementById('left').addEventListener('click', () => {
    if (isValidDirectionChange('LEFT')) nextDirection = 'LEFT';
});
document.getElementById('right').addEventListener('click', () => {
    if (isValidDirectionChange('RIGHT')) nextDirection = 'RIGHT';
});

document.getElementById('restartBtn').addEventListener('click', () => {
    initializeGame();
});

initializeGame();


// Обработчик для открытия модального окна профиля
const profileButton = document.getElementById('profile-button');
const profileModal = document.getElementById('profile-modal');
const closeModalButton = document.getElementById('close-modal');

// Открытие модального окна при нажатии на кнопку профиля
profileButton.addEventListener('click', () => {
    profileModal.style.display = 'block';
});

// Закрытие модального окна
closeModalButton.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

// Обработчик для сохранения имени пользователя
const saveUsernameButton = document.getElementById('save-username');
const usernameInput = document.getElementById('username');

// Сохранение имени пользователя
saveUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username); // Сохраняем имя пользователя в localStorage
        alert(`Привет, ${username}!`);
        profileModal.style.display = 'none'; // Закрыть окно после сохранения
    } else {
        alert('Пожалуйста, введите имя.');
    }
});

// Загружаем имя пользователя из localStorage при старте игры
window.onload = () => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        alert(`Добро пожаловать обратно, ${savedUsername}!`);
    }
};
