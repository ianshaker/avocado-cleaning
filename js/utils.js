/**
 * Модуль утилит
 * Содержит вспомогательные функции и пасхалки
 */

class Utils {
    constructor() {
        this.konamiCode = [];
        this.konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    }

    init() {
        this.updateFooterYear();
        this.initKonamiCode();
        this.showWelcomeMessage();
    }

    /**
     * Прокрутка к секции контактов
     */
    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Обновление года в футере
     */
    updateFooterYear() {
        const yearElement = document.querySelector('.footer-bottom p');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = `© ${currentYear} AvocadoCleaning. Все права защищены`;
        }
    }

    /**
     * Инициализация Konami кода (пасхалка)
     */
    initKonamiCode() {
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.key);
            this.konamiCode = this.konamiCode.slice(-this.konamiPattern.length);
            
            if (this.konamiCode.join(',') === this.konamiPattern.join(',')) {
                this.activateKonamiEasterEgg();
                this.konamiCode = [];
            }
        });
    }

    /**
     * Активация пасхалки Konami кода
     */
    activateKonamiEasterEgg() {
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg)';
        }, 1000);
    }

    /**
     * Показ приветственного сообщения в консоли
     */
    showWelcomeMessage() {
        console.log('%c🥑 Добро пожаловать на сайт AvocadoCleaning! 🥑', 'color: #9fdc7c; font-size: 20px; font-weight: bold;');
        console.log('%cМы создаем идеальную чистоту с заботой о вашем здоровье!', 'color: #1a5e1a; font-size: 14px;');
    }
}

// Делаем класс доступным глобально
window.Utils = Utils;