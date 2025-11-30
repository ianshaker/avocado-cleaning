/**
 * Visitor Tracking Module
 * Модуль для отслеживания посетителей сайта и отправки информации в Telegram
 */

class VisitorTracker {
    constructor() {
        this.sessionKey = 'visitor_info_sent';
        this.visitorIdKey = 'visitor_unique_id';
        this.exitTrackedKey = 'visitor_exit_tracked';
        this.isTrackingExit = false;
    }

    /**
     * Инициализация отслеживания посетителей
     */
    init() {
        // Генерируем ID сразу при инициализации, чтобы он был доступен при закрытии
        this.generateVisitorId();
        
        // Небольшая задержка, чтобы убедиться, что Telegram бот инициализирован
        setTimeout(() => {
            if (window.TelegramBot && window.TelegramBot.isConfigured()) {
                this.trackVisitor().catch(error => {
                    console.error('Ошибка при отслеживании посетителя:', error);
                });
            } else {
                console.warn('⚠️ Telegram бот не настроен, отслеживание посетителей отключено');
            }
        }, 1000);

        // Инициализируем отслеживание закрытия вкладки
        this.initExitTracking();
    }

    /**
     * Инициализация отслеживания закрытия вкладки/покидания сайта
     */
    initExitTracking() {
        // Используем несколько событий для максимальной надежности
        window.addEventListener('beforeunload', () => {
            this.trackExit();
        });

        // Отслеживаем изменение видимости страницы (переключение вкладок, минимизация окна)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Страница скрыта, но это не обязательно закрытие
                // Используем небольшую задержку, чтобы не отправлять при простом переключении вкладок
                setTimeout(() => {
                    if (document.hidden) {
                        this.trackExit();
                    }
                }, 5000); // Если страница скрыта более 5 секунд, считаем что пользователь ушел
            }
        });

        // Отслеживаем событие pagehide (более надежное для мобильных устройств)
        window.addEventListener('pagehide', () => {
            this.trackExit();
        });
    }

    /**
     * Отслеживание закрытия вкладки/покидания сайта
     */
    trackExit() {
        // Проверяем, не отправляли ли уже уведомление о выходе
        if (sessionStorage.getItem(this.exitTrackedKey)) {
            return;
        }

        // Получаем ID посетителя
        const visitorId = this.getVisitorId();
        if (!visitorId) {
            return;
        }

        // Помечаем, что уведомление о выходе отправлено
        sessionStorage.setItem(this.exitTrackedKey, 'true');

        // Формируем сообщение
        const currentTime = new Date().toLocaleString('ru-RU', {
            timeZone: 'Asia/Almaty',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long'
        }) + ' (GMT+6)';

        const message = `<b>👋 ПОСЕТИТЕЛЬ ПОКИНУЛ САЙТ</b>

🆔 <b>ID посетителя:</b> <code>${visitorId}</code>
🕐 <b>Время выхода:</b> ${currentTime}
🌐 <b>URL:</b> ${window.location.href}`;

        // Отправляем через sendBeacon для надежности при закрытии страницы
        this.sendExitMessage(message);
    }

    /**
     * Отправка сообщения о выходе посетителя
     * Использует sendBeacon или fetch с keepalive для надежной отправки при закрытии страницы
     * @param {string} message - Текст сообщения
     */
    sendExitMessage(message) {
        // Проверяем доступность Telegram бота
        if (!window.TelegramBot || !window.TelegramBot.isConfigured()) {
            console.warn('⚠️ Telegram бот не настроен, уведомление о выходе не отправлено');
            return;
        }

        const botToken = window.TelegramBot.BOT_TOKEN;
        const chatId = window.TelegramBot.CHAT_ID;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        // Формируем JSON данные для Telegram API
        const data = {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        };

        // Пытаемся использовать fetch с keepalive (работает при закрытии страницы)
        if (fetch && typeof fetch === 'function') {
            try {
                // Используем fetch с keepalive для надежной отправки
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                    keepalive: true // Важно: позволяет отправлять запросы даже после закрытия страницы
                }).then(() => {
                    console.log('✅ Уведомление о выходе посетителя отправлено через fetch');
                }).catch(error => {
                    console.error('❌ Ошибка отправки через fetch:', error);
                    this.sendExitMessageFallback(message);
                });
            } catch (error) {
                console.error('❌ Ошибка отправки через fetch:', error);
                this.sendExitMessageFallback(message);
            }
        } else {
            // Если fetch не поддерживается, используем fallback
            this.sendExitMessageFallback(message);
        }
    }

    /**
     * Альтернативный способ отправки сообщения о выходе (fallback)
     * Использует sendBeacon с Blob для отправки JSON данных
     * @param {string} message - Текст сообщения
     */
    sendExitMessageFallback(message) {
        if (!window.TelegramBot || !window.TelegramBot.isConfigured()) {
            return;
        }

        const botToken = window.TelegramBot.BOT_TOKEN;
        const chatId = window.TelegramBot.CHAT_ID;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        // Формируем JSON данные
        const data = {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        };

        // Используем sendBeacon с Blob для отправки JSON
        if (navigator.sendBeacon) {
            try {
                const blob = new Blob([JSON.stringify(data)], {
                    type: 'application/json'
                });
                
                const sent = navigator.sendBeacon(url, blob);
                
                if (sent) {
                    console.log('✅ Уведомление о выходе посетителя отправлено через sendBeacon');
                } else {
                    console.warn('⚠️ sendBeacon не смог отправить данные');
                }
            } catch (error) {
                console.error('❌ Ошибка отправки через sendBeacon:', error);
            }
        }
    }

    /**
     * Генерация уникального ID посетителя
     * Формат: Авокадик-ЧЧ:ММ:МС:D/M
     * Где: ЧЧ - часы, ММ - минуты, МС - последние 2 цифры миллисекунд, D/M - устройство
     * Время берется по казахстанскому часовому поясу (Asia/Almaty, GMT+6)
     * @returns {string} - Уникальный ID посетителя
     */
    generateVisitorId() {
        // Проверяем, есть ли уже сохраненный ID в sessionStorage
        let visitorId = sessionStorage.getItem(this.visitorIdKey);
        
        if (!visitorId) {
            // Получаем время в казахстанском часовом поясе
            const now = new Date();
            const kazakhstanTime = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Almaty',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).formatToParts(now);
            
            // Извлекаем часы, минуты и секунды из отформатированного времени
            const hours = kazakhstanTime.find(part => part.type === 'hour').value.padStart(2, '0');
            const minutes = kazakhstanTime.find(part => part.type === 'minute').value.padStart(2, '0');
            const seconds = kazakhstanTime.find(part => part.type === 'second').value.padStart(2, '0');
            
            // Определяем тип устройства (D - Десктоп, M - Мобильный)
            const userAgent = navigator.userAgent;
            const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
            const deviceLetter = isMobile ? 'M' : 'D';
            
            visitorId = `Авокадик-${hours}:${minutes}:${seconds}:${deviceLetter}`;
            
            // Сохраняем в sessionStorage
            sessionStorage.setItem(this.visitorIdKey, visitorId);
        }
        
        return visitorId;
    }

    /**
     * Получение уникального ID посетителя
     * @returns {string} - Уникальный ID посетителя
     */
    getVisitorId() {
        return this.generateVisitorId();
    }

    /**
     * Отслеживание посетителя и отправка информации в Telegram
     * @returns {Promise<boolean>} - Успешность отправки
     */
    async trackVisitor() {
        try {
            // Проверяем, не отправляли ли уже информацию в этой сессии
            if (sessionStorage.getItem(this.sessionKey)) {
                console.log('ℹ️ Информация о посетителе уже отправлена в этой сессии');
                return false;
            }

            // Генерируем уникальный ID посетителя
            const visitorId = this.generateVisitorId();

            // Собираем данные о посетителе
            const visitorData = this.collectVisitorData();
            visitorData.id = visitorId;

            // Формируем сообщение
            const message = this.formatVisitorMessage(visitorData);

            // Отправляем через Telegram бота
            const success = await window.TelegramBot.sendMessage(message);
            
            if (success) {
                // Помечаем, что информация уже отправлена в этой сессии
                sessionStorage.setItem(this.sessionKey, 'true');
                console.log('✅ Информация о посетителе отправлена в Telegram');
            } else {
                console.log('❌ Ошибка отправки информации о посетителе в Telegram');
            }
            
            return success;
        } catch (error) {
            console.error('❌ Ошибка отслеживания посетителя:', error);
            return false;
        }
    }

    /**
     * Сбор данных о посетителе
     * @returns {Object} - Данные о посетителе
     */
    collectVisitorData() {
        const referrer = document.referrer || 'Прямой заход';
        const currentUrl = window.location.href;
        const userAgent = navigator.userAgent;
        
        // Время по Казахстану
        const kazakhstanTime = new Date().toLocaleString('ru-RU', {
            timeZone: 'Asia/Almaty',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long'
        }) + ' (GMT+6)';

        // Определение устройства
        const deviceType = this.detectDevice(userAgent);

        // Определение браузера
        const browser = this.detectBrowser(userAgent);

        // Язык браузера (только код языка)
        const language = (navigator.language || navigator.userLanguage || 'ru').split('-')[0].toUpperCase();

        return {
            referrer,
            url: currentUrl,
            deviceType,
            browser,
            language,
            time: kazakhstanTime
        };
    }

    /**
     * Определение типа устройства
     * @param {string} userAgent - User Agent строка
     * @returns {string} - Тип устройства
     */
    detectDevice(userAgent) {
        const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android/i.test(userAgent) && !isMobile;
        
        if (isTablet) {
            return 'Планшет';
        } else if (isMobile) {
            return 'Мобильное устройство';
        }
        return 'Десктоп';
    }

    /**
     * Определение браузера
     * @param {string} userAgent - User Agent строка
     * @returns {string} - Название браузера
     */
    detectBrowser(userAgent) {
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
            return 'Chrome';
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            return 'Safari';
        } else if (userAgent.indexOf('Firefox') > -1) {
            return 'Firefox';
        } else if (userAgent.indexOf('Edg') > -1) {
            return 'Edge';
        } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            return 'Opera';
        }
        return 'Неизвестный';
    }

    /**
     * Форматирование сообщения о посетителе
     * @param {Object} data - Данные о посетителе
     * @returns {string} - Форматированное сообщение
     */
    formatVisitorMessage(data) {
        return `<b>НОВЫЙ ПОСЕТИТЕЛЬ НА САЙТЕ</b>

ID: ${data.id}
Ссылка перехода: ${data.referrer}
URL: ${data.url}
Устройство: ${data.deviceType}
Браузер: ${data.browser}
Язык: ${data.language}
Время (KZ): ${data.time}`;
    }
}

// Создаем глобальный экземпляр
window.VisitorTracker = new VisitorTracker();

// Экспорт для Node.js (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorTracker;
}

