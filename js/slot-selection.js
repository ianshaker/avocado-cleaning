/**
 * Slot Selection Functions
 * Функции для работы с выбором временных слотов и расчетом дат
 */

class SlotSelection {
    constructor() {
        this.selectedSlot = null;
        this.currentCity = null;
        this.citySchedules = {};
    }

    /**
     * Инициализация компонента выбора слотов
     */
    init() {
        this.updateDates();
        this.bindEvents();
        this.currentCity = document.querySelector('.city-tile.active')?.dataset.city || 'almaty';
        this.bindCityEvents();
        this.applyPseudoOccupancy();
    }

    /**
     * Получение следующих трех дней с форматированием
     * @returns {Array} Массив объектов с датами
     */
    getNextThreeDays() {
        const days = [];
        const today = new Date();
        
        // Начинаем с завтрашнего дня
        for (let i = 1; i <= 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const day = date.getDate();
            const month = this.getMonthName(date.getMonth());
            
            days.push({
                fullDate: date,
                formatted: `${day} ${month}`,
                dayIndex: i - 1
            });
        }
        
        return days;
    }

    /**
     * Получение названия месяца в сокращенном виде
     * @param {number} monthIndex - Индекс месяца (0-11)
     * @returns {string} Сокращенное название месяца
     */
    getMonthName(monthIndex) {
        const months = [
            'янв', 'фев', 'мар', 'апр', 'май', 'июн',
            'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
        ];
        return months[monthIndex];
    }

    /**
     * Обновление дат в HTML
     */
    updateDates() {
        const dates = this.getNextThreeDays();
        const dayLabels = document.querySelectorAll('.day-label');
        
        dayLabels.forEach((label, index) => {
            if (dates[index]) {
                const dateNumber = label.querySelector('.date-number');
                const dateMonth = label.querySelector('.date-month');
                
                if (dateNumber && dateMonth) {
                    const day = dates[index].fullDate.getDate();
                    const month = this.getMonthName(dates[index].fullDate.getMonth());
                    
                    dateNumber.textContent = day;
                    dateMonth.textContent = month;
                }
                
                label.setAttribute('data-date', dates[index].fullDate.toISOString().split('T')[0]);
            }
        });
    }

