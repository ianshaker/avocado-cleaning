/**
 * Button Tracking Module
 * Модуль для отслеживания нажатий на кнопки и ссылки на сайте
 */

class ButtonTracker {
    constructor() {
        this.trackedButtons = new Set(); // Для предотвращения дублирования трекинга
    }

    /**
     * Инициализация трекинга кнопок
     */
    init() {
        // Небольшая задержка, чтобы убедиться, что все элементы загружены
        setTimeout(() => {
            this.trackTopBarButtons();
            this.trackGalleryButtons();
            this.trackHimcleanButtons();
            this.trackPackageButtons();
            this.trackSubscriptionButton();
            this.trackFooterButtons();
            this.trackConsultantWidget();
            console.log('✅ ButtonTracker инициализирован');
        }, 500);
    }

    /**
     * Отслеживание кнопок в верхнем баре
     */
    trackTopBarButtons() {
        // Трекинг телефона в верхнем баре
        const phoneLink = document.querySelector('.top-bar-phone');
        if (phoneLink && !this.trackedButtons.has('top-bar-phone')) {
            phoneLink.addEventListener('click', (e) => {
                this.trackButtonClick('Телефон', 'Верхний бар', phoneLink.href);
            });
            this.trackedButtons.add('top-bar-phone');
        }

        // Трекинг WhatsApp в верхнем баре
        const whatsappLink = document.querySelector('.top-bar-left .whatsapp-icon');
        if (whatsappLink && !this.trackedButtons.has('top-bar-whatsapp')) {
            whatsappLink.addEventListener('click', (e) => {
                this.trackButtonClick('WhatsApp', 'Верхний бар', whatsappLink.href);
            });
            this.trackedButtons.add('top-bar-whatsapp');
        }

        // Трекинг Instagram иконки в верхнем баре
        const instagramIcon = document.querySelector('.top-bar-right .instagram-icon');
        if (instagramIcon && !this.trackedButtons.has('top-bar-instagram-icon')) {
            instagramIcon.addEventListener('click', (e) => {
                this.trackButtonClick('Instagram', 'Верхний бар', instagramIcon.href);
            });
            this.trackedButtons.add('top-bar-instagram-icon');
        }

        // Трекинг кнопки "Подписаться" в Instagram блоке верхнего бара
        const instagramSubscribe = document.querySelector('.top-bar-instagram-subscribe');
        if (instagramSubscribe && !this.trackedButtons.has('top-bar-instagram-subscribe')) {
            instagramSubscribe.addEventListener('click', (e) => {
                this.trackButtonClick('Instagram (Подписаться)', 'Верхний бар', instagramSubscribe.href);
            });
            this.trackedButtons.add('top-bar-instagram-subscribe');
        }
    }

    /**
     * Отслеживание кнопок "Хочу также" в секции "До/После"
     */
    trackGalleryButtons() {
        const galleryButtons = document.querySelectorAll('.gallery-action-button');
        
        galleryButtons.forEach((button, index) => {
            // Получаем название услуги из заголовка галереи
            const galleryItem = button.closest('.gallery-item');
            const galleryTitle = galleryItem?.querySelector('.gallery-title');
            const serviceName = galleryTitle?.textContent || `Услуга ${index + 1}`;
            
            // Создаем уникальный идентификатор для каждой кнопки
            const uniqueId = `gallery-button-${index}`;
            
            if (!this.trackedButtons.has(uniqueId)) {
                button.addEventListener('click', (e) => {
                    // URL будет WhatsApp ссылка, которая создается в before-after-gallery.js
                    const whatsappUrl = `https://wa.me/77470399698?text=${encodeURIComponent('Здравствуйте! Хочу заказать уборку как на фото в разделе "До и После". Можете рассчитать стоимость?')}`;
                    this.trackButtonClick(`Хочу также - ${serviceName}`, 'До/После', whatsappUrl);
                });
                this.trackedButtons.add(uniqueId);
            }
        });
    }

    /**
     * Отслеживание кнопок "Далее" в секции "Химчистка"
     */
    trackHimcleanButtons() {
        const himcleanButtons = document.querySelectorAll('.himclean-button');
        
        himcleanButtons.forEach((button, index) => {
            // Получаем название услуги из заголовка карточки
            const himcleanItem = button.closest('.himclean-item');
            const serviceTitle = himcleanItem?.querySelector('h3');
            const serviceName = serviceTitle?.textContent || `Услуга ${index + 1}`;
            
            // Создаем уникальный идентификатор для каждой кнопки
            const uniqueId = `himclean-button-${index}`;
            
            if (!this.trackedButtons.has(uniqueId)) {
                button.addEventListener('click', (e) => {
                    // Получаем URL из атрибута href
                    const url = button.href || 'N/A';
                    this.trackButtonClick(`Далее - ${serviceName}`, 'Химчистка', url);
                });
                this.trackedButtons.add(uniqueId);
            }
        });
    }

