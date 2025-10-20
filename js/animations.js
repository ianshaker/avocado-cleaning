/**
 * Модуль анимаций
 * Управляет всеми анимациями на сайте, включая fade-in эффекты, плавную прокрутку и загрузку видео
 */

class AnimationsManager {
    constructor() {
        this.observer = null;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        this.initFadeInObserver();
        this.initSmoothScrolling();
        this.initPageLoadAnimation();
        this.initProgressiveVideoLoading();
        this.handleReducedMotion();
    }

    /**
     * Инициализация наблюдателя для fade-in анимаций
     */
    initFadeInObserver() {
        // Создаем наблюдатель пересечений для анимации появления элементов
        // Оптимизировано для Chrome - уменьшена частота срабатываний
        this.observer = new IntersectionObserver((entries) => {
            // Используем requestAnimationFrame для оптимизации производительности
            requestAnimationFrame(() => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                        entry.target.classList.add('fade-in');
                        // Прекращаем наблюдение за элементом после анимации
                        this.observer.unobserve(entry.target);
                    }
                });
            });
        }, {
            threshold: [0.1, 0.25], // Множественные пороги для более точного контроля
            rootMargin: '0px 0px -30px 0px' // Уменьшен отступ для более раннего срабатывания
        });

        // Наблюдаем за элементами, которые должны анимироваться
        const elementsToAnimate = document.querySelectorAll('.service-card, .benefit-card');
        elementsToAnimate.forEach(element => {
            this.observer.observe(element);
        });
    }

    /**
     * Инициализация плавной прокрутки для якорных ссылок
     */
    initSmoothScrolling() {
        // Обработка всех ссылок с якорями
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Анимация загрузки страницы
     */
    initPageLoadAnimation() {
        // Убираем класс загрузки после полной загрузки страницы
        window.addEventListener('load', () => {
            document.body.classList.remove('loading');
            
            // Добавляем класс для запуска анимаций
            setTimeout(() => {
                document.body.classList.add('loaded');
            }, 100);
        });
    }

    /**
     * Прогрессивная загрузка видео
     */
    initProgressiveVideoLoading() {
        // Ищем видео в секции владельца (существующая структура)
        const ownerImage = document.getElementById('owner-image');
        const ownerVideo = document.getElementById('owner-video');
        
        if (ownerImage && ownerVideo) {
            // Убеждаемся, что изображение видимо изначально
            ownerImage.style.display = 'block';
            ownerImage.style.opacity = '1';
            ownerVideo.style.display = 'none';
            
            // Функция для показа видео
            const showOwnerVideo = () => {
                // Плавно скрываем изображение
                ownerImage.style.transition = 'opacity 0.5s ease';
                ownerImage.style.opacity = '0';
                
                setTimeout(() => {
                    ownerImage.style.display = 'none';
                    ownerVideo.style.display = 'block';
                    ownerVideo.style.opacity = '0';
                    ownerVideo.style.transition = 'opacity 0.5s ease';
                    
                    // Плавно показываем видео
                    setTimeout(() => {
                        ownerVideo.style.opacity = '1';
                    }, 50);
                }, 500);
            };

            // Функция для загрузки и показа видео
            const loadOwnerVideo = () => {
                // Проверяем, готово ли видео к воспроизведению (кэшированное)
                if (ownerVideo.readyState >= 3) {
                    // Видео уже загружено (из кэша), сразу показываем
                    showOwnerVideo();
                } else {
                    // Видео не загружено, начинаем загрузку
                    ownerVideo.load();
                    
                    // Когда видео готово к воспроизведению
                    ownerVideo.addEventListener('canplaythrough', () => {
                        showOwnerVideo();
                    }, { once: true });
                    
                    // Обработка ошибок загрузки
                    ownerVideo.addEventListener('error', () => {
                        console.warn('Ошибка загрузки видео владельца, оставляем изображение');
                    }, { once: true });
                }
            };
            
            // Создаем наблюдатель для ленивой загрузки видео
            // Оптимизировано для Chrome
            const videoObserver = new IntersectionObserver((entries) => {
                requestAnimationFrame(() => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                            loadOwnerVideo();
                            videoObserver.unobserve(entry.target);
                        }
                    });
                });
            }, {
                threshold: [0.2, 0.5], // Множественные пороги
                rootMargin: '50px' // Уменьшен отступ для лучшей производительности
            });
            
            // Наблюдаем за контейнером с фото владельца
            const ownerPhotoContainer = ownerImage.closest('.owner-photo');
            if (ownerPhotoContainer) {
                videoObserver.observe(ownerPhotoContainer);
            }
        }

        // Обрабатываем сервисные видео
        const serviceVideos = [
            { imageId: 'service-image-full', videoId: 'service-video-full' },
            { imageId: 'service-image-fast', videoId: 'service-video-fast' },
            { imageId: 'service-image-chip', videoId: 'service-video-chip' }
        ];

        serviceVideos.forEach(({ imageId, videoId }) => {
            const serviceImage = document.getElementById(imageId);
            const serviceVideo = document.getElementById(videoId);
            
            if (serviceImage && serviceVideo) {
                // Убеждаемся, что изображение видимо изначально
                serviceImage.style.display = 'block';
                serviceImage.style.opacity = '1';
                serviceVideo.style.display = 'none';
                
                // Функция для показа видео
                const showServiceVideo = () => {
                    // Плавно скрываем изображение
                    serviceImage.style.transition = 'opacity 0.5s ease';
                    serviceImage.style.opacity = '0';
                    
                    setTimeout(() => {
                        serviceImage.style.display = 'none';
                        serviceVideo.style.display = 'block';
                        serviceVideo.style.opacity = '0';
                        serviceVideo.style.transition = 'opacity 0.5s ease';
                        
                        // Плавно показываем видео
                        setTimeout(() => {
                            serviceVideo.style.opacity = '1';
                        }, 50);
                    }, 500);
                };

                // Функция для загрузки и показа видео
                const loadServiceVideo = () => {
                    // Проверяем, готово ли видео к воспроизведению (кэшированное)
                    if (serviceVideo.readyState >= 3) {
                        // Видео уже загружено (из кэша), сразу показываем
                        showServiceVideo();
                    } else {
                        // Видео не загружено, начинаем загрузку
                        serviceVideo.load();
                        
                        // Когда видео готово к воспроизведению
                        serviceVideo.addEventListener('canplaythrough', () => {
                            showServiceVideo();
                        }, { once: true });
                        
                        // Обработка ошибок загрузки
                        serviceVideo.addEventListener('error', () => {
                            console.warn(`Ошибка загрузки видео ${videoId}, оставляем изображение`);
                        }, { once: true });
                    }
                };
                
                // Создаем наблюдатель для ленивой загрузки видео
                const serviceVideoObserver = new IntersectionObserver((entries) => {
                    requestAnimationFrame(() => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
                                loadServiceVideo();
                                serviceVideoObserver.unobserve(entry.target);
                            }
                        });
                    });
                }, {
                    threshold: [0.2, 0.5],
                    rootMargin: '50px'
                });
                
                // Наблюдаем за контейнером сервисного видео
                const serviceVideoContainer = serviceImage.closest('.service-video-section');
                if (serviceVideoContainer) {
                    serviceVideoObserver.observe(serviceVideoContainer);
                }
            }
        });

        // Также ищем другие видео контейнеры (для будущего использования)
        const videoContainers = document.querySelectorAll('.video-container');
        
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            const poster = container.querySelector('.video-poster');
            
            if (video && poster) {
                // Показываем постер изначально
                poster.style.display = 'block';
                video.style.display = 'none';
                
                // Функция для показа видео
                const showVideo = () => {
                    // Плавно скрываем постер
                    poster.style.transition = 'opacity 0.5s ease';
                    poster.style.opacity = '0';
                    
                    setTimeout(() => {
                        poster.style.display = 'none';
                        video.style.display = 'block';
                        video.style.opacity = '0';
                        video.style.transition = 'opacity 0.5s ease';
                        
                        // Плавно показываем видео
                        setTimeout(() => {
                            video.style.opacity = '1';
                        }, 50);
                    }, 500);
                };
                
                // Функция для загрузки и показа видео
                const loadVideo = () => {
                    // Проверяем, готово ли видео к воспроизведению (кэшированное)
                    if (video.readyState >= 3) {
                        // Видео уже загружено (из кэша), сразу показываем
                        showVideo();
                    } else {
                        // Видео не загружено, начинаем загрузку
                        video.load();
                        
                        // Когда видео готово к воспроизведению
                        video.addEventListener('canplaythrough', () => {
                            showVideo();
                        }, { once: true });
                        
                        // Обработка ошибок загрузки
                        video.addEventListener('error', () => {
                            console.warn('Ошибка загрузки видео, оставляем постер');
                        }, { once: true });
                    }
                };
                
                // Создаем наблюдатель для ленивой загрузки видео
                const videoObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadVideo();
                            videoObserver.unobserve(container);
                        }
                    });
                }, {
                    threshold: 0.25,
                    rootMargin: '100px'
                });
                
                videoObserver.observe(container);
            }
        });
    }

    /**
     * Обработка настроек пониженной анимации
     */
    handleReducedMotion() {
        if (this.reducedMotion) {
            // Отключаем анимации для пользователей с настройкой "reduce motion"
            document.body.classList.add('reduced-motion');
            
            // Отключаем анимированные элементы
            const animatedElements = document.querySelectorAll('.bubbles, .floating-logo, .floating-icon');
            animatedElements.forEach(element => {
                element.style.animation = 'none';
                element.style.transform = 'none';
            });
            
            console.log('Анимации отключены в соответствии с настройками пользователя');
        }
    }

    /**
     * Принудительная загрузка всех видео (для отладки)
     */
    forceLoadAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.readyState < 3) {
                video.load();
            }
        });
    }

    /**
     * Очистка наблюдателей при уничтожении
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Делаем класс доступным глобально
window.AnimationsManager = AnimationsManager;