    /**
     * Привязка событий к временным слотам
     */
    bindEvents() {
        const timeSlots = document.querySelectorAll('.hero .selection-wrapper .time-slot');
        
        timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                // Разрешаем выбор для всех статусов
                this.selectSlot(slot);
            });
        });
    }

    // Привязка переключения городов
    bindCityEvents() {
        const cityTiles = document.querySelectorAll('.city-tile');
        cityTiles.forEach(tile => {
            tile.addEventListener('click', () => {
                const city = tile.dataset.city;
                this.onCityChange(city);
            });
        });
    }

    onCityChange(city) {
        if (city && city !== this.currentCity) {
            this.clearSelection();
        }
        this.currentCity = city || this.currentCity || 'almaty';
        this.applyPseudoOccupancy();
    }

    /**
     * Выбор временного слота
     * @param {HTMLElement} slotElement - Элемент слота
     */
    selectSlot(slotElement) {
        // Убираем выделение с предыдущего слота
        if (this.selectedSlot) {
            this.selectedSlot.classList.remove('selected');
        }

        // Выделяем новый слот
        slotElement.classList.add('selected');
        this.selectedSlot = slotElement;

        // Получаем данные о выбранном слоте
        const day = slotElement.getAttribute('data-day');
        const time = slotElement.getAttribute('data-time');
        const row = slotElement.closest('.schedule-row');
        const dayLabel = row.querySelector('.day-label');
        const date = dayLabel.getAttribute('data-date');

        // Сохраняем выбранные данные
        this.selectedSlotData = {
            day: day,
            time: time,
            date: date,
            discount: Number(slotElement.dataset.discount || 0),
            formatted: `${dayLabel.textContent} в ${time}`
        };

        // Вызываем событие выбора слота
        this.onSlotSelected(this.selectedSlotData);
    }

    /**
     * Обработчик выбора слота
     * @param {Object} slotData - Данные выбранного слота
     */
    onSlotSelected(slotData) {
        console.log('Выбран слот:', slotData);
        
        // Здесь можно добавить дополнительную логику:
        // - Обновление формы
        // - Отправка данных на сервер
        // - Показ подтверждения
        
        // Пример: обновление скрытого поля формы
        const hiddenInput = document.querySelector('input[name="selected_slot"]');
        if (hiddenInput) {
            hiddenInput.value = JSON.stringify(slotData);
        }
    }

    /**
     * Получение данных выбранного слота
     * @returns {Object|null} Данные выбранного слота или null
     */
    getSelectedSlot() {
        return this.selectedSlotData || null;
    }

    /**
     * Сброс выбора
     */
    clearSelection() {
        if (this.selectedSlot) {
            this.selectedSlot.classList.remove('selected');
            this.selectedSlot = null;
            this.selectedSlotData = null;
        }
    }

    /**
     * Обновление расписания (например, при изменении даты)
     */
    refresh() {
        this.clearSelection();
        this.updateDates();
        this.applyPseudoOccupancy();
    }

    /**
     * Псевдологика занятости слотов и рендер аватаров + скидок
     */
    applyPseudoOccupancy() {
        const rows = document.querySelectorAll('.hero .selection-wrapper .schedule-row');
        const city = this.currentCity || (window.getSelectedCity ? window.getSelectedCity() : 'almaty') || 'almaty';
        
        if (!this.citySchedules[city]) {
            this.citySchedules[city] = this.generateCitySchedule(city);
        }
        const schedule = this.citySchedules[city];

        rows.forEach((row, rowIdx) => {
            const slots = Array.from(row.querySelectorAll('.time-slot'));
            const rowStates = schedule[rowIdx] || [];
            
            slots.forEach((slot, i) => {
                const state = rowStates[i];
                if (state) {
                    this.renderSlotOccupancy(slot, state);
                }
            });
        });
    }

    // Генерация детерминированного расписания для города
    generateCitySchedule(city) {
        const freeMapAlmaty = {
            0: [1],       // завтра: середина
            1: [0, 2],    // второй день: крайние
            2: [0, 1, 2]  // третий день: все свободны
        };
        const freeMapAstana = {
            0: [0],       // завтра: первый слот
            1: [0, 1],    // второй день: первый и средний
            2: [0, 1, 2]  // третий день: все свободны
        };
        const discountMap = { 0: 25, 1: 10, 2: 5 };

        const useMap = city === 'astana' ? freeMapAstana : freeMapAlmaty;

        const schedule = [];
        for (let dayIdx = 0; dayIdx < 3; dayIdx++) {
            const rowStates = [];
            for (let timeIdx = 0; timeIdx < 3; timeIdx++) {
                const isFree = (useMap[dayIdx] || []).includes(timeIdx);
                const discount = isFree ? discountMap[dayIdx] : 0;
                rowStates.push({
                    status: isFree ? 'available' : 'limited',
                    avatars: isFree ? 2 : 1,
                    plus: isFree,
                    label: isFree ? 'Много' : 'Мало',
                    discount,
                    timeIdx
                });
            }
            schedule.push(rowStates);
        }
        return schedule;
    }

    extractDayNumber(iso) {
        if (!iso) {
            return new Date().getDate();
        }
        const parts = iso.split('-');
        return Number(parts[2]) || new Date().getDate();
    }

    timeIndex(timeStr) {
        switch (timeStr) {
            case '9-13': return 0;
            case '13-17': return 1;
            case '17-22': return 2;
            default: return 0;
        }
    }

    // Разница в днях от сегодняшнего дня для ISO-даты
    daysAheadFromIso(iso) {
        if (!iso) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const d = new Date(iso);
        d.setHours(0, 0, 0, 0);
        const diffMs = d.getTime() - today.getTime();
        return Math.round(diffMs / 86400000);
    }

    prng(seed) {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return Math.abs(x - Math.floor(x));
    }

    computeOccupancy(dayNum, timeIdx) {
        const r = this.prng(dayNum * 10 + timeIdx * 7);
        let status, avatars, plus, label;
        if (r < 0.2) {
            status = 'limited'; avatars = 1; plus = false; label = 'Мало';
        } else if (r < 0.45) {
            status = 'limited'; avatars = 1; plus = false; label = 'Мало';
        } else if (r < 0.8) {
            status = 'available'; avatars = 2; plus = true; label = 'Много';
        } else {
            status = 'available'; avatars = 2; plus = true; label = 'Много';
        }
        console.log('SlotSelection: Новый label =', label); // Отладка
        return { status, avatars, plus, label };
    }

    renderSlotOccupancy(slot, state) {
        slot.innerHTML = '';
        ['available','limited','occupied'].forEach(c => slot.classList.remove(c));
        slot.classList.add(state.status);
    
        const avatarsWrap = document.createElement('div');
        avatarsWrap.className = 'slot-avatars';
    
        // Массив всех фотографий мастеров
        const masterPhotos = [
            'media/masters/elena.jpg',
            'media/masters/anton.jpg',
            'media/masters/semen.jpg'
        ];
        
        for (let i = 0; i < state.avatars; i++) {
            const av = document.createElement('div');
            av.className = 'avatar';
            // Случайный выбор фотографии мастера для каждого аватара
            const randomPhoto = masterPhotos[Math.floor(Math.random() * masterPhotos.length)];
            av.style.backgroundImage = `url('${randomPhoto}')`;
            av.setAttribute('aria-hidden','true');
            avatarsWrap.appendChild(av);
        }
        if (state.plus) {
            const plus = document.createElement('div');
            plus.className = 'avatar plus';
            plus.textContent = '+';
            plus.setAttribute('aria-label','Много');
            avatarsWrap.appendChild(plus);
        }
        slot.appendChild(avatarsWrap);
    
        const badge = document.createElement('span');
    badge.className = 'slot-badge';
    badge.textContent = state.label;
    slot.appendChild(badge);

    // Подпись для ограниченных слотов
    if (state.status === 'limited') {
        const note = document.createElement('div');
        note.className = 'slot-note';
        note.textContent = 'Под запрос';
        slot.appendChild(note);
    }

    // Бейдж скидки для доступных слотов, если скидка вычислена
    if (state.discount && state.discount > 0 && state.status === 'available') {
        const disc = document.createElement('span');
        disc.className = 'slot-discount';
        disc.textContent = `-${state.discount}%`;
        slot.appendChild(disc);
        slot.dataset.discount = String(state.discount);
    } else {
        delete slot.dataset.discount;
    }
    }
}

// Инициализация происходит через main.js

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlotSelection;
}