/**
 * Модуль интерактивных элементов
 * Управляет выбором городов, типов объектов, услуг и другими интерактивными элементами
 */

class InteractiveManager {
    constructor() {
        this.selectedCity = null;
        this.selectedObjects = [];
        this.selectedServices = [];
        this.selectedPropertyType = null;
        this.selectedCleaningType = null;
        this.roomCount = 1;
    }

    init() {
        this.initCitySelection();
        this.initObjectSelection();
        this.initServiceSelection();
        this.initCompactServices();
        this.initPropertyTypeSelection();
        this.initCleaningTypeSelection();
        this.initRoomCounter();
        this.initPackageButtons();
        this.initSubscriptionButton();
    }

    /**
     * Инициализация выбора города
     */
    initCitySelection() {
        const cityTiles = document.querySelectorAll('.city-tile');
        
        cityTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                // Убираем активный класс со всех тайлов
                cityTiles.forEach(t => t.classList.remove('active'));
                // Добавляем активный класс к выбранному
                tile.classList.add('active');
                
                this.selectedCity = tile.dataset.city;
            });
        });
    }

    /**
     * Инициализация выбора типа объекта
     */
    initObjectSelection() {
        const objectTiles = document.querySelectorAll('.object-tile');
        
        objectTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                // Убираем активный класс со всех тайлов
                objectTiles.forEach(t => t.classList.remove('active'));
                // Добавляем активный класс к выбранному
                tile.classList.add('active');
                
                this.selectedObject = tile.dataset.object;
            });
        });
    }

    /**
     * Инициализация выбора дополнительных услуг
     */
    initServiceSelection() {
        const serviceTiles = document.querySelectorAll('.service-tile');
        console.log('Найдено дополнительных услуг:', serviceTiles.length);
        
        serviceTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                tile.classList.toggle('active');
                const service = tile.dataset.service;
                
                if (tile.classList.contains('active')) {
                    if (!this.selectedServices.includes(service)) {
                        this.selectedServices.push(service);
                    }
                } else {
                    this.selectedServices = this.selectedServices.filter(s => s !== service);
                }
                
                console.log('Доп. услуга:', service, tile.classList.contains('active') ? 'выбрана' : 'снята');
                console.log('Выбранные услуги:', this.selectedServices);
            });
        });
    }

    /**
     * Инициализация компактных дополнительных услуг (чекбоксы)
     */
    initCompactServices() {
        const compactServices = document.querySelectorAll('.compact-additional-services input[type="checkbox"]');
        console.log('Найдено компактных услуг:', compactServices.length);
        
        compactServices.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const service = checkbox.value;
                if (checkbox.checked) {
                    if (!this.selectedServices.includes(service)) {
                        this.selectedServices.push(service);
                    }
                } else {
                    this.selectedServices = this.selectedServices.filter(s => s !== service);
                }
                console.log('Компактная услуга:', service, checkbox.checked ? 'выбрана' : 'снята');
            });
        });
    }

    /**
     * Инициализация выбора типа помещения
     */
    initPropertyTypeSelection() {
        const propertyButtons = document.querySelectorAll('.property-type-btn');
        
        propertyButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок
                propertyButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс к выбранной
                button.classList.add('active');
                
                this.selectedPropertyType = button.dataset.type;
            });
        });
    }

    /**
     * Инициализация выбора типа уборки
     */
    initCleaningTypeSelection() {
        const cleaningButtons = document.querySelectorAll('.cleaning-type-btn-compact');
        
        cleaningButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок
                cleaningButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс к выбранной
                button.classList.add('active');
                
                this.selectedCleaningType = button.dataset.cleaning;
            });
        });
    }

    /**
     * Инициализация счетчика комнат
     */
    initRoomCounter() {
        const roomCounterContainer = document.querySelector('.room-counter-compact');
        if (!roomCounterContainer) {
            return;
        }
        
        const decreaseBtn = document.getElementById('rooms-minus');
        const increaseBtn = document.getElementById('rooms-plus');
        const countDisplay = document.getElementById('total-rooms');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                if (this.roomCount > 1) {
                    this.roomCount--;
                    countDisplay.textContent = this.roomCount;
                }
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.roomCount++;
                countDisplay.textContent = this.roomCount;
            });
        }
    }

    /**
     * Получение выбранного города
     */
    getSelectedCity() {
        return this.selectedCity;
    }

    /**
     * Получение выбранных объектов
     */
    getSelectedObjects() {
        return this.selectedObjects;
    }

    /**
     * Получение выбранных услуг
     */
    getSelectedServices() {
        return this.selectedServices;
    }

    /**
     * Получение выбранных дополнительных услуг (для обратной совместимости)
     */
    getSelectedAdditionalServices() {
        const compactServices = [];
        const checkboxes = document.querySelectorAll('.compact-additional-services input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            compactServices.push(checkbox.value);
        });
        
        // Объединяем с основными услугами
        return [...new Set([...this.selectedServices, ...compactServices])];
    }

    /**
     * Получение выбранного типа помещения
     */
    getSelectedPropertyType() {
        return this.selectedPropertyType;
    }

    /**
     * Получение выбранного типа уборки
     */
    getSelectedCleaningType() {
        return this.selectedCleaningType;
    }

    /**
     * Получение общего количества комнат
     */
    getTotalRooms() {
        return this.roomCount;
    }

    /**
     * Сброс всех выборов
     */
    resetSelections() {
        // Сброс городов
        document.querySelectorAll('.city-tile').forEach(tile => tile.classList.remove('active'));
        this.selectedCity = null;
        
        // Сброс объектов
        document.querySelectorAll('.object-tile').forEach(tile => tile.classList.remove('active'));
        this.selectedObjects = [];
        
        // Сброс услуг
        document.querySelectorAll('.service-tile').forEach(tile => tile.classList.remove('active'));
        this.selectedServices = [];
        
        // Сброс типа помещения
        document.querySelectorAll('.property-type-btn').forEach(btn => btn.classList.remove('active'));
        this.selectedPropertyType = null;
        
        // Сброс типа уборки
        document.querySelectorAll('.cleaning-type-btn-compact').forEach(btn => btn.classList.remove('active'));
        this.selectedCleaningType = null;
        
        // Сброс счетчика комнат
        this.roomCount = 1;
        const countDisplay = document.querySelector('#total-rooms');
        if (countDisplay) {
            countDisplay.textContent = this.roomCount;
        }
        
        console.log('Все выборы сброшены');
    }

    /**
     * Программная установка выбора
     */
    setSelection(type, value) {
        switch (type) {
            case 'city':
                const cityTile = document.querySelector(`[data-city="${value}"]`);
                if (cityTile) cityTile.click();
                break;
            case 'object':
                const objectTile = document.querySelector(`[data-type="${value}"]`);
                if (objectTile) objectTile.click();
                break;
            case 'service':
                const serviceTile = document.querySelector(`[data-service="${value}"]`);
                if (serviceTile) serviceTile.click();
                break;
            case 'propertyType':
                const propertyBtn = document.querySelector(`[data-type="${value}"]`);
                if (propertyBtn) propertyBtn.click();
                break;
            case 'cleaningType':
                const cleaningBtn = document.querySelector(`[data-cleaning="${value}"]`);
                if (cleaningBtn) cleaningBtn.click();
                break;
            case 'rooms':
                this.roomCount = parseInt(value) || 1;
                const countDisplay = document.querySelector('.room-count');
                if (countDisplay) {
                    countDisplay.textContent = this.roomCount;
                }
                break;
        }
    }

    /**
     * Инициализация кнопок пакетов "Мой случай"
     */
    initPackageButtons() {
        const packageButtons = document.querySelectorAll('.package-button');
        
        packageButtons.forEach(button => {
            // Исключаем кнопку "Отправить на просчет" из обработчика WhatsApp
            if (button.classList.contains('custom-package-button-new')) {
                return;
            }
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Открываем WhatsApp с предзаполненным сообщением
                const message = encodeURIComponent('Здравствуйте! Меня интересует один из ваших пакетов услуг клининга. Хотел бы обсудить мой случай.');
                const whatsappUrl = `https://wa.me/77470969648?text=${message}`;
                
                // Открываем в новой вкладке
                window.open(whatsappUrl, '_blank');
            });
        });
    }

    /**
     * Инициализация кнопки "Оформить подписку"
     */
    initSubscriptionButton() {
        const subscriptionButton = document.querySelector('.subscription-button');
        
        if (subscriptionButton) {
            subscriptionButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Открываем WhatsApp с предзаполненным сообщением о подписке
                const message = encodeURIComponent('Здравствуйте! Меня интересует подписка на уборку. Хотел бы узнать подробности и оформить подписку.');
                const whatsappUrl = `https://wa.me/77470969648?text=${message}`;
                
                // Открываем в новой вкладке
                window.open(whatsappUrl, '_blank');
            });
        }
    }
}

// Делаем класс доступным глобально
window.InteractiveManager = InteractiveManager;