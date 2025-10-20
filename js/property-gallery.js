/**
 * Property Gallery JavaScript
 * Handles photo gallery functionality for property types section
 */

class PropertyGallery {
    constructor() {
        this.galleries = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initGalleries());
        } else {
            this.initGalleries();
        }
    }

    initGalleries() {
        const galleryContainers = document.querySelectorAll('.property-gallery');
        
        galleryContainers.forEach((container, index) => {
            const gallery = new SingleGallery(container, index);
            this.galleries.push(gallery);
        });
    }
}

class SingleGallery {
    constructor(container, index) {
        this.container = container;
        this.index = index;
        this.currentImageIndex = 0;
        this.images = [];
        this.thumbnails = [];
        
        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
        this.showImage(0);
    }

    setupElements() {
        // Get all main images and thumbnails
        this.images = this.container.querySelectorAll('.main-image');
        this.thumbnails = this.container.querySelectorAll('.thumbnail');
        
        // Get navigation buttons
        this.prevButton = this.container.querySelector('.gallery-prev');
        this.nextButton = this.container.querySelector('.gallery-next');
    }

    bindEvents() {
        // Thumbnail clicks
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                this.showImage(index);
            });
        });

        // Navigation button clicks
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.previousImage();
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextImage();
            });
        }

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });

        // Auto-play functionality (optional)
        this.startAutoPlay();
    }

    showImage(index) {
        // Validate index
        if (index < 0 || index >= this.images.length) {
            return;
        }

        // Update current index
        this.currentImageIndex = index;

        // Hide all images
        this.images.forEach(img => {
            img.classList.remove('active');
        });

        // Show current image
        this.images[index].classList.add('active');

        // Update thumbnails
        this.thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });
        this.thumbnails[index].classList.add('active');
    }

    nextImage() {
        const nextIndex = (this.currentImageIndex + 1) % this.images.length;
        this.showImage(nextIndex);
    }

    previousImage() {
        const prevIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.showImage(prevIndex);
    }

    startAutoPlay() {
        // Auto-play every 5 seconds
        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, 5000);

        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });

        // Resume auto-play when mouse leaves
        this.container.addEventListener('mouseleave', () => {
            this.autoPlayInterval = setInterval(() => {
                this.nextImage();
            }, 5000);
        });
    }

    destroy() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize the gallery system
const propertyGallery = new PropertyGallery();

// Export for potential external use
window.PropertyGallery = PropertyGallery;