    /**
     * Отслеживание кнопок в секции пакетных предложений
     */
    trackPackageButtons() {
        // Трекинг кнопок "Мой случай"
        const packageButtons = document.querySelectorAll('.package-button:not(.custom-package-button-new)');
        
        packageButtons.forEach((button, index) => {
            // Получаем название пакета из заголовка карточки
            const serviceCard = button.closest('.service-card');
            const serviceTitle = serviceCard?.querySelector('.service-title');
            // Берем текст заголовка, убирая цену (она в span)
            let packageName = serviceTitle?.textContent?.trim() || `Пакет ${index + 1}`;
            // Убираем цену - все что идет после "от" или числа с ₸
            const priceIndex = packageName.indexOf(' от ');
            if (priceIndex !== -1) {
                packageName = packageName.substring(0, priceIndex).trim();
            }
            
            // Создаем уникальный идентификатор для каждой кнопки
            const uniqueId = `package-button-${index}`;
            
            if (!this.trackedButtons.has(uniqueId)) {
                button.addEventListener('click', (e) => {
                    // Кнопка "Мой случай" открывает WhatsApp через interactive.js
                    // Получаем URL из обработчика или формируем стандартный
                    const whatsappUrl = `https://wa.me/77470399698`;
                    this.trackButtonClick(`Мой случай - ${packageName}`, 'Пакетные предложения', whatsappUrl);
                });
                this.trackedButtons.add(uniqueId);
            }
        });

        // Трекинг иконок WhatsApp в пакетных предложениях
        const packageWhatsappIcons = document.querySelectorAll('.package-whatsapp-icon');
        
        packageWhatsappIcons.forEach((icon, index) => {
            // Получаем название пакета из заголовка карточки
            const serviceCard = icon.closest('.service-card');
            const serviceTitle = serviceCard?.querySelector('.service-title');
            // Берем текст заголовка, убирая цену (она в span)
            let packageName = serviceTitle?.textContent?.trim() || `Пакет ${index + 1}`;
            // Убираем цену - все что идет после "от" или числа с ₸
            const priceIndex = packageName.indexOf(' от ');
            if (priceIndex !== -1) {
                packageName = packageName.substring(0, priceIndex).trim();
            }
            
            // Создаем уникальный идентификатор для каждой иконки
            const uniqueId = `package-whatsapp-${index}`;
            
            if (!this.trackedButtons.has(uniqueId)) {
                icon.addEventListener('click', (e) => {
                    // Получаем URL из атрибута href
                    const url = icon.href || 'N/A';
                    this.trackButtonClick(`WhatsApp - ${packageName}`, 'Пакетные предложения', url);
                });
                this.trackedButtons.add(uniqueId);
            }
        });
    }

    /**
     * Отслеживание кнопки "Оформить подписку" в секции подписки
     */
    trackSubscriptionButton() {
        const subscriptionButton = document.querySelector('.subscription-button');
        
        if (subscriptionButton && !this.trackedButtons.has('subscription-button')) {
            subscriptionButton.addEventListener('click', (e) => {
                // Кнопка открывает WhatsApp через interactive.js
                // Формируем стандартный URL
                const whatsappUrl = `https://wa.me/77470399698`;
                this.trackButtonClick('Оформить подписку', 'Подписка', whatsappUrl);
            });
            this.trackedButtons.add('subscription-button');
        }
    }

    /**
     * Отслеживание кнопок в футере (нижнем баре)
     */
    trackFooterButtons() {
        // Трекинг телефона в футере
        const footerPhoneLink = document.querySelector('.footer-contacts a[href^="tel:"]');
        if (footerPhoneLink && !this.trackedButtons.has('footer-phone')) {
            footerPhoneLink.addEventListener('click', (e) => {
                this.trackButtonClick('Телефон', 'Футер', footerPhoneLink.href);
            });
            this.trackedButtons.add('footer-phone');
        }

        // Трекинг WhatsApp в футере
        const footerWhatsappLink = document.querySelector('.footer-whatsapp-item .footer-social-icon');
        if (footerWhatsappLink && !this.trackedButtons.has('footer-whatsapp')) {
            footerWhatsappLink.addEventListener('click', (e) => {
                this.trackButtonClick('WhatsApp', 'Футер', footerWhatsappLink.href);
            });
            this.trackedButtons.add('footer-whatsapp');
        }

        // Трекинг Instagram иконки в футере
        const footerInstagramIcon = document.querySelector('.footer-instagram-wrapper .instagram-icon');
        if (footerInstagramIcon && !this.trackedButtons.has('footer-instagram-icon')) {
            footerInstagramIcon.addEventListener('click', (e) => {
                this.trackButtonClick('Instagram', 'Футер', footerInstagramIcon.href);
            });
            this.trackedButtons.add('footer-instagram-icon');
        }

        // Трекинг кнопки "Подписаться" в Instagram блоке футера
        const footerInstagramSubscribe = document.querySelector('.footer-instagram-wrapper .top-bar-instagram-subscribe');
        if (footerInstagramSubscribe && !this.trackedButtons.has('footer-instagram-subscribe')) {
            footerInstagramSubscribe.addEventListener('click', (e) => {
                this.trackButtonClick('Instagram (Подписаться)', 'Футер', footerInstagramSubscribe.href);
            });
            this.trackedButtons.add('footer-instagram-subscribe');
        }
    }

