const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 10; // Размер клетки
const canvasWidth = canvas.width;  // Ширина канваса (350px)
const canvasHeight = canvas.height; // Высота канваса (300px)
let snake;
let food;
let score;
let direction;
let gameRequestID; // для requestAnimationFrame

// Цвет для еды
const foodColor = 'white'; // Белая еда

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
    gameRequestID = requestAnimationFrame(updateGame); // Используем requestAnimationFrame для плавности
}

// Функция для обновления игры
function updateGame() {
    moveSnake(); // Двигаем змейку
    checkCollision(); // Проверка на столкновение
    drawGame(); // Рисуем игру
    gameRequestID = requestAnimationFrame(updateGame); // Запрашиваем следующий кадр
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
        return;
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
    cancelAnimationFrame(gameRequestID); // Останавливаем игру
    document.getElementById('restartBtn').style.display = 'block'; // Показываем кнопку
}

// Рисуем игровое поле
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем поле перед рисованием

    // Рисуем змейку с новым градиентом
snake.forEach((part, index) => {
    const alpha = 1 - index * 0.1; // Прозрачность хвоста уменьшается

    // Создаем линейный градиент с голубыми и зелеными оттенками
    const gradient = ctx.createLinearGradient(part.x, part.y, part.x + gridSize, part.y + gridSize);
    gradient.addColorStop(0, '#A2DFF7');  // Светло-голубой (начало)
    gradient.addColorStop(0.5, '#A7D8B8'); // Березовый (середина)
    gradient.addColorStop(1, '#81C79A');  // Зеленый (конец)

    // Применяем градиент
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(part.x + gridSize / 2, part.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI); // Рисуем круг
    ctx.fill();
});

    // Рисуем еду
    ctx.fillStyle = foodColor; // Белая еда
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI); // Рисуем круг
    ctx.fill();

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

// Цвет для еды
const foodColor = 'white'; // Белая еда

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

    // Рисуем змейку с градиентом
    snake.forEach((part, index) => {
        const alpha = 1 - index * 0.1; // Прозрачность хвоста уменьшается

        // Создаем линейный градиент для каждого сегмента змейки
        const gradient = ctx.createLinearGradient(part.x, part.y, part.x + gridSize, part.y + gridSize);
        gradient.addColorStop(0, 'black');  // Начало (черный)
        gradient.addColorStop(0.5, 'gray'); // Средина (серый)
        gradient.addColorStop(1, 'white');  // Конец (белый)

        // Применяем градиент
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(part.x + gridSize / 2, part.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI); // Рисуем круг
        ctx.fill();
    });

    // Рисуем еду
    ctx.fillStyle = foodColor; // Белая еда
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI); // Рисуем круг
    ctx.fill();

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
