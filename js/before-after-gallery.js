// Optimized Before/After Gallery Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.before-after-container');
    
    // Throttle function for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    containers.forEach(container => {
        const afterImage = container.querySelector('.after-image');
        const sliderHandle = container.querySelector('.slider-handle');
        let isDragging = false;
        let startX = 0;
        let currentX = 50; // Start at 50% (middle)
        let animationId = null;
        
        // Initialize the slider position
        updateSliderPosition(container, currentX);
        
        // Mouse events
        container.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', throttle(drag, 16)); // ~60fps
        document.addEventListener('mouseup', stopDrag);
        container.addEventListener('mouseleave', stopDrag);
        
        // Touch events for mobile
        container.addEventListener('touchstart', startDragTouch, { passive: false });
        document.addEventListener('touchmove', throttle(dragTouch, 16), { passive: false }); // ~60fps
        document.addEventListener('touchend', stopDrag);
        
        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            container.style.cursor = 'grabbing';
            e.preventDefault();
        }
        
        function startDragTouch(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            // Cancel any pending animation frame
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            animationId = requestAnimationFrame(() => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                currentX = percentage;
                updateSliderPosition(container, percentage);
            });
            
            e.preventDefault();
        }
        
        function dragTouch(e) {
            if (!isDragging) return;
            
            // Cancel any pending animation frame
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            animationId = requestAnimationFrame(() => {
                const rect = container.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                currentX = percentage;
                updateSliderPosition(container, percentage);
            });
            
            e.preventDefault();
        }
        
        function stopDrag() {
            isDragging = false;
            container.style.cursor = 'grab';
            
            // Cancel any pending animation frame
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        
        function updateSliderPosition(container, percentage) {
            const afterImage = container.querySelector('.after-image');
            const sliderHandle = container.querySelector('.slider-handle');
            
            // Use clip-path for proper image masking
            afterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`;
            
            // Update slider handle position
            sliderHandle.style.left = `${percentage}%`;
        }
        
        // Add hover effect for better UX
        container.addEventListener('mouseenter', function() {
            const sliderButton = container.querySelector('.slider-button');
            if (sliderButton) {
                sliderButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
        });
        
        container.addEventListener('mouseleave', function() {
            if (!isDragging) {
                const sliderButton = container.querySelector('.slider-button');
                if (sliderButton) {
                    sliderButton.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            }
        });
        
        // Add click functionality for quick positioning
        container.addEventListener('click', function(e) {
            if (isDragging) return;
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            currentX = percentage;
            
            // Smooth transition to new position
            afterImage.style.transition = 'clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            sliderHandle.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            updateSliderPosition(container, percentage);
            
            // Remove transition after animation
            setTimeout(() => {
                afterImage.style.transition = '';
                sliderHandle.style.transition = '';
            }, 300);
        });
    });
    
    // Intersection Observer for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        observer.observe(item);
    });
    
    // Add keyboard navigation
    containers.forEach((container, index) => {
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'slider');
        container.setAttribute('aria-label', `Галерея до/после ${index + 1}`);
        
        let currentX = 50; // Local variable for each container
        
        container.addEventListener('keydown', function(e) {
            let newPosition = currentX;
            
            switch(e.key) {
                case 'ArrowLeft':
                    newPosition = Math.max(0, currentX - 5);
                    break;
                case 'ArrowRight':
                    newPosition = Math.min(100, currentX + 5);
                    break;
                case 'Home':
                    newPosition = 0;
                    break;
                case 'End':
                    newPosition = 100;
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            currentX = newPosition;
            
            const afterImage = container.querySelector('.after-image');
            const sliderHandle = container.querySelector('.slider-handle');
            
            afterImage.style.transition = 'clip-path 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            sliderHandle.style.transition = 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            
            updateSliderPosition(container, newPosition);
            
            setTimeout(() => {
                afterImage.style.transition = '';
                sliderHandle.style.transition = '';
            }, 200);
        });
    });
    
    // Обработчик для кнопок "Хочу также" - переход на WhatsApp
    const galleryActionButtons = document.querySelectorAll('.gallery-action-button');
    galleryActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Номер WhatsApp
            const whatsappNumber = '77470969648';
            // Сообщение для WhatsApp
            const message = 'Здравствуйте! Хочу заказать уборку как на фото в разделе "До и После". Можете рассчитать стоимость?';
            // Создаем ссылку на WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            // Открываем WhatsApp в новой вкладке
            window.open(whatsappUrl, '_blank');
        });
    });
});