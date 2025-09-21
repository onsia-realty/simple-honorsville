// ===========================
// Lazy Loading Implementation
// ===========================

(function() {
    'use strict';

    // Configuration
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.01,
        loadedClass: 'loaded',
        loadingClass: 'loading',
        errorClass: 'error'
    };

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        loadAllImages();
        return;
    }

    // Initialize lazy loading
    document.addEventListener('DOMContentLoaded', initLazyLoad);

    function initLazyLoad() {
        const images = document.querySelectorAll('.lazy-image');
        const imageObserver = createObserver();

        images.forEach(img => {
            // Add loading class
            img.classList.add(config.loadingClass);

            // Create placeholder if needed
            if (!img.src && img.dataset.src) {
                img.src = createPlaceholder(img.width || 1, img.height || 1);
            }

            // Start observing
            imageObserver.observe(img);
        });
    }

    // Create IntersectionObserver instance
    function createObserver() {
        return new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img, () => {
                        observer.unobserve(img);
                    });
                }
            });
        }, config);
    }

    // Load individual image
    function loadImage(img, callback) {
        const src = img.dataset.src;

        if (!src) {
            console.warn('Lazy load: No data-src attribute found', img);
            return;
        }

        // Create a new image to test loading
        const tempImg = new Image();

        tempImg.onload = function() {
            // Image loaded successfully
            img.src = src;
            img.classList.remove(config.loadingClass);
            img.classList.add(config.loadedClass);

            // Handle srcset if present
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }

            // Trigger loaded event
            triggerEvent(img, 'lazyloaded');

            if (callback) callback();
        };

        tempImg.onerror = function() {
            // Image failed to load
            img.classList.remove(config.loadingClass);
            img.classList.add(config.errorClass);

            // Set a fallback image if available
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            } else {
                img.src = createErrorPlaceholder();
            }

            // Trigger error event
            triggerEvent(img, 'lazyerror');

            console.error('Lazy load: Failed to load image', src);

            if (callback) callback();
        };

        // Start loading
        tempImg.src = src;
    }

    // Fallback: Load all images immediately
    function loadAllImages() {
        const images = document.querySelectorAll('.lazy-image');

        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add(config.loadedClass);

                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            }
        });
    }

    // Create a placeholder image (base64 transparent pixel)
    function createPlaceholder(width, height) {
        // 1x1 transparent PNG
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }

    // Create error placeholder
    function createErrorPlaceholder() {
        // Simple SVG error image
        const svg = `
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="20">
                    이미지를 불러올 수 없습니다
                </text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    // Trigger custom event
    function triggerEvent(element, eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    // ===========================
    // Advanced Features
    // ===========================

    // Preload images that are likely to be viewed soon
    function preloadNextImages(currentImg) {
        const images = Array.from(document.querySelectorAll('.lazy-image:not(.loaded)'));
        const currentIndex = images.indexOf(currentImg);

        if (currentIndex !== -1) {
            // Preload next 2 images
            const nextImages = images.slice(currentIndex + 1, currentIndex + 3);
            nextImages.forEach(img => {
                if (img.dataset.src && !img.src) {
                    const preloadImg = new Image();
                    preloadImg.src = img.dataset.src;
                }
            });
        }
    }

    // Handle responsive images
    function handleResponsiveImages() {
        const images = document.querySelectorAll('.lazy-image[data-sizes]');

        images.forEach(img => {
            // Parse sizes from data attribute
            const sizesData = JSON.parse(img.dataset.sizes || '{}');
            const viewportWidth = window.innerWidth;

            // Find appropriate size
            let selectedSrc = img.dataset.src;

            Object.keys(sizesData).forEach(breakpoint => {
                if (viewportWidth >= parseInt(breakpoint)) {
                    selectedSrc = sizesData[breakpoint];
                }
            });

            img.dataset.src = selectedSrc;
        });
    }

    // Add blur-up effect (LQIP - Low Quality Image Placeholder)
    function addBlurUpEffect(img) {
        if (img.dataset.lqip) {
            // Set low quality placeholder
            img.style.filter = 'blur(5px)';
            img.src = img.dataset.lqip;

            // When full image loads, remove blur
            img.addEventListener('lazyloaded', function() {
                img.style.filter = '';
                img.style.transition = 'filter 0.3s';
            });
        }
    }

    // ===========================
    // Performance Monitoring
    // ===========================

    // Track lazy loading performance
    if (window.performance && window.performance.mark) {
        document.addEventListener('lazyloaded', function(e) {
            const imgSrc = e.target.dataset.src;
            window.performance.mark(`lazy-loaded-${imgSrc}`);
        });
    }

    // ===========================
    // Public API
    // ===========================

    window.LazyLoad = {
        // Manually trigger lazy loading for new images
        update: function() {
            initLazyLoad();
        },

        // Force load specific image
        loadImage: function(img) {
            if (img && img.dataset.src) {
                loadImage(img);
            }
        },

        // Load all images in a container
        loadAllInContainer: function(container) {
            const images = container.querySelectorAll('.lazy-image:not(.loaded)');
            images.forEach(img => loadImage(img));
        },

        // Preload specific images
        preload: function(sources) {
            sources.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }
    };

    // ===========================
    // Event Listeners
    // ===========================

    // Handle responsive images on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResponsiveImages, 250);
    });

    // Listen for print event to load all images
    window.addEventListener('beforeprint', function() {
        loadAllImages();
    });

})();

// ===========================
// Background Image Lazy Loading
// ===========================

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', initBackgroundLazyLoad);

    function initBackgroundLazyLoad() {
        const elements = document.querySelectorAll('[data-bg-src]');

        if (!('IntersectionObserver' in window)) {
            // Fallback
            elements.forEach(el => loadBackgroundImage(el));
            return;
        }

        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadBackgroundImage(entry.target);
                    bgObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        elements.forEach(el => bgObserver.observe(el));
    }

    function loadBackgroundImage(element) {
        const bgSrc = element.dataset.bgSrc;
        if (bgSrc) {
            element.style.backgroundImage = `url(${bgSrc})`;
            element.classList.add('bg-loaded');
        }
    }

})();