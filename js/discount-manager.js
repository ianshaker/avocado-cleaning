/**
 * Менеджер динамических скидок для раздела "Свой пакет"
 * Рассчитывает скидку на основе выбранных параметров
 */
class DiscountManager {
    constructor() {
        this.baseDiscount = 3; // Базовая скидка 3%
        this.currentDiscount = this.baseDiscount;
        this.discountElement = null;
        this.animationDuration = 500; // Длительность анимации в мс
        
        this.init();
    }

    /**
     * Инициализация менеджера скидок
     */
    init() {
        this.initDiscountTile();
        this.attachEventListeners();
        this.updateDiscount();
    }

    /**
     * Инициализация существующей плитки скидки
     */
    initDiscountTile() {
        // Находим существующую плитку скидки в HTML
        this.discountElement = document.querySelector('#discount-tile');
        
        if (!this.discountElement) {
            console.error('Discount tile element not found');
            return;
        }

        // Плитка готова к использованию - детали скидки не нужны для компактного дизайна
    }

    /**
     * Подключение обработчиков событий
     */
    attachEventListeners() {
        // Обработчики для типа помещения
        const propertyButtons = document.querySelectorAll('.property-type-btn');
        propertyButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => this.updateDiscount(), 100);
            });
        });

        // Обработчики для типа уборки
        const cleaningButtons = document.querySelectorAll('.cleaning-type-btn-compact');
        cleaningButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => this.updateDiscount(), 100);
            });
        });

        // Обработчики для дополнительных услуг
        const serviceCheckboxes = document.querySelectorAll('.toggle-checkbox-ultra-compact');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                setTimeout(() => this.updateDiscount(), 100);
            });
        });
    }

    /**
     * Получение выбранного типа помещения
     */
    getSelectedPropertyType() {
        const activeButton = document.querySelector('.property-type-btn.active');
        return activeButton ? activeButton.getAttribute('data-type') : null;
    }

    /**
     * Получение выбранного типа уборки
     */
    getSelectedCleaningType() {
        const activeButton = document.querySelector('.cleaning-type-btn-compact.active');
        return activeButton ? activeButton.getAttribute('data-cleaning') : null;
    }

    /**
     * Получение количества выбранных дополнительных услуг
     */
    getSelectedServicesCount() {
        const checkedServices = document.querySelectorAll('.toggle-checkbox-ultra-compact:checked');
        return checkedServices.length;
    }

    /**
     * Расчет скидки
     */
    calculateDiscount() {
        let discount = this.baseDiscount;
        const breakdown = [
            { label: 'Базовая скидка:', value: '3%' }
        ];

        // Проверяем тип помещения
        const propertyType = this.getSelectedPropertyType();
        if (propertyType === 'apartment' || propertyType === 'house') {
            discount += 7; // +7% для квартиры/дома (итого 10%)
            breakdown.push({ label: 'Квартира/Дом:', value: '+7%' });
        }

        // Проверяем тип уборки
        const cleaningType = this.getSelectedCleaningType();
        if (cleaningType === 'general') {
            // Для генеральной уборки - добавляем 10%
            discount += 10;
            breakdown.push({ label: 'Генеральная уборка:', value: '+10%' });
        } else if (cleaningType === 'post-renovation') {
            // Для уборки после ремонта - добавляем 10%
            discount += 10;
            breakdown.push({ label: 'После ремонта:', value: '+10%' });
        } else if (cleaningType === 'other') {
            // Для "другое" - сброс до базовой
            discount = this.baseDiscount;
            // Убираем все бонусы кроме базовой
            breakdown.splice(1);
        }
        // Для поддерживающей - без изменений

        // Добавляем бонус за дополнительные услуги
        const servicesCount = this.getSelectedServicesCount();
        if (servicesCount > 0) {
            const servicesBonus = servicesCount * 2;
            discount += servicesBonus;
            breakdown.push({ 
                label: `Доп. услуги (${servicesCount}):`, 
                value: `+${servicesBonus}%` 
            });
        }

        return { discount, breakdown };
    }

    /**
     * Обновление отображения скидки
     */
    updateDiscount() {
        const { discount } = this.calculateDiscount();
        
        // Анимированное обновление процента
        this.animateDiscountChange(this.currentDiscount, discount);
        this.currentDiscount = discount;
        
        // Применяем динамические стили в зависимости от размера скидки
        this.updateDiscountStyling(discount);
        
        // Уведомляем FormsManager об изменении скидки для обновления текста кнопки
        if (window.app?.formsManager?.updateButtonTextWithDiscount) {
            window.app.formsManager.updateButtonTextWithDiscount();
        }
    }

    /**
     * Обновление стилей плитки в зависимости от размера скидки
     */
    updateDiscountStyling(discount) {
        if (!this.discountElement) return;
        
        // Убираем все существующие классы уровней скидки
        this.discountElement.classList.remove('discount-low', 'discount-medium', 'discount-high');
        
        // Применяем соответствующий класс
        if (discount <= 5) {
            this.discountElement.classList.add('discount-low');
        } else if (discount <= 10) {
            this.discountElement.classList.add('discount-medium');
        } else {
            this.discountElement.classList.add('discount-high');
        }
    }

    /**
     * Анимация изменения процента скидки
     */
    animateDiscountChange(fromValue, toValue) {
        const percentageElement = document.getElementById('discount-percentage');
        if (!percentageElement) return;

        const startTime = performance.now();
        const duration = this.animationDuration;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function для плавной анимации
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = fromValue + (toValue - fromValue) * easeOutCubic;
            percentageElement.textContent = Math.round(currentValue) + '%';
            
            // Добавляем эффект пульсации при изменении
            if (progress < 0.5) {
                percentageElement.style.transform = `scale(${1 + 0.1 * Math.sin(progress * Math.PI * 4)})`;
            } else {
                percentageElement.style.transform = 'scale(1)';
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }



    /**
     * Получение текущей скидки
     */
    getCurrentDiscount() {
        return this.currentDiscount;
    }

    /**
     * Сброс скидки к базовому значению
     */
    resetDiscount() {
        this.currentDiscount = this.baseDiscount;
        this.updateDiscount();
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.discountManager = new DiscountManager();
});

// Делаем класс доступным глобально
window.DiscountManager = DiscountManager;