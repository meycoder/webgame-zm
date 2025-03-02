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
    moveSnake();
    checkCollision();
    drawGame();
}

function moveSnake() {
    if (
        (nextDirection === 'LEFT' && direction === 'RIGHT') ||
        (nextDirection === 'RIGHT' && direction === 'LEFT') ||
        (nextDirection === 'UP' && direction === 'DOWN') ||
        (nextDirection === 'DOWN' && direction === 'UP')
    ) {
        nextDirection = direction;
    }

    direction = nextDirection;
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

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
});

document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'DOWN' && nextDirection !== 'DOWN') nextDirection = 'UP';
});
document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'UP' && nextDirection !== 'UP') nextDirection = 'DOWN';
});
document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'RIGHT' && nextDirection !== 'RIGHT') nextDirection = 'LEFT';
});
document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'LEFT' && nextDirection !== 'LEFT') nextDirection = 'RIGHT';
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
