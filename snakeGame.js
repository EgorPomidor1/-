const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const gameOverModal = document.getElementById('gameOverModal');
const gameOverText = document.getElementById('gameOverText');
const difficultySelect = document.getElementById('difficulty');
const controls = document.getElementById('controls');

const tileSize = 20;
const canvasSize = canvas.width;
const canvasTileCount = canvasSize / tileSize;

let snake = [{ x: 10, y: 10 }];
let snakeLength = 1;
let direction = { x: 0, y: 0 };
let food = {};
let score = 0;
let gameInterval;
let gameSpeed = 100;

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    snakeLength = 1;
    direction = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.textContent = score;
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    gameOverModal.style.display = 'none';
    controls.style.display = 'none';
}

function placeFood() {
    let validPosition = false;
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * canvasTileCount),
            y: Math.floor(Math.random() * canvasTileCount)
        };
        validPosition = !snake.some(part => part.x === food.x && part.y === food.y);
    }
}

function gameLoop() {
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        gameOverText.textContent = `ИГРА ПРОИГРАНА! ВАШИХ ОЧКОВ: ${score}`;
        gameOverModal.style.display = 'block';
        controls.style.display = 'block';
        return;
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        snakeLength++;
        score++;
        scoreDisplay.textContent = score;
        placeFood();
    }
    drawGame();
}

function moveSnake() {
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    snake.unshift(newHead);
    while (snake.length > snakeLength) {
        snake.pop();
    }
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvasTileCount || snake[0].y < 0 || snake[0].y >= canvasTileCount) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = 'green';
    for (let part of snake) {
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    }

    ctx.fillStyle = 'darkred';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
});

difficultySelect.addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'easy':
            gameSpeed = 150;
            break;
        case 'medium':
            gameSpeed = 100;
            break;
        case 'hard':
            gameSpeed = 70;
            break;
    }
    resetGame();
});

restartBtn.addEventListener('click', () => {
    const selectedDifficulty = difficultySelect.value;
    switch (selectedDifficulty) {
        case 'easy':
            gameSpeed = 150;
            break;
        case 'medium':
            gameSpeed = 100;
            break;
        case 'hard':
            gameSpeed = 70;
            break;
    }
    resetGame();
});

resetGame();

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'light-mode') {
            themeToggle.textContent = 'Switch to Dark Theme';
        }
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        let theme = 'dark-mode';
        if (document.body.classList.contains('light-mode')) {
            theme = 'light-mode';
            themeToggle.textContent = 'Switch to Dark Theme';
        } else {
            themeToggle.textContent = 'Switch to Light Theme';
        }
        localStorage.setItem('theme', theme);
    });
});
