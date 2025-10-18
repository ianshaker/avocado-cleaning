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

        // Запускаем инициализацию модулей
        this.formsManager.init();
        this.animationsManager.init();
        this.interactiveManager.init();
        this.utils.init();
        this.slotSelection.init();

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

        // Функция получения общего количества комнат
        window.getTotalRooms = () => {
            if (this.interactiveManager) {
                return this.interactiveManager.getTotalRooms();
            }
            return 1;
        };

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
});

// Делаем класс App доступным глобально
window.App = App;