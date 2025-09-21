// ===========================
// Main JavaScript
// ===========================

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initProgressBar();
    initStickyHeader();
    initFormValidation();
    initPhoneNumberFormat();
    initSmoothScroll();
    initYouTubePlayer();
    initModal();
    initToast();
});

// ===========================
// Progress Bar
// ===========================
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / windowHeight) * 100;

        progressBar.style.width = progress + '%';
    });
}

// ===========================
// Sticky Header
// ===========================
function initStickyHeader() {
    const header = document.getElementById('stickyHeader');
    let lastScrollTop = 0;
    let scrollThreshold = 300;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                header.classList.remove('show');
            } else {
                // Scrolling up
                header.classList.add('show');
            }
        } else {
            header.classList.remove('show');
        }

        lastScrollTop = scrollTop;
    });
}

// ===========================
// Form Validation
// ===========================
function initFormValidation() {
    const forms = document.querySelectorAll('.registration-form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // Check validation
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Show loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
            submitBtn.disabled = true;

            // Get form data
            const formData = new FormData(form);

            // Simulate form submission (replace with actual submission)
            setTimeout(() => {
                // Reset button
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;

                // Show success message
                showToast('상담 신청이 완료되었습니다! 곧 연락드리겠습니다.', 'success');

                // Reset form
                form.reset();
            }, 2000);

            // For actual form submission, uncomment below:
            // fetch(form.action, {
            //     method: 'POST',
            //     body: formData
            // })
            // .then(response => response.json())
            // .then(data => {
            //     showToast('상담 신청이 완료되었습니다!', 'success');
            //     form.reset();
            // })
            // .catch(error => {
            //     showToast('오류가 발생했습니다. 다시 시도해주세요.', 'error');
            // })
            // .finally(() => {
            //     btnText.style.display = 'inline';
            //     btnLoader.style.display = 'none';
            //     submitBtn.disabled = false;
            // });
        });
    });
}

// ===========================
// Phone Number Auto-Format
// ===========================
function initPhoneNumberFormat() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = value;
                } else if (value.length <= 7) {
                    formattedValue = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    formattedValue = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
                }
            }

            e.target.value = formattedValue;
        });

        input.addEventListener('keydown', function(e) {
            // Allow: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
}

// ===========================
// Smooth Scroll
// ===========================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80; // Header height
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Form Function (for buttons)
function scrollToForm() {
    const form = document.getElementById('form1');
    if (form) {
        const offset = 80;
        const targetPosition = form.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===========================
// YouTube Player (Lazy Load)
// ===========================
function initYouTubePlayer() {
    const players = document.querySelectorAll('.youtube-player');

    players.forEach(player => {
        const videoId = player.getAttribute('data-id');
        const playButton = player.querySelector('.play-button');

        if (playButton) {
            playButton.addEventListener('click', function() {
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', '1');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                player.innerHTML = '';
                player.appendChild(iframe);
            });
        }
    });
}

// ===========================
// Modal Functions
// ===========================
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');

    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside image
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const img = element.querySelector('img');

    if (modal && modalImg && img) {
        modal.classList.add('show');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ===========================
// Toast Notification
// ===========================
function initToast() {
    // Toast is initialized, functions are ready to use
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');

    if (toast && toastMessage) {
        // Set message
        toastMessage.textContent = message;

        // Remove all type classes
        toast.classList.remove('success', 'error', 'info');

        // Add appropriate type class
        toast.classList.add(type);

        // Show toast
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ===========================
// Gallery Lightbox (Additional)
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');

            if (modal && modalImg) {
                modal.classList.add('show');
                modalImg.src = this.src;
                modalImg.alt = this.alt;
                document.body.style.overflow = 'hidden';
            }
        });
    });
});

// ===========================
// Performance Optimization
// ===========================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
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
    };
}

// ===========================
// Export functions for global use
// ===========================
window.scrollToForm = scrollToForm;
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;