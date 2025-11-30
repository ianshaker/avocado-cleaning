/**
 * Химчистка Carousel Module
 * Карусель для мобильной версии секции химчистки
 */

class HimcleanCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.dots = [];
        this.prevButton = null;
        this.nextButton = null;
        this.carouselWrapper = null;
        this.totalSlides = 0;
        this.isMobile = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    /**
     * Инициализация карусели
     */
    init() {
        this.carouselWrapper = document.querySelector('.himclean-carousel-wrapper');
        if (!this.carouselWrapper) return;

        this.slides = Array.from(document.querySelectorAll('.himclean-slide'));
        this.dots = Array.from(document.querySelectorAll('.himclean-dot'));
        this.prevButton = document.querySelector('.himclean-carousel-prev');
        this.nextButton = document.querySelector('.himclean-carousel-next');
        
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides === 0) return;

        // Проверяем размер экрана
        this.checkMobile();
        window.addEventListener('resize', () => this.checkMobile());

        // Инициализируем только на мобильной версии
        if (this.isMobile) {
            // Устанавливаем первый слайд как активный
            if (this.slides.length > 0) {
                this.currentSlide = 0;
                this.slides[0].classList.add('active');
            }
            this.setupCarousel();
        } else {
            this.resetToGrid();
        }
    }

    /**
     * Проверка мобильной версии
     */
    checkMobile() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.setupCarousel();
            } else {
                this.resetToGrid();
            }
        }
    }

    /**
     * Настройка карусели для мобильной версии
     */
    setupCarousel() {
        // Показываем карусель элементы
        if (this.prevButton) this.prevButton.style.display = 'flex';
        if (this.nextButton) this.nextButton.style.display = 'flex';
        if (document.querySelector('.himclean-carousel-dots')) {
            document.querySelector('.himclean-carousel-dots').style.display = 'flex';
        }

        // Привязываем события
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }

        // Привязываем события для точек
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Добавляем поддержку свайпа
        this.setupSwipe();

        // Показываем первый слайд
        this.updateCarousel();
    }

    /**
     * Сброс карусели для десктопной версии
     */
    resetToGrid() {
        // Скрываем элементы карусели
        if (this.prevButton) this.prevButton.style.display = 'none';
        if (this.nextButton) this.nextButton.style.display = 'none';
        if (document.querySelector('.himclean-carousel-dots')) {
            document.querySelector('.himclean-carousel-dots').style.display = 'none';
        }

        // Показываем все слайды
        this.slides.forEach(slide => {
            slide.style.display = 'flex';
            slide.classList.remove('active');
        });
    }

    /**
     * Настройка свайпа для мобильных устройств
     */
    setupSwipe() {
        if (!this.carouselWrapper) return;

        this.carouselWrapper.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.carouselWrapper.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, { passive: true });
    }

    /**
     * Обработка свайпа
     */
    handleSwipe() {
        const swipeThreshold = 50; // Минимальное расстояние для свайпа
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                this.nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                this.prevSlide();
            }
        }
    }

    /**
     * Переход к следующему слайду
     */
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    /**
     * Переход к предыдущему слайду
     */
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    /**
     * Переход к конкретному слайду
     */
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateCarousel();
        }
    }

    /**
     * Обновление отображения карусели
     */
    updateCarousel() {
        if (!this.isMobile) return;

        // Скрываем все слайды
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.style.display = 'flex';
                slide.classList.add('active');
            } else {
                slide.style.display = 'none';
                slide.classList.remove('active');
            }
        });

        // Обновляем активную точку
        this.dots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.himcleanCarousel = new HimcleanCarousel();
    window.himcleanCarousel.init();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HimcleanCarousel;
}

