// Simplified Progressive Logo Loading Implementation
class ProgressiveLogoLoader {
    constructor() {
        this.logoElements = [];
        this.loadingStates = new Map();
    }

    init() {
        console.log('🚀 Initializing Progressive Logo Loader...');
        
        // Находим все элементы логотипа с классом progressive-logo
        this.logoElements = document.querySelectorAll('.progressive-logo');
        
        console.log(`📍 Found ${this.logoElements.length} progressive logo elements`);
        
        // Запускаем прогрессивную загрузку для каждого логотипа
        this.logoElements.forEach((logo, index) => {
            console.log(`🔄 Processing logo ${index}:`, logo);
            this.loadProgressiveLogo(logo, index);
        });
    }

    loadProgressiveLogo(logoElement, index = 0) {
        const logoId = `logo-${index}`;
        const lightSrc = logoElement.dataset.lightSrc;
        const fullSrc = logoElement.dataset.fullSrc;
        
        console.log(`📋 Logo ${logoId} sources:`, { lightSrc, fullSrc });
        
        // Проверяем наличие необходимых атрибутов
        if (!lightSrc || !fullSrc) {
            console.warn(`⚠️ Missing data attributes for logo ${logoId}`, logoElement);
            return;
        }
        
        // Устанавливаем начальное состояние
        this.loadingStates.set(logoId, {
            element: logoElement,
            lightLoaded: false,
            fullLoaded: false,
            currentStage: 'placeholder'
        });

        // Добавляем класс для стилизации
        logoElement.classList.add('progressive-logo');
        
        // Этап 1: Загружаем легкую версию
        this.loadLightVersion(logoElement, lightSrc, logoId);
        
        // Этап 2: Загружаем полную версию (с задержкой)
        setTimeout(() => {
            this.loadFullVersion(logoElement, fullSrc, logoId);
        }, 500); // Увеличиваем задержку для лучшего UX
    }

    loadLightVersion(logoElement, lightSrc, logoId) {
        console.log(`🔄 Loading light version: ${lightSrc}`);
        
        const lightImage = new Image();
        const state = this.loadingStates.get(logoId);
        
        // Добавляем класс загрузки
        logoElement.classList.add('loading-light');
        
        lightImage.onload = () => {
            console.log(`✅ Light logo loaded: ${lightSrc}`);
            
            // Обновляем src на легкую версию
            logoElement.src = lightSrc;
            logoElement.classList.remove('loading-light');
            logoElement.classList.add('light-loaded');
            
            // Обновляем состояние
            if (state) {
                state.lightLoaded = true;
                state.currentStage = 'light';
            }
        };
        
        lightImage.onerror = () => {
            console.error(`❌ Failed to load light logo: ${lightSrc}`);
            logoElement.classList.remove('loading-light');
            logoElement.classList.add('light-error');
            
            // Fallback: попробуем загрузить полную версию
            setTimeout(() => {
                const fullSrc = logoElement.dataset.fullSrc;
                if (fullSrc) {
                    logoElement.src = fullSrc;
                }
            }, 100);
        };
        
        // Начинаем загрузку легкой версии
        lightImage.src = lightSrc;
    }

    loadFullVersion(logoElement, fullSrc, logoId) {
        console.log(`🔄 Loading full version: ${fullSrc}`);
        
        const fullImage = new Image();
        const state = this.loadingStates.get(logoId);
        
        // Добавляем класс загрузки полной версии
        logoElement.classList.add('loading-full');
        
        fullImage.onload = () => {
            console.log(`✅ Full logo loaded: ${fullSrc}`);
            
            // Плавный переход к полной версии
            this.transitionToFullLogo(logoElement, fullSrc, logoId);
        };
        
        fullImage.onerror = () => {
            console.error(`❌ Failed to load full logo: ${fullSrc}`);
            logoElement.classList.remove('loading-full');
            logoElement.classList.add('full-error');
        };
        
        // Начинаем загрузку полной версии
        fullImage.src = fullSrc;
    }

    transitionToFullLogo(logoElement, fullSrc, logoId) {
        const state = this.loadingStates.get(logoId);
        
        // Убираем классы загрузки
        logoElement.classList.remove('loading-full', 'light-loaded');
        
        // Плавный переход
        logoElement.style.transition = 'opacity 0.3s ease-in-out';
        logoElement.style.opacity = '0.7';
        
        setTimeout(() => {
            logoElement.src = fullSrc;
            logoElement.style.opacity = '1';
            logoElement.classList.add('full-loaded');
            
            // Обновляем состояние
            if (state) {
                state.fullLoaded = true;
                state.currentStage = 'full';
            }
            
            console.log(`🎉 Logo transition completed: ${logoId}`);
        }, 150);
    }

    // Принудительная загрузка всех логотипов (для отладки)
    forceLoadAll() {
        console.log('🔧 Force loading all logos...');
        this.logoElements.forEach((logo, index) => {
            const fullSrc = logo.dataset.fullSrc;
            if (fullSrc) {
                logo.src = fullSrc;
                logo.classList.remove('loading-light', 'loading-full');
                logo.classList.add('full-loaded');
            }
        });
    }

    // Получение статуса загрузки
    getLoadingStatus(logoId = 'logo-0') {
        return this.loadingStates.get(logoId);
    }
}

// Глобальная инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, initializing progressive logos...');
    window.progressiveLogoLoader = new ProgressiveLogoLoader();
    window.progressiveLogoLoader.init();
});

// Экспорт для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressiveLogoLoader;
}