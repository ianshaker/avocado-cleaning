/**
 * Promo Timer Manager
 * Manages countdown timer for daily promotional offers until 22:00 Almaty time
 */

class PromoTimer {
    constructor() {
        this.targetDate = null;
        this.timerInterval = null;
        this.elements = {
            hours: null,
            minutes: null,
            seconds: null,
            timer: null,
            currentDate: null
        };
        this.isActive = false;
    }

    /**
     * Initialize the timer
     */
    init() {
        this.findElements();
        this.setCurrentDate();
        this.setTargetDate();
        this.startTimer();
        console.log('PromoTimer инициализирован');
    }

    /**
     * Find DOM elements
     */
    findElements() {
        this.elements.hours = document.getElementById('hours');
        this.elements.minutes = document.getElementById('minutes');
        this.elements.seconds = document.getElementById('seconds');
        this.elements.timer = document.getElementById('promo-timer');
        this.elements.currentDate = document.getElementById('current-date');

        if (!this.elements.hours || !this.elements.minutes || !this.elements.seconds) {
            console.warn('PromoTimer: Не найдены элементы таймера');
            return false;
        }

        return true;
    }

    /**
     * Set current date in Almaty timezone
     */
    setCurrentDate() {
        // Get current date in Almaty timezone (UTC+6)
        const now = new Date();
        const almatyTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // UTC+6
        
        const options = { 
            day: 'numeric', 
            month: 'long',
            timeZone: 'Asia/Almaty'
        };
        
        const dateString = almatyTime.toLocaleDateString('ru-RU', options);
        
        if (this.elements.currentDate) {
            this.elements.currentDate.textContent = dateString;
        }
        
        console.log('PromoTimer: Текущая дата установлена:', dateString);
    }

    /**
     * Set target date to 22:00 today in Almaty timezone
     */
    setTargetDate() {
        // Get current time in Almaty timezone (UTC+6)
        const now = new Date();
        const almatyNow = new Date(now.getTime() + (6 * 60 * 60 * 1000));
        
        // Set target to 22:00 today in Almaty time
        const targetAlmaty = new Date(almatyNow);
        targetAlmaty.setHours(22, 0, 0, 0);
        
        // If 22:00 has already passed today, set it for tomorrow
        if (almatyNow >= targetAlmaty) {
            targetAlmaty.setDate(targetAlmaty.getDate() + 1);
            // Also update the date display for tomorrow
            this.updateDateForTomorrow();
        }
        
        // Convert back to local time for comparison
        this.targetDate = new Date(targetAlmaty.getTime() - (6 * 60 * 60 * 1000));
        
        console.log('PromoTimer: Целевое время установлено на 22:00 Алматы:', this.targetDate.toLocaleString('ru-RU'));
    }

    /**
     * Update date display for tomorrow if needed
     */
    updateDateForTomorrow() {
        if (!this.elements.currentDate) return;
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const options = { 
            day: 'numeric', 
            month: 'long',
            timeZone: 'Asia/Almaty'
        };
        
        const dateString = tomorrow.toLocaleDateString('ru-RU', options);
        this.elements.currentDate.textContent = dateString;
    }

    /**
     * Start the countdown timer
     */
    startTimer() {
        if (!this.elements.hours || !this.targetDate) {
            console.warn('PromoTimer: Невозможно запустить таймер - отсутствуют элементы или целевая дата');
            return;
        }

        this.isActive = true;
        this.updateTimer(); // Update immediately
        
        // Update every second for real-time display
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);

        console.log('PromoTimer: Таймер запущен');
    }

    /**
     * Update timer display
     */
    updateTimer() {
        if (!this.isActive || !this.targetDate) return;

        const now = new Date();
        const timeDiff = this.targetDate - now;

        if (timeDiff <= 0) {
            this.handleExpired();
            return;
        }

        const timeLeft = this.calculateTimeLeft(timeDiff);
        this.displayTime(timeLeft);
    }

    /**
     * Calculate time left
     */
    calculateTimeLeft(timeDiff) {
        const totalSeconds = Math.floor(timeDiff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return { hours, minutes, seconds };
    }

    /**
     * Display time on the page
     */
    displayTime(timeLeft) {
        if (this.elements.hours) {
            this.elements.hours.textContent = this.formatNumber(timeLeft.hours);
        }
        if (this.elements.minutes) {
            this.elements.minutes.textContent = this.formatNumber(timeLeft.minutes);
        }
        if (this.elements.seconds) {
            this.elements.seconds.textContent = this.formatNumber(timeLeft.seconds);
        }

        // Add urgency effect when time is running low
        this.addUrgencyEffect(timeLeft);
    }

    /**
     * Format number with leading zero
     */
    formatNumber(num) {
        return num.toString().padStart(2, '0');
    }

    /**
     * Add urgency visual effects
     */
    addUrgencyEffect(timeLeft) {
        if (!this.elements.timer) return;

        const totalMinutes = timeLeft.hours * 60 + timeLeft.minutes;
        
        // Remove existing urgency classes
        this.elements.timer.classList.remove('timer-urgent', 'timer-critical');

        // Add urgency classes based on time left
        if (totalMinutes <= 10) { // Less than 10 minutes
            this.elements.timer.classList.add('timer-critical');
        } else if (totalMinutes <= 60) { // Less than 1 hour
            this.elements.timer.classList.add('timer-urgent');
        }
    }

    /**
     * Handle expired timer - reset for next day
     */
    handleExpired() {
        this.stopTimer();
        
        // Reset for tomorrow
        this.setCurrentDate();
        this.setTargetDate();
        this.startTimer();
        
        console.log('PromoTimer: Акция обновлена на следующий день');
    }

    /**
     * Stop the timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isActive = false;
        console.log('PromoTimer: Таймер остановлен');
    }

    /**
     * Get time remaining
     */
    getTimeRemaining() {
        if (!this.targetDate) return null;
        
        const now = new Date();
        const timeDiff = this.targetDate - now;
        
        if (timeDiff <= 0) return null;
        
        return this.calculateTimeLeft(timeDiff);
    }

    /**
     * Check if promo is active
     */
    isPromoActive() {
        return this.isActive && this.targetDate && new Date() < this.targetDate;
    }

    /**
     * Destroy timer and clean up
     */
    destroy() {
        this.stopTimer();
        this.elements = {
            hours: null,
            minutes: null,
            seconds: null,
            timer: null,
            currentDate: null
        };
        console.log('PromoTimer: Уничтожен');
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromoTimer;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.PromoTimer = PromoTimer;
}