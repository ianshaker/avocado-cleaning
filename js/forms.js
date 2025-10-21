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
        this.addShakeAnimation();
        this.initSpotsCounter();
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
     * Инициализация героической формы
     */
    initHeroForm() {
        if (!this.heroForm) return;

        const heroPhoneInput = document.getElementById('heroPhone');
        if (heroPhoneInput) {
            this.addPhoneMask(heroPhoneInput);
        }

        this.addHeroFormSubmission();
    }

    /**
     * Добавление маски телефона к полю ввода
     * @param {HTMLElement} phoneInput - Поле ввода телефона
     */
    addPhoneMask(phoneInput) {
        // Устанавливаем начальное значение с задержкой для корректного отображения
        const setInitialValue = () => {
            if (!phoneInput.value || phoneInput.value === '') {
                phoneInput.value = '+7 (';
                // Принудительно обновляем отображение
                phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };
        
        // Устанавливаем значение сразу и через небольшую задержку
        setInitialValue();
        setTimeout(setInitialValue, 100);

        phoneInput.addEventListener('input', (e) => {
            const input = e.target;
            const cursorPosition = input.selectionStart;
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
            
            // Форматируем номер
            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                    if (value.length >= 4) {
                        formatted += ') ' + value.substring(4, 7);
                        if (value.length >= 7) {
                            formatted += '-' + value.substring(7, 9);
                            if (value.length >= 9) {
                                formatted += '-' + value.substring(9, 11);
                            }
                        }
                    }
                }
            } else {
                formatted = '+7 (';
            }
            
            // Устанавливаем отформатированное значение
            input.value = formatted;
            
            // Восстанавливаем позицию курсора
            let newCursorPosition = cursorPosition;
            if (cursorPosition <= 3) {
                newCursorPosition = 4; // После "+7 ("
            } else if (cursorPosition <= 8) {
                newCursorPosition = Math.min(cursorPosition, formatted.length);
            } else {
                newCursorPosition = formatted.length;
            }
            
            // Устанавливаем курсор в правильную позицию
            setTimeout(() => {
                input.setSelectionRange(newCursorPosition, newCursorPosition);
            }, 0);
        });

        // Обрабатываем событие focus для установки курсора в правильную позицию
        phoneInput.addEventListener('focus', (e) => {
            // Если поле пустое или содержит только placeholder, устанавливаем маску
            if (!e.target.value || e.target.value === '' || e.target.value === e.target.placeholder) {
                e.target.value = '+7 (';
            }
            
            if (e.target.value === '+7 (') {
                setTimeout(() => {
                    e.target.setSelectionRange(4, 4);
                }, 0);
            }
        });

        // Обрабатываем событие keydown для предотвращения удаления префикса
        phoneInput.addEventListener('keydown', (e) => {
            const input = e.target;
            const cursorPosition = input.selectionStart;
            
            // Предотвращаем удаление префикса "+7 ("
            if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 4) {
                e.preventDefault();
                input.setSelectionRange(4, 4);
            }
        });
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

            // Отправляем в Telegram
            let telegramSuccess = false;
            try {
                const telegramBot = window.TelegramBot;
                if (telegramBot && telegramBot.isConfigured()) {
                    telegramSuccess = await telegramBot.sendSlotBooking(selectedSlotData, phone, selectedCity);
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

            // Отправляем в Telegram
            let telegramSuccess = false;
            try {
                const telegramBot = window.TelegramBot;
                if (telegramBot && telegramBot.isConfigured()) {
                    telegramSuccess = await telegramBot.sendCustomPackage(packageData);
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
                submitButton.textContent = 'Отправить на просчет';
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
            rooms: interactiveManager?.getTotalRooms() || document.getElementById('total-rooms')?.textContent || '1',
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
                submitButton.textContent = 'Отправить на просчет';
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


}

// Делаем класс доступным глобально
window.FormsManager = FormsManager;