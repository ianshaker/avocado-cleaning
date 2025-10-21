// Lazy Loading Implementation
class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Проверяем поддержку Intersection Observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                // Загружаем изображения за 100px до появления в viewport
                rootMargin: '100px 0px',
                threshold: 0.01
            });

            this.observeImages();
        } else {
            // Fallback для старых браузеров - загружаем все изображения сразу
            this.loadAllImages();
        }
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        // Добавляем класс для анимации загрузки
        img.classList.add('lazy-loading');
        
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Когда изображение загружено, заменяем src
            img.src = img.dataset.src;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            
            // Удаляем data-src атрибут
            img.removeAttribute('data-src');
        };
        
        imageLoader.onerror = () => {
            // В случае ошибки загрузки
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-error');
            console.warn('Failed to load image:', img.dataset.src);
        };
        
        // Начинаем загрузку
        imageLoader.src = img.dataset.src;
    }

    loadAllImages() {
        // Fallback для браузеров без поддержки Intersection Observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    // Метод для добавления новых изображений после инициализации
    addNewImages() {
        if (this.imageObserver) {
            this.observeImages();
        }
    }
}

// Инициализируем ленивую загрузку после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
});

// Экспортируем для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}