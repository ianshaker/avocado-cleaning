/**
 * Telegram Bot Integration
 * Модуль для отправки данных форм в Telegram без сервера
 */

class TelegramIntegration {
    constructor() {
        // Настройки Telegram бота
        this.BOT_TOKEN = '8344143634:AAFBxzO4voYpzvpPIeVKGIlAC0kd5R6miTM';
        this.CHAT_ID = '-1003104142912';
        this.API_URL = `https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`;
    }

    /**
     * Отправка данных о бронировании слота в Telegram
     * @param {Object} slotData - Данные о выбранном слоте
     * @param {string} phone - Номер телефона
     * @param {string} city - Выбранный город
     * @returns {Promise<boolean>} - Успешность отправки
     */
    async sendSlotBooking(slotData, phone, city) {
        try {
            const cityName = city === 'almaty' ? 'Алматы' : 'Астана';
            const currentTime = new Date().toLocaleString('ru-RU', {
                timeZone: 'Asia/Almaty',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }) + ' (GMT+6)';

            const formattedDate = this.formatDate(slotData.date);
            const message = `🆕 <b>НОВАЯ ЗАЯВКА НА КЛИНИНГ</b>

📍 <b>Город:</b> ${cityName}
📅 <b>Дата:</b> ${formattedDate}
⏰ <b>Время:</b> ${slotData.time}
📱 <b>Телефон:</b> <code>${phone}</code>
💰 <b>Скидка:</b> ${slotData.discount}

🕐 <b>Время заявки:</b> ${currentTime}
📝 <b>Источник:</b> Форма "Беру слот"`;

            const success = await this.sendMessage(message);
            if (success) {
                console.log('✅ Заявка на слот отправлена в Telegram');
            } else {
                console.log('❌ Ошибка отправки в Telegram');
            }
            return success;
        } catch (error) {
            console.error('❌ Ошибка отправки в Telegram');
            return false;
        }
    }



    /**
     * Отправка данных формы "Свой пакет" в Telegram
     * @param {Object} packageData - Данные о пакете
     * @returns {Promise<boolean>} - Успешность отправки
     */
    async sendCustomPackage(packageData) {
        try {
            const currentTime = new Date().toLocaleString('ru-RU', {
                timeZone: 'Asia/Almaty',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }) + ' (GMT+6)';

            // Формируем список дополнительных услуг
            const additionalServices = [];
            if (packageData.additionalServices) {
                Object.entries(packageData.additionalServices).forEach(([service, selected]) => {
                    if (selected) {
                        const serviceNames = {
                            'fridge-cleaning': 'холодильник',
                            'oven-cleaning': 'духовка',
                            'window-cleaning': 'окна',
                            'carpet-cleaning': 'ковры',
                            'curtain-washing': 'шторы',
                            'mattress-cleaning': 'матрас',
                            'dishes-cleaning': 'посуда',
                            'ac-cleaning': 'кондиционер'
                        };
                        additionalServices.push(serviceNames[service] || service);
                    }
                });
            }

            const additionalServicesText = additionalServices.length > 0 
                ? additionalServices.join(', ') 
                : 'не выбраны';

            const message = `📦 <b>ЗАЯВКА НА СВОЙ ПАКЕТ</b>

📱 <b>Телефон:</b> <code>${packageData.phone}</code>
📐 <b>Площадь:</b> ${packageData.area} кв.м
🏠 <b>Комнаты:</b> ${packageData.rooms}
🏢 <b>Тип недвижимости:</b> ${packageData.propertyType}
🧹 <b>Тип уборки:</b> ${packageData.cleaningType}
➕ <b>Дополнительные услуги:</b> ${additionalServicesText}

🕐 <b>Время заявки:</b> ${currentTime}
📝 <b>Источник:</b> Форма "Свой пакет"`;

            const success = await this.sendMessage(message);
            if (success) {
                console.log('✅ Заявка на свой пакет отправлена в Telegram');
            } else {
                console.log('❌ Ошибка отправки заявки на свой пакет в Telegram');
            }
            return success;
        } catch (error) {
            console.error('❌ Ошибка отправки заявки на свой пакет в Telegram:', error);
            return false;
        }
    }

