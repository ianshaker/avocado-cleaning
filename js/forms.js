/**
 * Модуль для обработки форм
 * Включает валидацию, маски ввода и отправку данных
 */
class FormsManager {
    constructor() {
        this.heroForm = document.getElementById('heroForm');
        this.successMessage = document.getElementById('successMessage');
    }

    /**
     * Инициализация всех форм
     */
    init() {
        this.initHeroForm();
        this.initCustomPackageForm();
        this.initPromoForm();
        this.initAllPhoneMasks();
        this.addShakeAnimation();
        this.initSpotsCounter();
        this.initAreaInput();
    }

    /**
     * Инициализация масок телефона для всех полей типа tel
     */
    initAllPhoneMasks() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(phoneInput => {
            this.addPhoneMask(phoneInput);
        });
        
        // Дополнительная инициализация с задержкой для промо-поля
        setTimeout(() => {
            const promoPhoneInput = document.getElementById('promo-phone');
            if (promoPhoneInput && !promoPhoneInput.dataset.maskInitialized) {
                this.addPhoneMask(promoPhoneInput);
                promoPhoneInput.dataset.maskInitialized = 'true';
            }
        }, 200);
    }







    /**
     * Инициализация счетчика оставшихся мест
     */
    initSpotsCounter() {
        const spotsElement = document.querySelector('.spots-left');
        if (spotsElement) {
            // Генерируем случайное число от 3 до 12 для создания ощущения ограниченности
            const spots = Math.floor(Math.random() * 10) + 3;
            spotsElement.textContent = spots;
        }
    }

    /**
     * Инициализация поля ввода площади с оценкой количества комнат
     */
    initAreaInput() {
        const areaInput = document.getElementById('area');
        const roomEstimation = document.getElementById('room-estimation');
        
        if (!areaInput || !roomEstimation) return;

        // Функция для расчета количества комнат по площади
        const calculateRooms = (area) => {
            const areaNum = parseInt(area);
            if (isNaN(areaNum) || areaNum <= 0) return '';
            
            if (areaNum <= 30) {
                return 'ориентировочно 1 комната';
            } else if (areaNum <= 80) {
                return 'ориентировочно 2 комнаты';
            } else if (areaNum <= 120) {
                return 'ориентировочно 3 комнаты';
            } else {
                return 'ориентировочно больше 4 комнат';
            }
        };

        // Обработчик ввода в поле площади
        areaInput.addEventListener('input', (e) => {
            const area = e.target.value;
            const roomText = calculateRooms(area);
            
            if (roomText) {
                roomEstimation.textContent = roomText;
                roomEstimation.classList.add('show');
            } else {
                roomEstimation.classList.remove('show');
            }
        });

        // Скрываем оценку при потере фокуса, если поле пустое
        areaInput.addEventListener('blur', () => {
            if (!areaInput.value) {
                roomEstimation.classList.remove('show');
            }
        });
    }

    /**
     * Инициализация героической формы
     */
    initHeroForm() {
        if (!this.heroForm) return;

        this.addHeroFormSubmission();
    }

    /**
     * Добавление маски телефона к полю ввода
     * @param {HTMLElement} phoneInput - Поле ввода телефона
     */
    addPhoneMask(phoneInput) {
        // Проверяем, не была ли маска уже инициализирована
        if (phoneInput.dataset.maskInitialized === 'true') {
            return;
        }
        
        // Помечаем как инициализированное
        phoneInput.dataset.maskInitialized = 'true';
        
        const maskTemplate = '+7 (___) ___-__-__';
        
        // Устанавливаем начальную маску
        if (!phoneInput.value || phoneInput.value === '') {
            phoneInput.value = maskTemplate;
            phoneInput.style.color = '#999';
        }

        phoneInput.addEventListener('input', (e) => {
            const input = e.target;
            let value = input.value.replace(/\D/g, '');
            
            // Обрабатываем случай, когда пользователь начинает с 8
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                if (value[0] !== '7') {
                    value = '7' + value;
                }
            }
            
            // Ограничиваем длину до 11 цифр
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Форматируем номер с сохранением маски
            let formatted = '';
            if (value.length > 0) {
                input.style.color = '#000'; // Черный цвет для введенного текста
                formatted = '+7';
                
                // Код города (3 цифры)
                if (value.length > 1) {
                    const cityCode = value.substring(1, 4);
                    formatted += ' (' + cityCode.padEnd(3, '_') + ')';
                    
                    // Первая часть номера (3 цифры)
                    if (value.length > 4) {
                        const firstPart = value.substring(4, 7);
                        formatted += ' ' + firstPart.padEnd(3, '_');
                        
                        // Вторая часть номера (2 цифры)
                        if (value.length > 7) {
                            const secondPart = value.substring(7, 9);
                            formatted += '-' + secondPart.padEnd(2, '_');
                            
                            // Третья часть номера (2 цифры)
                            if (value.length > 9) {
                                const thirdPart = value.substring(9, 11);
                                formatted += '-' + thirdPart.padEnd(2, '_');
                            } else {
                                formatted += '-__';
                            }
                        } else {
                            formatted += '-__-__';
                        }
                    } else {
                        formatted += ' ___-__-__';
                    }
                } else {
                    formatted += ' (___) ___-__-__';
                }
            } else {
                formatted = maskTemplate;
                input.style.color = '#999'; // Серый цвет для маски
            }
            
            // Устанавливаем отформатированное значение
            const oldValue = input.value;
            input.value = formatted;
            
            // Устанавливаем курсор в правильную позицию
            setTimeout(() => {
                const underscoreIndex = formatted.indexOf('_');
                if (underscoreIndex !== -1) {
                    input.setSelectionRange(underscoreIndex, underscoreIndex);
                } else if (formatted.length > 0) {
                    // Если нет подчеркиваний (номер полностью введен), ставим курсор в конец
                    input.setSelectionRange(formatted.length, formatted.length);
                }
            }, 0);
        });

        // Обрабатываем событие focus
        phoneInput.addEventListener('focus', (e) => {
            const input = e.target;
            
            // Если поле пустое или содержит только маску, устанавливаем полную маску
            if (!input.value || input.value === '' || input.value === maskTemplate) {
                input.value = maskTemplate;
                input.style.color = '#999';
                setTimeout(() => {
                    input.setSelectionRange(4, 4); // Курсор после "+7 ("
                }, 0);
            } else {
                // Находим первое подчеркивание и ставим курсор туда
                const underscoreIndex = input.value.indexOf('_');
                if (underscoreIndex !== -1) {
                    setTimeout(() => {
                        input.setSelectionRange(underscoreIndex, underscoreIndex);
                    }, 0);
                }
            }
        });

        // Обрабатываем событие blur (потеря фокуса)
        phoneInput.addEventListener('blur', (e) => {
            const input = e.target;
            const value = input.value.replace(/\D/g, '');
            
            // Если введена только цифра 7 или поле пустое, показываем полную маску
            if (value.length <= 1) {
                input.value = maskTemplate;
                input.style.color = '#999';
            }
        });

        // Обрабатываем событие beforeinput для контроля операций удаления
        phoneInput.addEventListener('beforeinput', (e) => {
            const input = e.target;
            const inputType = e.inputType;
            
            // Обрабатываем операции удаления
            if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') {
                const cursorStart = input.selectionStart;
                const cursorEnd = input.selectionEnd;
                
                // Предотвращаем удаление префикса "+7 ("
                if (cursorStart <= 4) {
                    e.preventDefault();
                    input.setSelectionRange(4, 4);
                    return;
                }
                
                // Если выделен текст, обрабатываем удаление выделения
                if (cursorStart !== cursorEnd) {
                    e.preventDefault();
                    
                    // Получаем цифры из текущего значения
                    let digits = input.value.replace(/\D/g, '');
                    
                    // Определяем, какие цифры нужно удалить
                    const beforeSelection = input.value.substring(0, cursorStart);
                    const afterSelection = input.value.substring(cursorEnd);
                    
                    const digitsBefore = beforeSelection.replace(/\D/g, '');
                    const digitsAfter = afterSelection.replace(/\D/g, '');
                    
                    // Создаем новую строку цифр
                    const newDigits = digitsBefore + digitsAfter;
                    
                    // Пересоздаем маску
                    const event = new Event('input', { bubbles: true });
                    input.value = newDigits;
                    input.dispatchEvent(event);
                    return;
                }
            }
        });

        // Обрабатываем событие keydown для лучшего контроля
        phoneInput.addEventListener('keydown', (e) => {
            const input = e.target;
            const cursorPosition = input.selectionStart;
            const currentValue = input.value;
            
            // Предотвращаем удаление префикса "+7 ("
            if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 4) {
                e.preventDefault();
                input.setSelectionRange(4, 4);
                return;
            }
            
            // Специальная обработка Backspace для перемещения через разделители
            if (e.key === 'Backspace' && cursorPosition > 4) {
                const charBeforeCursor = currentValue[cursorPosition - 1];
                
                // Если символ перед курсором - разделитель, перемещаемся к предыдущей цифре
                if (charBeforeCursor && [' ', '(', ')', '-'].includes(charBeforeCursor)) {
                    e.preventDefault();
                    
                    // Находим предыдущую цифру
                    let newPosition = cursorPosition - 1;
                    while (newPosition > 4 && [' ', '(', ')', '-', '_'].includes(currentValue[newPosition - 1])) {
                        newPosition--;
                    }
                    
                    // Если нашли цифру, удаляем её
                    if (newPosition > 4 && /\d/.test(currentValue[newPosition - 1])) {
                        // Получаем только цифры из текущего значения
                        let digits = currentValue.replace(/\D/g, '');
                        
                        // Удаляем последнюю введенную цифру
                        if (digits.length > 1) {
                            digits = digits.slice(0, -1);
                        }
                        
                        // Пересоздаем маску с новыми цифрами
                        const event = new Event('input', { bubbles: true });
                        input.value = digits;
                        input.dispatchEvent(event);
                    }
                    return;
                }
            }
            
            // Разрешаем: backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Разрешаем: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Убеждаемся, что это цифра
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

    }

    /**
     * Вычисляет правильную позицию курсора в маске телефона
     * @param {number} digitCount - Количество введенных цифр
     * @param {string} formattedValue - Отформатированное значение
     * @returns {number} - Новая позиция курсора
     */
    calculateCursorPosition(digitCount, formattedValue) {
        // Если нет цифр или только код страны, ставим курсор после "+7 ("
        if (digitCount <= 1) return 4;
        
        // Находим позицию первого подчеркивания (место для следующего ввода)
        const underscoreIndex = formattedValue.indexOf('_');
        if (underscoreIndex !== -1) {
            return underscoreIndex;
        }
        
        // Если подчеркиваний нет (номер полностью введен), ставим курсор в конец
        return formattedValue.length;
    }

    /**
     * Валидация поля формы
     * @param {HTMLElement} field - Поле для валидации
     * @returns {boolean} - Результат валидации
     */
    validateField(field) {
        const formGroup = field.closest('.form-group');
        let isValid = true;

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
        }

        if (field.type === 'tel') {
            const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
            }
        }

        if (field.tagName === 'SELECT' && field.value === '') {
            isValid = false;
        }

        if (isValid) {
            formGroup.classList.remove('error');
        } else {
            formGroup.classList.add('error');
        }

        return isValid;
    }

    /**
     * Добавление валидации к контактной форме
     */
    addFormValidation() {
        const formInputs = this.contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.closest('.form-group').classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }



    /**
     * Обработка отправки героической формы
     */
    addHeroFormSubmission() {
        this.heroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const heroPhoneInput = document.getElementById('heroPhone');
            const phone = heroPhoneInput.value;
            const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

            if (!phoneRegex.test(phone)) {
                // Визуальная обратная связь для неверного телефона
                heroPhoneInput.style.borderColor = '#dc3545';
                heroPhoneInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    heroPhoneInput.style.borderColor = '';
                    heroPhoneInput.style.animation = '';
                }, 500);
                return;
            }

            // Проверяем выбран ли слот
            const slotSelection = window.slotSelection;
            console.log('slotSelection объект:', slotSelection);
            
            const selectedSlotData = slotSelection ? slotSelection.getSelectedSlot() : null;
            console.log('selectedSlotData:', selectedSlotData);
            
            if (!selectedSlotData) {
                console.log('Слот не выбран, показываем alert');
                alert('Пожалуйста, выберите удобное время для клининга');
                return;
            }
            
            console.log('Слот выбран, продолжаем отправку:', selectedSlotData);

            // Получаем выбранные опции
            const selectedCity = document.querySelector('.city-tile.active')?.dataset.city || 'не выбран';
            const selectedObjects = Array.from(document.querySelectorAll('.object-tile.active')).map(t => t.dataset.type);
            const selectedServices = Array.from(document.querySelectorAll('.service-tile.active')).map(t => t.dataset.service);

            const heroFormData = {
                phone: phone,
                city: selectedCity,
                objectTypes: selectedObjects,
                additionalServices: selectedServices
            };

            console.log('Героическая форма отправлена:', heroFormData);

            // Показываем индикатор загрузки
            const submitButton = this.heroForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Отправляем...';
            submitButton.disabled = true;

            // Получаем уникальный ID посетителя
            const visitorId = window.VisitorTracker?.getVisitorId() || window.app?.visitorTracker?.getVisitorId() || null;

            // Отправляем в Telegram
            let telegramSuccess = false;
            try {
                const telegramBot = window.TelegramBot;
                if (telegramBot && telegramBot.isConfigured()) {
                    telegramSuccess = await telegramBot.sendSlotBooking(selectedSlotData, phone, selectedCity, visitorId);
                    if (telegramSuccess) {
                        console.log('✅ Заявка отправлена в Telegram');
                    } else {
                        console.warn('⚠️ Не удалось отправить в Telegram, но форма обработана');
                    }
                } else {
                    console.warn('⚠️ Telegram бот не настроен');
                }
            } catch (error) {
                console.error('❌ Ошибка отправки в Telegram:', error);
            }

            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Визуальная обратная связь об успехе
            this.showHeroSuccessMessage();
        });
    }

    /**
     * Показ сообщения об успехе для контактной формы
     */
    showSuccessMessage() {
        this.contactForm.style.display = 'none';
        this.successMessage.classList.add('show');

        // Сброс формы через 3 секунды
        setTimeout(() => {
            this.contactForm.reset();
            this.contactForm.style.display = 'block';
            this.successMessage.classList.remove('show');
        }, 3000);
    }

    /**
     * Показ сообщения об успехе для героической формы
     */
    showHeroSuccessMessage() {
        const button = this.heroForm.querySelector('.hero-cta-button');
        const originalButtonText = button.textContent;
        
        button.textContent = '✓ Заявка принята!';
        button.style.background = 'linear-gradient(135deg, #9fdc7c, #2d6e2d)';
        
        setTimeout(() => {
            button.textContent = originalButtonText;
            button.style.background = '';
            document.getElementById('heroPhone').value = '';
        }, 3000);
    }

    /**
     * Добавление CSS анимации тряски
     */
    addShakeAnimation() {
        if (!document.querySelector('#shake-animation')) {
            const style = document.createElement('style');
            style.id = 'shake-animation';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Инициализация формы "Свой пакет"
     */
    initCustomPackageForm() {
        const customPackageButton = document.querySelector('.custom-package-button-new');
        if (!customPackageButton) return;

        customPackageButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleCustomPackageSubmission();
        });

        // Добавляем маску для телефона в форме "Свой пакет"
        const phoneInput = document.querySelector('.custom-phone-input-new');
        if (phoneInput) {
            this.addPhoneMask(phoneInput);
        }

        // Устанавливаем начальный текст кнопки с текущей скидкой
        // Небольшая задержка, чтобы DiscountManager успел инициализироваться
        setTimeout(() => {
            this.updateButtonTextWithDiscount();
        }, 100);
    }

    /**
     * Обработка отправки формы "Свой пакет"
     */
    async handleCustomPackageSubmission() {
        try {
            // Собираем данные формы
            const packageData = this.collectCustomPackageData();
            
            // Валидация
            if (!this.validateCustomPackageData(packageData)) {
                return;
            }

            console.log('Форма "Свой пакет" отправлена:', packageData);

            // Показываем индикатор загрузки
            const submitButton = document.querySelector('.custom-package-button-new');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Отправляем...';
            submitButton.disabled = true;

            // Получаем уникальный ID посетителя
            const visitorId = window.VisitorTracker?.getVisitorId() || window.app?.visitorTracker?.getVisitorId() || null;

            // Отправляем в Telegram
            let telegramSuccess = false;
            try {
                const telegramBot = window.TelegramBot;
                if (telegramBot && telegramBot.isConfigured()) {
                    telegramSuccess = await telegramBot.sendCustomPackage(packageData, visitorId);
                }
            } catch (error) {
                console.error('Ошибка отправки в Telegram:', error);
            }

            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            if (telegramSuccess) {
                this.showCustomPackageSuccessMessage();
                this.resetCustomPackageForm();
            } else {
                alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.');
            }

        } catch (error) {
            console.error('Ошибка обработки формы "Свой пакет":', error);
            
            // Восстанавливаем кнопку в случае ошибки
            const submitButton = document.querySelector('.custom-package-button-new');
            if (submitButton) {
                this.updateButtonTextWithDiscount(); // Используем динамический текст
                submitButton.disabled = false;
            }
            
            alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        }
    }

    /**
     * Сбор данных формы "Свой пакет"
     */
    collectCustomPackageData() {
        // Получаем данные из InteractiveManager
        const interactiveManager = window.app?.interactiveManager;
        
        // Собираем дополнительные услуги
        const additionalServices = {};
        const serviceCheckboxes = document.querySelectorAll('.toggle-checkbox-ultra-compact');
        serviceCheckboxes.forEach(checkbox => {
            additionalServices[checkbox.id] = checkbox.checked;
        });

        return {
            phone: document.querySelector('.custom-phone-input-new')?.value || '',
            area: document.getElementById('area')?.value || '',
            propertyType: interactiveManager?.getSelectedPropertyType() || 'не выбран',
            cleaningType: interactiveManager?.getSelectedCleaningType() || 'не выбран',
            additionalServices: additionalServices
        };
    }

    /**
     * Валидация данных формы "Свой пакет"
     */
    validateCustomPackageData(data) {
        if (!data.phone || data.phone.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона');
            document.querySelector('.custom-phone-input-new')?.focus();
            return false;
        }

        if (!data.area || data.area < 1) {
            alert('Пожалуйста, укажите площадь помещения');
            document.getElementById('area')?.focus();
            return false;
        }

        return true;
    }

    /**
     * Обновление текста кнопки на основе текущей скидки
     */
    updateButtonTextWithDiscount() {
        const submitButton = document.querySelector('.custom-package-button-new');
        if (!submitButton) return;

        // Получаем текущую скидку из DiscountManager
        const currentDiscount = window.discountManager?.getCurrentDiscount() || 3;
        
        // Обновляем текст кнопки
        submitButton.textContent = `Зафиксировать ${currentDiscount}%`;
    }

    /**
     * Показ сообщения об успешной отправке формы "Свой пакет"
     */
    showCustomPackageSuccessMessage() {
        const submitButton = document.querySelector('.custom-package-button-new');
        if (submitButton) {
            submitButton.textContent = 'Отправлено';
            submitButton.style.backgroundColor = '#28a745';
            submitButton.disabled = true;
            
            // Через 3 секунды возвращаем исходный вид кнопки
            setTimeout(() => {
                this.updateButtonTextWithDiscount(); // Используем динамический текст
                submitButton.style.backgroundColor = '';
                submitButton.disabled = false;
            }, 3000);
        }
    }

    /**
     * Сброс формы "Свой пакет"
     */
    resetCustomPackageForm() {
        // Очищаем поля
        const phoneInput = document.querySelector('.custom-phone-input-new');
        const areaInput = document.getElementById('area');
        
        if (phoneInput) phoneInput.value = '';
        if (areaInput) areaInput.value = '';

        // Сбрасываем селекторы через InteractiveManager
        const interactiveManager = window.app?.interactiveManager;
        if (interactiveManager) {
            interactiveManager.resetSelections();
        }

        // Сбрасываем чекбоксы дополнительных услуг
        const serviceCheckboxes = document.querySelectorAll('.toggle-checkbox-ultra-compact');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    /**
     * Инициализация промо-формы (теперь просто ссылка на WhatsApp)
     */
    initPromoForm() {
        // Промо-форма теперь является простой ссылкой на WhatsApp
        // Никакой дополнительной инициализации не требуется
    }

    /**
     * Обработка отправки промо-формы
     */
    async handlePromoFormSubmission() {
        const promoPhoneInput = document.getElementById('promo-phone');
        const promoButton = document.querySelector('.promo-btn');

        if (!promoPhoneInput || !promoButton) {
            return;
        }

        const phone = promoPhoneInput.value.trim();

        // Валидация телефона
        if (!phone || phone.length < 18) {
            this.showPromoError('Пожалуйста, введите корректный номер телефона');
            return;
        }

        // Показываем состояние загрузки
        const originalText = promoButton.textContent;
        promoButton.textContent = 'Отправляем...';
        promoButton.disabled = true;

        try {
            // Имитация отправки данных
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Показываем успешное сообщение
            this.showPromoSuccess();
            
            // Очищаем форму
            promoPhoneInput.value = '';

        } catch (error) {
            console.error('Ошибка отправки промо-формы:', error);
            this.showPromoError('Произошла ошибка. Попробуйте еще раз.');
        } finally {
            // Восстанавливаем кнопку
            promoButton.textContent = originalText;
            promoButton.disabled = false;
        }
    }

    /**
     * Показать ошибку промо-формы
     */
    showPromoError(message) {
        const promoForm = document.getElementById('promo-form');
        if (!promoForm) return;

        // Удаляем предыдущие сообщения
        const existingMessage = promoForm.querySelector('.promo-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Создаем сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'promo-message promo-error';
        errorDiv.textContent = message;
        promoForm.appendChild(errorDiv);

        // Удаляем сообщение через 3 секунды
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    /**
     * Показать успешное сообщение промо-формы
     */
    showPromoSuccess() {
        const promoForm = document.getElementById('promo-form');
        if (!promoForm) return;

        // Удаляем предыдущие сообщения
        const existingMessage = promoForm.querySelector('.promo-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Создаем успешное сообщение
        const successDiv = document.createElement('div');
        successDiv.className = 'promo-message promo-success';
        successDiv.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
        promoForm.appendChild(successDiv);

        // Удаляем сообщение через 5 секунд
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }


}

// Делаем класс доступным глобально
window.FormsManager = FormsManager;