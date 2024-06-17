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
            themeToggle.textContent = 'ТЕМНАЯ ТЕМА';
        } else if (theme === 'dark-mode') {
            themeToggle.textContent = 'БЕЛАЯ ТЕМА';
        } else if (theme === 'lgbt-mode') {
            themeToggle.textContent = 'ПИДОР';
        }
    }
});
