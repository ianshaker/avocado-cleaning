/**
 * Consultant Widget - Interactive consultation widget with typing animation
 */

class ConsultantWidget {
    constructor() {
        this.widget = null;
        this.messageElement = null;
        this.replyButton = null;
        this.messages = [
            "Здравствуйте! Меня зовут Ян. Готов помочь вам с уборкой.",
            "Если у вас есть вопросы по ценам — я здесь.",
            "Кстати, сегодня моем КАЖДОЕ 3-е окно бесплатно!",
            "Вы хотите уборку в квартире или в офисе?",
            "На сайте есть удобный калькулятор для просчета.",
            "Также делаем химчистку мебели, ковров и штор.",
            "Могу подсказать по ближайшим слотам для выезда.",
            "Если вам удобно, можем созвониться."
        ];
        this.currentMessageIndex = 0;
        this.rotationInterval = null;
        this.typingSpeed = 80; // milliseconds per character
        this.showDelay = 3000; // 3 seconds delay
        this.messageRotationDelay = 10000; // 10 seconds between messages
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createWidget());
        } else {
            this.createWidget();
        }
    }
    
    createWidget() {
        // Create widget HTML structure
        this.widget = document.createElement('div');
        this.widget.className = 'consultant-widget';
        this.widget.innerHTML = `
            <div class="consultant-widget-content">
                <div class="consultant-message-container">
                    <div class="consultant-avatar">
                        <img src="media/avatar/avatar.jpg" alt="Ян - консультант" />
                    </div>
                    <div class="consultant-message">
                        <span class="typing-text"></span>
                    </div>
                </div>
            </div>
            <button class="consultant-reply-btn">Ответить</button>
        `;
        
        // Get references to elements
        this.messageElement = this.widget.querySelector('.typing-text');
        this.replyButton = this.widget.querySelector('.consultant-reply-btn');
        
        // Add event listeners
        this.replyButton.addEventListener('click', () => this.handleReplyClick());
        
        // Add widget to page
        document.body.appendChild(this.widget);
        
        // Start the show sequence after delay
        setTimeout(() => this.showWidget(), this.showDelay);
    }
    
    showWidget() {
        // Show widget with animation
        this.widget.classList.add('show', 'animate-in');
        
        // Start typing dots animation after widget appears
        setTimeout(() => this.startTypingAnimation(), 400);
    }
    
    startTypingAnimation() {
        // Show typing dots
        this.messageElement.innerHTML = '<span class="typing-dots"><span class="dot-middle"></span></span>';
        
        // After 2 seconds, show the current message with smooth transition
        setTimeout(() => {
            // Clear all animation classes and add fade-out
            this.messageElement.className = 'consultant-message fade-out';
            
            setTimeout(() => {
                const currentMessage = this.messages[this.currentMessageIndex];
                this.messageElement.textContent = currentMessage;
                // Clear all classes and add fade-in
                this.messageElement.className = 'consultant-message fade-in';
                
                // Show reply button only for the first message
                if (this.currentMessageIndex === 0) {
                    this.showReplyButton();
                }
                
                // Start rotation after showing the first message
                if (this.currentMessageIndex === 0) {
                    this.startMessageRotation();
                }
            }, 500);
        }, 2000);
    }
    
    startMessageRotation() {
        // Start rotation only if we haven't reached the last message
        if (this.currentMessageIndex < this.messages.length - 1) {
            this.rotationInterval = setTimeout(() => {
                this.rotateToNextMessage();
            }, this.messageRotationDelay);
        }
    }
    
    rotateToNextMessage() {
        // Move to next message
        this.currentMessageIndex++;
        
        // Clear all classes and add fade-out animation
        this.messageElement.className = 'consultant-message fade-out';
        
        // After fade-out completes, show typing dots
        setTimeout(() => {
            this.messageElement.innerHTML = '<span class="typing-dots"><span class="dot-middle"></span></span>';
            // Clear all classes and add fade-in
            this.messageElement.className = 'consultant-message fade-in';
            
            // After 2 seconds, show the new message
            setTimeout(() => {
                // Clear all classes and add fade-out
                this.messageElement.className = 'consultant-message fade-out';
                
                setTimeout(() => {
                    const currentMessage = this.messages[this.currentMessageIndex];
                    this.messageElement.textContent = currentMessage;
                    // Clear all classes and add fade-in
                    this.messageElement.className = 'consultant-message fade-in';
                    
                    // Continue rotation if not the last message
                    if (this.currentMessageIndex < this.messages.length - 1) {
                        this.startMessageRotation();
                    }
                }, 500);
            }, 2000);
        }, 500);
    }
    
    showReplyButton() {
        setTimeout(() => {
            this.replyButton.classList.add('show');
        }, 300);
    }
    
    handleReplyClick() {
        // Add click animation
        this.replyButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.replyButton.style.transform = '';
        }, 150);
        
        // Here you can add your consultation logic
        // For now, let's show a simple alert or redirect
        this.openConsultation();
    }
    
    openConsultation() {
        // WhatsApp integration with predefined message
        const phoneNumber = "77470969648"; // Основной номер WhatsApp компании
        const message = encodeURIComponent("Добрый день! Хочу продолжить консультацию по уборке");
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        // Открываем WhatsApp в новой вкладке
        window.open(whatsappUrl, '_blank');
        
        // Скрываем виджет после клика
        this.hideWidget();
    }
    
    // Method to hide widget (if needed)
    hideWidget() {
        // Clear rotation interval if it exists
        if (this.rotationInterval) {
            clearTimeout(this.rotationInterval);
            this.rotationInterval = null;
        }
        
        this.widget.classList.remove('show');
        setTimeout(() => {
            if (this.widget && this.widget.parentNode) {
                this.widget.parentNode.removeChild(this.widget);
            }
        }, 400);
    }
    
    // Method to check if widget should be shown on mobile
    isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Method to reposition widget on resize
    handleResize() {
        // Widget automatically repositions via CSS media queries
        // This method can be used for additional responsive logic if needed
    }
}

// Initialize widget when script loads
document.addEventListener('DOMContentLoaded', function() {
    // Only create widget if it doesn't already exist
    if (!document.querySelector('.consultant-widget')) {
        new ConsultantWidget();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Additional resize handling if needed
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsultantWidget;
}