/**
 * Главный файл инициализации
 * Запускает все модули и обеспечивает обратную совместимость
 */

class App {
    constructor() {
        this.formsManager = null;
        this.animationsManager = null;
        this.interactiveManager = null;
        this.utils = null;
        this.slotSelection = null;
        this.discountManager = null;
        this.promoTimer = null;
    }

    /**
     * Инициализация всех модулей
     */
    init() {
        // Инициализируем все модули
        this.formsManager = new FormsManager();
        this.animationsManager = new AnimationsManager();
        this.interactiveManager = new InteractiveManager();
        this.utils = new Utils();
        this.slotSelection = new SlotSelection();
        this.discountManager = new DiscountManager();
        this.promoTimer = new PromoTimer();

        // Запускаем инициализацию модулей
        this.formsManager.init();
        this.animationsManager.init();
        this.interactiveManager.init();
        this.utils.init();
        this.slotSelection.init();
        this.discountManager.init();
        this.promoTimer.init();

        // Инициализируем переключатель городов
        this.initLocationSwitcher();

        // Инициализируем город из URL параметра
        this.initCityFromUrl();

        // Настраиваем глобальные функции для обратной совместимости
        this.setupGlobalFunctions();

        console.log('Все модули успешно инициализированы');
    }

    /**
     * Настройка глобальных функций для обратной совместимости
     */
    setupGlobalFunctions() {
        // Функция прокрутки к контактам
        window.scrollToContact = () => {
            if (this.utils) {
                this.utils.scrollToContact();
            }
        };

        // Функция получения выбранных дополнительных услуг
        window.getSelectedAdditionalServices = () => {
            if (this.interactiveManager) {
                return this.interactiveManager.getSelectedAdditionalServices();
            }
            return [];
        };

        // Функция получения выбранного типа помещения
        window.getSelectedPropertyType = () => {
            if (this.interactiveManager) {
                return this.interactiveManager.getSelectedPropertyType();
            }
            return null;
        };

        // Функция получения выбранного типа уборки
        window.getSelectedCleaningType = () => {
            if (this.interactiveManager) {
                return this.interactiveManager.getSelectedCleaningType();
            }
            return null;
        };



        // Делаем slotSelection доступным глобально
        window.slotSelection = this.slotSelection;

        // Функция получения выбранного города
        window.getSelectedCity = () => {
            if (this.interactiveManager) {
                return this.interactiveManager.getSelectedCity();
            }
            return null;
        };

        // Функция получения выбранных типов объектов
        window.getSelectedObjects = () => {
            if (this.interactiveManager) {
                return this.interactiveManager.getSelectedObjects();
            }
            return [];
        };

        // Функция получения выбранных услуг
        window.getSelectedServices = () => {
            if (this.interactiveManager) {
                return this.interactiveManager.getSelectedServices();
            }
            return [];
        };

        // Функция сброса всех выборов
        window.resetAllSelections = () => {
            if (this.interactiveManager) {
                this.interactiveManager.resetSelections();
            }
        };

        // Функция программной установки выбора
        window.setSelection = (type, value) => {
            if (this.interactiveManager) {
                this.interactiveManager.setSelection(type, value);
            }
        };

        // Функция принудительной загрузки всех видео
        window.forceLoadAllVideos = () => {
            if (this.animationsManager) {
                this.animationsManager.forceLoadAllVideos();
            }
        };
    }