    /**
     * Основная функция отправки сообщения в Telegram
     * @param {string} message - Текст сообщения
     * @returns {Promise<boolean>} - Успешность отправки
     */
    async sendMessage(message) {
        if (!this.isConfigured()) {
            console.warn('Telegram бот не настроен');
            return false;
        }

        try {
            console.log('🔍 Отправляем запрос в Telegram:');
            console.log('Bot Token:', this.BOT_TOKEN);
            console.log('Chat ID:', this.CHAT_ID);
            console.log('Message:', message);
            console.log('API URL:', this.API_URL);

            const requestBody = {
                chat_id: this.CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            };
            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Telegram API Error Response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            
            if (result.ok) {
                console.log('✅ Сообщение отправлено в Telegram:', result);
                return true;
            } else {
                console.error('Ошибка Telegram API:', result.description || result);
                return false;
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('🌐 Ошибка сети: проверьте подключение к интернету');
            } else {
                console.error('📱 Ошибка отправки в Telegram:', error.message || error);
            }
            return false;
        }
    }

    /**
     * Создание сообщения для бронирования слота
     * @param {Object} data - Данные бронирования
     * @returns {string} - Форматированное сообщение
     */
    createSlotMessage(data) {
        const timestamp = new Date().toLocaleString('ru-RU');
        const formattedDate = this.formatDate(data.date);
        
        let message = `🆕 <b>НОВАЯ ЗАЯВКА НА КЛИНИНГ</b>\n\n`;
        message += `📍 <b>Город:</b> ${data.city}\n`;
        message += `📅 <b>Дата:</b> ${formattedDate}\n`;
        message += `⏰ <b>Время:</b> ${data.time}\n`;
        message += `📱 <b>Телефон:</b> <code>${data.phone}</code>\n`;
        
        if (data.discount > 0) {
            message += `💰 <b>Скидка:</b> ${data.discount}%\n`;
        }
        
        message += `\n🕐 <b>Время заявки:</b> ${timestamp}`;
        message += `\n📝 <b>Источник:</b> Форма "Беру слот"`;

        return message;
    }



    /**
     * Форматирование даты
     * @param {string} dateString - Дата в формате ISO
     * @returns {string} - Форматированная дата
     */
    formatDate(dateString) {
        if (!dateString) return 'Не выбрана';
        
        const date = new Date(dateString);
        const options = { 
            day: 'numeric', 
            month: 'long', 
            weekday: 'long' 
        };
        
        return date.toLocaleDateString('ru-RU', options);
    }

    /**
     * Форматирование времени
     * @param {string} timeSlot - Временной слот (например, "13-17")
     * @returns {string} - Форматированное время
     */
    formatTime(timeSlot) {
        if (!timeSlot) return 'Не выбрано';
        
        const timeMap = {
            '9-13': '09:00 - 13:00',
            '13-17': '13:00 - 17:00',
            '17-22': '17:00 - 22:00'
        };
        
        return timeMap[timeSlot] || timeSlot;
    }

    /**
     * Проверка настройки бота
     * @returns {boolean} - Настроен ли бот
     */
    isConfigured() {
        return this.BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE' && 
               this.CHAT_ID !== 'YOUR_CHAT_ID_HERE';
    }

    /**
     * Тестовая отправка для проверки настройки
     * @returns {Promise<boolean>} - Успешность тестовой отправки
     */
    async testConnection() {
        if (!this.isConfigured()) {
            console.warn('⚠️ Telegram бот не настроен. Установите BOT_TOKEN и CHAT_ID');
            return false;
        }

        const testMessage = `🧪 <b>ТЕСТ ПОДКЛЮЧЕНИЯ</b>\n\nБот успешно настроен и готов к работе!\n\n🕐 ${new Date().toLocaleString('ru-RU')}`;
        
        return await this.sendMessage(testMessage);
    }
}

// Создаем глобальный экземпляр
window.TelegramBot = new TelegramIntegration();

// Экспорт для Node.js (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramIntegration;
}