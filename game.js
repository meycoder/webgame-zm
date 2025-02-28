const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;  // Размер клетки

// Загружаем картинку для еды
const foodImg = new Image();
foodImg.src = 'food.png';  // Путь к изображению еды

// Инициализация игры
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
};
let direction = 'RIGHT';
let score = 0;

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

// Основная функция отрисовки игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем экран перед отрисовкой

    // Рисуем еду
    ctx.drawImage(foodImg, food.x, food.y, box, box);

    // Рисуем змейку с красивыми градиентами и тенями
    for (let i = 0; i < snake.length; i++) {
        let part = snake[i];

        // Для головы змейки — добавим градиентный эффект
        if (i === 0) {
            let gradient = ctx.createRadialGradient(part.x + box / 2, part.y + box / 2, 10, part.x + box / 2, part.y + box / 2, box / 2);
            gradient.addColorStop(0, "#32CD32"); // Цвет головы
            gradient.addColorStop(1, "#228B22"); // Цвет кончика

            ctx.fillStyle = gradient;
            ctx.shadowColor = "black";  // Тень для головы
            ctx.shadowBlur = 10; // Размытие тени
            ctx.beginPath();
            ctx.arc(part.x + box / 2, part.y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
        // Для тела змейки — обычный стиль
        else {
            ctx.fillStyle = "#32CD32"; // Цвет тела змейки
            ctx.shadowColor = "black"; // Тень
            ctx.shadowBlur = 5; // Размытие
            ctx.beginPath();
            ctx.arc(part.x + box / 2, part.y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }

    // Двигаем змейку
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Если змейка съела еду
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Проверка на столкновение
    if (collision(newHead, snake)) {
        clearInterval(game); // Если столкнулись — заканчиваем игру
    }

    snake.unshift(newHead); // Добавляем голову змейки

    // Отображаем счет
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Очки: ' + score, 10, 25);
}

// Проверка на столкновение с самим собой
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Запускаем игру
let game = setInterval(drawGame, 100);
