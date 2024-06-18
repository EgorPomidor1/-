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
        if (event.touches.length > 1) {
            return; // Игнорировать множественные касания
        }
        const touch = event.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
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