    /**
     * Инициализация переключателя городов
     */
    initLocationSwitcher() {
        const cities = {
            almaty: {
                title: 'Наш офис в Алматы',
                address: 'г. Алматы, ул. Римского-Корсакова, 19а',
                mapUrl: 'https://yandex.ru/map-widget/v1/?ll=76.928020%2C43.233360&z=16&l=map&pt=76.928020%2C43.233360%2Cpm2rdm'
            },
            astana: {
                title: 'Наш офис в Астане',
                address: 'г. Астана, Адырна 15',
                mapUrl: 'https://yandex.ru/map-widget/v1/?ll=71.432298%2C51.138313&z=16&l=map&pt=71.432298%2C51.138313%2Cpm2rdm'
            }
        };

        const cityButtons = document.querySelectorAll('.city-btn');
        const cityToggle = document.getElementById('cityToggle');
        const officeTitle = document.getElementById('office-title');
        const officeAddress = document.getElementById('office-address');
        const mapFrame = document.getElementById('office-map');

        cityButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedCity = button.dataset.city;
                
                // Обновляем URL параметр
                this.updateUrlParameter('city', selectedCity);
                
                // Синхронизируем с Hero секцией
                const heroTiles = document.querySelectorAll('.city-tile');
                heroTiles.forEach(tile => {
                    tile.classList.remove('active');
                    if (tile.dataset.city === selectedCity) {
                        tile.classList.add('active');
                    }
                });

                // Обновляем selectedCity в InteractiveManager
                if (this.interactiveManager) {
                    this.interactiveManager.selectedCity = selectedCity;
                }

                const data = cities[selectedCity];

                // Обновляем активную кнопку
                cityButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Обновляем класс для анимации ползунка
                if (cityToggle) {
                    if (selectedCity === 'astana') {
                        cityToggle.classList.add('astana');
                    } else {
                        cityToggle.classList.remove('astana');
                    }
                }

                // Обновляем контент
                if (officeTitle) officeTitle.textContent = data.title;
                if (officeAddress) officeAddress.textContent = data.address;
                if (mapFrame) mapFrame.src = data.mapUrl;
            });
        });
    }

    /**
     * Получение параметра из URL
     */
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Обновление URL параметра без перезагрузки страницы
     */
    updateUrlParameter(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }

    /**
     * Инициализация города из URL параметра
     */
    initCityFromUrl() {
        const cityParam = this.getUrlParameter('city');
        const validCities = ['almaty', 'astana'];
        const defaultCity = 'almaty';
        
        const selectedCity = validCities.includes(cityParam) ? cityParam : defaultCity;
        
        console.log('Initializing city from URL:', selectedCity);
        this.setActiveCity(selectedCity);
    }

    /**
     * Установка активного города в обеих секциях
     */
    setActiveCity(cityName) {
        console.log('Setting active city:', cityName);
        
        // Обновляем Hero секцию
        const heroTiles = document.querySelectorAll('.city-tile');
        heroTiles.forEach(tile => {
            tile.classList.remove('active');
            if (tile.dataset.city === cityName) {
                tile.classList.add('active');
            }
        });

        // Обновляем Location секцию
        const locationButtons = document.querySelectorAll('.city-btn');
        const cityToggle = document.getElementById('cityToggle');
        const officeTitle = document.getElementById('office-title');
        const officeAddress = document.getElementById('office-address');
        const mapFrame = document.getElementById('office-map');

        const cities = {
            almaty: {
                title: 'Наш офис в Алматы',
                address: 'г. Алматы, ул. Римского-Корсакова, 19а',
                mapUrl: 'https://yandex.ru/map-widget/v1/?ll=76.928020%2C43.233360&z=16&l=map&pt=76.928020%2C43.233360%2Cpm2rdm'
            },
            astana: {
                title: 'Наш офис в Астане',
                address: 'г. Астана, Адырна 15',
                mapUrl: 'https://yandex.ru/map-widget/v1/?ll=71.432298%2C51.138313&z=16&l=map&pt=71.432298%2C51.138313%2Cpm2rdm'
            }
        };

        const data = cities[cityName];
        if (data) {
            // Обновляем активную кнопку в Location секции
            locationButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.city === cityName) {
                    btn.classList.add('active');
                }
            });

            // Обновляем класс для анимации ползунка
            if (cityToggle) {
                if (cityName === 'astana') {
                    cityToggle.classList.add('astana');
                } else {
                    cityToggle.classList.remove('astana');
                }
            }

            // Обновляем контент
            if (officeTitle) officeTitle.textContent = data.title;
            if (officeAddress) officeAddress.textContent = data.address;
            if (mapFrame) mapFrame.src = data.mapUrl;
        }

        // Обновляем selectedCity в InteractiveManager
        if (this.interactiveManager) {
            this.interactiveManager.selectedCity = cityName;
        }
    }

    /**
     * Получение экземпляра модуля
     */
    getModule(moduleName) {
        switch (moduleName) {
            case 'formsManager':
                return this.formsManager;
            case 'animationsManager':
                return this.animationsManager;
            case 'interactiveManager':
                return this.interactiveManager;
            case 'utils':
                return this.utils;
            default:
                console.warn(`Модуль ${moduleName} не найден`);
                return null;
        }
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
    
    // Инициализируем отслеживание посетителей
    if (window.VisitorTracker) {
        window.VisitorTracker.init();
    }
    
    // Инициализируем трекинг кнопок
    if (window.ButtonTracker) {
        window.ButtonTracker.init();
    }
});

// Делаем класс App доступным глобально
window.App = App;