    /**
     * Отслеживание кнопки "Ответить" в виджете консультанта
     * Виджет создается динамически, поэтому используем проверку через интервал
     */
    trackConsultantWidget() {
        // Проверяем наличие кнопки каждые 500мс, так как виджет появляется с задержкой
        const checkInterval = setInterval(() => {
            const replyButton = document.querySelector('.consultant-reply-btn');
            
            if (replyButton && !this.trackedButtons.has('consultant-reply-btn')) {
                // Кнопка найдена, добавляем трекинг
                replyButton.addEventListener('click', (e) => {
                    // Формируем WhatsApp URL (как в consultant-widget.js)
                    const whatsappUrl = `https://wa.me/77470399698?text=${encodeURIComponent('Добрый день! Хочу продолжить консультацию по уборке')}`;
                    this.trackButtonClick('Ответить', 'Виджет консультанта', whatsappUrl);
                });
                this.trackedButtons.add('consultant-reply-btn');
                
                // Останавливаем проверку, так как кнопка найдена и трекинг добавлен
                clearInterval(checkInterval);
            }
        }, 500);
        
        // Останавливаем проверку через 30 секунд, чтобы не проверять бесконечно
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 30000);
    }

    /**
     * Отслеживание нажатия на кнопку
     * @param {string} buttonName - Название кнопки
     * @param {string} location - Местоположение кнопки на сайте
     * @param {string} url - URL кнопки/ссылки
     */
    async trackButtonClick(buttonName, location, url) {
        try {
            // Получаем уникальный ID посетителя
            const visitorId = window.VisitorTracker?.getVisitorId() || window.app?.visitorTracker?.getVisitorId() || null;
            
            if (!visitorId) {
                console.warn('⚠️ Visitor ID не найден, трекинг кнопки пропущен');
                return;
            }

            // Получаем текущее время по Казахстану
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

            // Формируем сообщение
            const message = `<b>🔘 НАЖАТИЕ НА КНОПКУ</b>

🆔 <b>ID посетителя:</b> <code>${visitorId}</code>
🔘 <b>Кнопка:</b> ${buttonName}
📍 <b>Местоположение:</b> ${location}
🔗 <b>URL:</b> ${url}
🕐 <b>Время:</b> ${currentTime}`;

            // Отправляем через Telegram бота
            if (window.TelegramBot && window.TelegramBot.isConfigured()) {
                await window.TelegramBot.sendMessage(message);
                console.log(`✅ Нажатие на кнопку "${buttonName}" отслежено`);
            } else {
                console.warn('⚠️ Telegram бот не настроен, трекинг кнопки пропущен');
            }
        } catch (error) {
            console.error('❌ Ошибка трекинга нажатия на кнопку:', error);
        }
    }

    /**
     * Добавление трекинга для конкретной кнопки/ссылки
     * Универсальный метод для добавления трекинга к любой кнопке на сайте
     * @param {HTMLElement} element - Элемент кнопки/ссылки
     * @param {string} buttonName - Название кнопки
     * @param {string} location - Местоположение кнопки на сайте
     */
    trackButton(element, buttonName, location) {
        if (!element) {
            console.warn(`⚠️ Элемент для трекинга "${buttonName}" не найден`);
            return;
        }

        const uniqueId = `${location}-${buttonName}`;
        if (this.trackedButtons.has(uniqueId)) {
            return; // Уже отслеживается
        }

        element.addEventListener('click', (e) => {
            const url = element.href || element.getAttribute('data-url') || 'N/A';
            this.trackButtonClick(buttonName, location, url);
        });

        this.trackedButtons.add(uniqueId);
        console.log(`✅ Трекинг добавлен для кнопки "${buttonName}" в "${location}"`);
    }
}

// Создаем глобальный экземпляр
window.ButtonTracker = new ButtonTracker();

// Экспорт для Node.js (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ButtonTracker;
}

