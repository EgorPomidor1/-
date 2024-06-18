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

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

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

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

function handleTouchMove(event) {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
    }
}


function handleTouchEnd() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            // Свайп вправо
            snakeDirection('right');
        } else {
            // Свайп влево
            snakeDirection('left');
        }
    } else {
        if (diffY > 0) {
            // Свайп вниз
            snakeDirection('down');
        } else {
            // Свайп вверх
            snakeDirection('up');
        }
    }

    // Сбросить значения координат свайпа после окончания обработки
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
}
 

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
    let themeToggleCount = 0; // Счетчик нажатий
    let currentTheme = 'dark-mode'; // По умолчанию - темная тема

    // Установка начальной темы
    setTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        themeToggleCount++;

        // После 10 переключений включаем LGBT тему
        if (themeToggleCount >= 10) {
            setTheme('lgbt-mode');
        } else {
            // Переключаем между темной и светлой темами
            if (currentTheme === 'dark-mode') {
                setTheme('light-mode');
            } else {
                setTheme('dark-mode');
            }
        }
    });

    function setTheme(theme) {
        document.body.classList.remove('dark-mode', 'light-mode', 'lgbt-mode');
        document.body.classList.add(theme);
        updateButtonText(theme);
        currentTheme = theme; // Обновляем текущую тему
    }

    function updateButtonText(theme) {
        if (theme === 'light-mode') {
            themeToggle.textContent = 'Switch to Dark Theme';
        } else if (theme === 'dark-mode') {
            themeToggle.textContent = 'Switch to Light Theme';
        } else if (theme === 'lgbt-mode') {
            themeToggle.textContent = 'LGBT Theme Activated';
        }
    }
});

// Добавлено для обработки свайпов в игре змейка
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');

    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);
    canvas.addEventListener('touchend', handleTouchEnd, false);

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        const firstTouch = event.touches[0];
        touchStartX = firstTouch.clientX;
        touchStartY = firstTouch.clientY;
    }
    

function handleTouchMove(event) {
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0 && direction.x === 0) {
                direction = { x: 1, y: 0 }; // Свайп вправо
            } else if (diffX < 0 && direction.x === 0) {
                direction = { x: -1, y: 0 }; // Свайп влево
            }
        } else {
            if (diffY > 0 && direction.y === 0) {
                direction = { x: 0, y: 1 }; // Свайп вниз
            } else if (diffY < 0 && direction.y === 0) {
                direction = { x: 0, y: -1 }; // Свайп вверх
            }
        }
    }
}


function handleTouchEnd() {
    // Сбросить значения координат свайпа после окончания обработки
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
}


    function snakeDirection(dir) {
        switch (dir) {
            case 'up':
                if (direction.y === 0) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case 'down':
                if (direction.y === 0) {
                    direction = { x: 0, y: 1 };
                }
                break;
            case 'left':
                if (direction.x === 0) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 'right':
                if (direction.x === 0) {
                    direction = { x: 1, y: 0 };
                }
                break;
        }
    }
});
const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
    const canvas = document.getElementById('gameCanvas');

    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
});
