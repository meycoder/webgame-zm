const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Загружаем изображения
const snakeImg = new Image();
snakeImg.src = "snake.png";

const foodImg = new Image();
foodImg.src = "food.png";

// Размер клетки
const box = 20;

// Змейка
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
};

let direction = "RIGHT";
let score = 0;

// Слушаем клавиши
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

// Отрисовка игры
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем еду
    ctx.drawImage(foodImg, food.x, food.y, box, box);

    // Рисуем змейку
    for (let i = 0; i < snake.length; i++) {
        ctx.drawImage(snakeImg, snake[i].x, snake[i].y, box, box);
    }

    // Двигаем змейку
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

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

    // Добавляем новую голову змейки
    let newHead = { x: snakeX, y: snakeY };

    // Проверяем на столкновение
    if (collision(newHead, snake)) {
        clearInterval(game);
    }

    snake.unshift(newHead);

    // Отображаем счёт
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Очки: " + score, 10, 25);
}

// Функция проверки столкновения
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
