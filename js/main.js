// ===== VARIABLES GLOBALES =====
let isMenuOpen = false;
let lastScrollY = window.scrollY;

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initVideoPreview();
    initSmoothScrolling();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Toggle menu mobile
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }

    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
            
            // Gestion de l'état actif
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Gestion des dropdowns sur mobile
    dropdowns.forEach(dropdown => {
        const navLink = dropdown.querySelector('.nav-link');
        
        if (navLink) {
            navLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    toggleDropdown(dropdown);
                }
            });
        }
    });

    // Fermer le menu mobile lors du clic en dehors
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navbarMenu.contains(e.target) && !navbarToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Fermer le menu mobile lors du redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navbarMenu = document.getElementById('navbar-menu');
    const navbarToggle = document.getElementById('navbar-toggle');
    
    isMenuOpen = !isMenuOpen;
    
    navbarMenu.classList.toggle('active', isMenuOpen);
    navbarToggle.classList.toggle('active', isMenuOpen);
    
    // Animation du bouton hamburger
    animateHamburger(isMenuOpen);
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    const navbarMenu = document.getElementById('navbar-menu');
    const navbarToggle = document.getElementById('navbar-toggle');
    
    isMenuOpen = false;
    navbarMenu.classList.remove('active');
    navbarToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    animateHamburger(false);
}

function toggleDropdown(dropdown) {
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const isOpen = dropdown.classList.contains('active');
    
    // Fermer tous les autres dropdowns
    document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('active');
        }
    });
    
    dropdown.classList.toggle('active', !isOpen);
}

function animateHamburger(isOpen) {
    const spans = document.querySelectorAll('.navbar-toggle span');
    
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ===== EFFETS DE SCROLL =====
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Effet de transparence du header
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Cacher/afficher le header selon la direction du scroll
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY) {
                // Scroll vers le bas - cacher le header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scroll vers le haut - afficher le header
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        // Parallax léger pour la section hero
        parallaxEffect();
    });
}

function parallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Observer pour les animations au scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animateElements = document.querySelectorAll('.hero-text > *, .hero-visual, .stat-card, .feature-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Animation des statistiques
    animateStats();
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        const duration = 2000; // 2 secondes
        const increment = finalValue / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            
            if (stat.textContent.includes('+')) {
                stat.textContent = Math.floor(current) + '+';
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ===== VIDEO PREVIEW =====
function initVideoPreview() {
    const playButton = document.querySelector('.play-button');
    const videoCard = document.querySelector('.video-preview-card');
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Animation du bouton
            this.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                this.style.transform = 'translate(-50%, -50%) scale(1)';
                
                // Ici vous pouvez ajouter la logique pour ouvrir une modal vidéo
                openVideoModal();
            }, 150);
        });
    }
    
    if (videoCard) {
        videoCard.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        videoCard.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

function openVideoModal() {
    // Créer une modal pour la vidéo
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                        frameborder="0" 
                        allowfullscreen>
                </iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermer la modal
    const closeBtn = modal.querySelector('.video-modal-close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Fermer la modal en cliquant en dehors
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                if (isMenuOpen) {
                    closeMobileMenu();
                }
            }
        });
    });
}

// ===== UTILITAIRES =====
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

// ===== PERFORMANCE =====
// Optimisation des événements de scroll
const optimizedScrollHandler = throttle(function() {
    // Logique de scroll optimisée
}, 16); // 60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===== CSS DYNAMIQUE =====
// Ajouter des styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    .video-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .video-modal-content {
        position: relative;
        width: 90%;
        max-width: 800px;
        aspect-ratio: 16/9;
    }
    
    .video-modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
        transition: opacity 0.3s ease;
    }
    
    .video-modal-close:hover {
        opacity: 0.7;
    }
    
    .video-container {
        width: 100%;
        height: 100%;
    }
    
    .video-container iframe {
        width: 100%;
        height: 100%;
        border-radius: 8px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .header.scrolled {
        background: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(20px);
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .navbar-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }
    
    .navbar-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .navbar-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }
`;

document.head.appendChild(style);

// ===== GESTION DES ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialiser le lazy loading si nécessaire
document.addEventListener('DOMContentLoaded', initLazyLoading);