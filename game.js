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
let isPaused = false; // Добавляем возможность паузы

const foodColor = 'white'; // Белая еда

// Оптимизация для различных DPI экранов
function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);
}

function initializeGame() {
    setupCanvas(); // Настраиваем canvas для различных экранов
    snake = [{ x: 50, y: 50 }];
    food = generateFood();
    score = 0;
    direction = 'RIGHT';
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('restartBtn').style.display = 'none';
    isPaused = false;
    startGame();
}

function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
    if (isPaused) return;
    
    moveSnake();
    checkCollision();
    drawGame();
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
        // Добавляем вибрацию при сборе еды (если поддерживается)
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
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
    // Добавляем вибрацию при проигрыше (если поддерживается)
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Используем requestAnimationFrame для более плавной анимации
    requestAnimationFrame(() => {
        // Рисуем змейку
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

        // Рисуем еду
        ctx.fillStyle = foodColor;
        ctx.beginPath();
        ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    document.getElementById('score').textContent = `Очки: ${score}`;
}

function generateFood() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    
    // Проверяем, чтобы еда не появилась на змейке
    for (const part of snake) {
        if (part.x === x && part.y === y) {
            return generateFood(); // Пробуем снова
        }
    }
    
    return { x, y };
}

// Оптимизированное управление для мобильных устройств
let touchStartX = 0;
let touchStartY = 0;
let lastTouchTime = 0;

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    lastTouchTime = Date.now();
}, { passive: false });

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    
    // Игнорируем слишком быстрые тапы
    if (Date.now() - lastTouchTime < 100) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Минимальное расстояние для свайпа
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && direction !== 'LEFT') direction = 'RIGHT';
            else if (deltaX < 0 && direction !== 'RIGHT') direction = 'LEFT';
        } else {
            if (deltaY > 0 && direction !== 'UP') direction = 'DOWN';
            else if (deltaY < 0 && direction !== 'DOWN') direction = 'UP';
        }
    }
}, { passive: false });

// Оптимизация обработчиков кнопок
const controls = {
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    left: document.getElementById('left'),
    right: document.getElementById('right')
};

Object.entries(controls).forEach(([dir, btn]) => {
    // Добавляем обработчики для touch событий
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const opposites = {
            'up': 'DOWN',
            'down': 'UP',
            'left': 'RIGHT',
            'right': 'LEFT'
        };
        if (direction !== opposites[dir]) {
            direction = dir.toUpperCase();
        }
    }, { passive: false });

    // Сохраняем поддержку кликов для десктопа
    btn.addEventListener('click', () => {
        const opposites = {
            'up': 'DOWN',
            'down': 'UP',
            'left': 'RIGHT',
            'right': 'LEFT'
        };
        if (direction !== opposites[dir]) {
            direction = dir.toUpperCase();
        }
    });
});

// Обработка видимости страницы
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        isPaused = true;
    } else {
        isPaused = false;
    }
});

// Кнопка для перезапуска игры
document.getElementById('restartBtn').addEventListener('click', () => {
    initializeGame();
});

// Обработчик для открытия модального окна
const profileButton = document.getElementById('profile-button');
const profileModal = document.getElementById('profile-modal');
const closeModalButton = document.getElementById('close-modal');

// Открыть модальное окно при клике на кнопку профиля
profileButton.addEventListener('click', () => {
    profileModal.style.display = 'flex';
    isPaused = true; // Ставим игру на паузу
});

// Закрыть модальное окно при клике на кнопку закрытия (X)
closeModalButton.addEventListener('click', () => {
    profileModal.style.display = 'none';
    isPaused = false; // Возобновляем игру
});

// Закрыть модальное окно при клике по фону
window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
        profileModal.style.display = 'none';
        isPaused = false; // Возобновляем игру
    }
});

// Добавляем обработку клавиатуры
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    
    // Пауза на пробел
    if (e.key === ' ') {
        isPaused = !isPaused;
    }
});

// Инициализация игры
initializeGame();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    setupCanvas();
    drawGame();
});
