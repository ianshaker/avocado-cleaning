/**
 * Модуль для обработки форм
 * Включает валидацию, маски ввода и отправку данных
 */
class FormsManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.heroForm = document.getElementById('heroForm');
        this.successMessage = document.getElementById('successMessage');
        this.currentStep = 1;
        this.totalSteps = 2;
        
        this.init();
    }

    /**
     * Инициализация всех форм
     */
    init() {
        this.initContactForm();
        this.initHeroForm();
        this.addShakeAnimation();
        this.initMultiStepForm();
        this.initSpotsCounter();
    }

    /**
     * Инициализация контактной формы
     */
    initContactForm() {
        if (!this.contactForm) return;

        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            this.addPhoneMask(phoneInput);
        }

        this.addFormValidation();
        this.addContactFormSubmission();
    }

    /**
     * Инициализация многошагового процесса формы
     */
    initMultiStepForm() {
        if (!this.contactForm) return;

        const nextBtn = this.contactForm.querySelector('.next-step-btn');
        const prevBtn = this.contactForm.querySelector('.prev-step-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }

        this.updateProgressBar();
    }

    /**
     * Переход к следующему шагу
     */
    nextStep() {
        const currentStepElement = this.contactForm.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid && this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressBar();
        }
    }

    /**
     * Переход к предыдущему шагу
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgressBar();
        }
    }

    /**
     * Показать определенный шаг
     */
    showStep(step) {
        const steps = this.contactForm.querySelectorAll('.form-step');
        steps.forEach((stepElement, index) => {
            if (index + 1 === step) {
                stepElement.classList.add('active');
            } else {
                stepElement.classList.remove('active');
            }
        });
    }

    /**
     * Обновить прогресс-бар
     */
    updateProgressBar() {
        const progressFill = this.contactForm.querySelector('.progress-fill');
        if (progressFill) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progress}%`;
        }
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
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '8') value = '7' + value.slice(1);
                if (value[0] !== '7') value = '7' + value;
            }
            
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formatted += '-' + value.substring(9, 11);
            }
            
            e.target.value = formatted;
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
     * Обработка отправки контактной формы
     */
    addContactFormSubmission() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formInputs = this.contactForm.querySelectorAll('input, select, textarea');
            let isFormValid = true;
            
            formInputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                const formData = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    service: document.getElementById('service').value,
                    area: document.getElementById('area').value,
                    message: document.getElementById('message').value
                };

                console.log('Контактная форма отправлена:', formData);

                // Показываем сообщение об успехе
                this.showSuccessMessage();
            } else {
                // Прокручиваем к первой ошибке
                const firstError = this.contactForm.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    /**
     * Обработка отправки героической формы
     */
    addHeroFormSubmission() {
        this.heroForm.addEventListener('submit', (e) => {
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


}

// Делаем класс доступным глобально
window.FormsManager = FormsManager;