const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Размер клетки

// Загружаем картинку для еды
const foodImg = new Image();
foodImg.src = 'food.png'; // Путь к изображению еды

// Инициализация змейки
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

// Функция отрисовки змейки
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        let part = snake[i];

        // Градиент для головы змейки
        if (i === 0) {
            let gradient = ctx.createRadialGradient(
                part.x + box / 2, part.y + box / 2, 5, 
                part.x + box / 2, part.y + box / 2, box / 2
            );
            gradient.addColorStop(0, "#00ff00"); // Светло-зеленый центр
            gradient.addColorStop(1, "#006400"); // Темно-зеленый края

            ctx.fillStyle = gradient;
            ctx.shadowColor = "black";
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = "#32CD32"; // Тело змейки - зеленый
            ctx.shadowBlur = 5;
        }

        ctx.beginPath();
        ctx.arc(part.x + box / 2, part.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

// Основная функция отрисовки игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем экран

    // Рисуем еду
    ctx.drawImage(foodImg, food.x, food.y, box, box);

    // Рисуем змейку
    drawSnake();

    // Двигаем змейку
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Проверяем, съела ли змейка еду
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

    // Проверяем столкновение с самой собой
    if (collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    // Отображаем очки
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Очки: ' + score, 10, 25);
}

// Проверка на столкновение
function collision(head, array) {
    return array.some(part => head.x === part.x && head.y === part.y);
}

// Запускаем игру
let game = setInterval(drawGame, 100);
