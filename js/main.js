// ===== VARIABLES GLOBALES =====
let isMenuOpen = false;
let lastScrollY = window.scrollY;

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    try {
        initNavigation();
        initScrollEffects();
        initAnimations();
        initVideoPreview();
        initSmoothScrolling();
        initImageErrorHandling();
        initLazyLoading();
        initInteractionAnimations();
        initScrollProgressBar();
        initServicesPage();
        initMissionCardFlip();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
});

// ===== BARRE DE PROGRESSION DE SCROLL =====
function initScrollProgressBar() {
    // Créer la barre de progression
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.scroll-progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = scrollPercent + '%';
    });
}

// ===== PAGE SERVICES =====
function initServicesPage() {
    // Vérifier si on est sur la page services
    if (!document.querySelector('.services-hero')) return;
    
    initServicesHero();
    initVideoSurveillanceSection();
}

function initServicesHero() {
    const heroTitle = document.querySelector('.services-hero-title');
    const navButtons = document.querySelectorAll('.hero-nav-btn');
    
    // Animation du titre
    if (heroTitle) {
        heroTitle.classList.add('animate-slideInLeft');
        heroTitle.style.animationDelay = '0.3s';
    }
    
    // Animation des boutons de navigation
    navButtons.forEach((btn, index) => {
        btn.classList.add('animate-bounceIn');
        btn.style.animationDelay = `${0.6 + (index * 0.2)}s`;
        
        // Ajouter les événements de navigation
        btn.addEventListener('click', function() {
            // Animation de clic
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Ici vous pouvez ajouter la logique pour changer de service
            console.log('Navigation vers:', btn.classList.contains('next-btn') ? 'suivant' : 'précédent');
        });
    });
}

function initVideoSurveillanceSection() {
    const surveillanceImage = document.querySelector('.video-surveillance-image');
    const surveillanceTitle = document.querySelector('.surveillance-title');
    const surveillanceDescription = document.querySelector('.surveillance-description p');
    const features = document.querySelectorAll('.surveillance-features .feature-item');
    const ctaButtons = document.querySelectorAll('.surveillance-cta .btn');
    const playButton = document.querySelector('.video-play-btn');
    
    // Vérifier si IntersectionObserver est supporté
    if (!window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element === surveillanceImage) {
                    element.classList.add('animate-slideInLeft');
                } else if (element === surveillanceTitle) {
                    element.classList.add('animate-fadeInUp');
                } else if (element === surveillanceDescription) {
                    element.classList.add('animate-fadeInUp');
                    element.style.animationDelay = '0.2s';
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.2 });
    
    // Observer les éléments
    if (surveillanceImage) observer.observe(surveillanceImage);
    if (surveillanceTitle) observer.observe(surveillanceTitle);
    if (surveillanceDescription) observer.observe(surveillanceDescription);
    
    // Animer les features avec délai
    features.forEach((feature, index) => {
        feature.classList.add('animate-scaleIn');
        feature.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        feature.classList.add('card-hover');
    });
    
    // Animer les boutons CTA
    ctaButtons.forEach((btn, index) => {
        btn.classList.add('animate-bounceIn');
        btn.style.animationDelay = `${0.9 + (index * 0.2)}s`;
        btn.classList.add('btn-hover');
    });
    
    // Animation spéciale pour le bouton play
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Animation de clic sophistiquée
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            this.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    
                    // Ici vous pouvez ouvrir une modal vidéo
                    openVideoModal('surveillance');
                }, 150);
            }, 150);
        });
    }
}

// Modal vidéo spécifique pour la surveillance
function openVideoModal(type) {
    const modal = document.createElement('div');
    modal.className = 'video-modal surveillance-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                        frameborder="0" 
                        allowfullscreen
                        title="Démonstration vidéosurveillance OneTech">
                </iframe>
            </div>
            <div class="video-info">
                <h3>Système de Vidéosurveillance OneTech</h3>
                <p>Découvrez nos solutions complètes de surveillance</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animation d'ouverture
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        modal.style.transition = 'all 0.3s ease';
        modal.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Fermer la modal
    const closeBtn = modal.querySelector('.video-modal-close');
    closeBtn.addEventListener('click', function() {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Fermer en cliquant en dehors
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
}

// ===== GESTION D'ERREURS IMAGES =====
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image non trouvée:', this.src);
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

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
                    // Vérifier si le lien a un href valide (pas # ou vide)
                    const href = this.getAttribute('href');
                    if (href && href !== '#' && href !== '' && !href.startsWith('#')) {
                        // Laisser la navigation se faire normalement
                        closeMobileMenu();
                        return;
                    }
                    // Sinon, empêcher la navigation et toggle le dropdown
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
        
        // Réinitialiser les effets lors du redimensionnement
        try {
            const heroBackground = document.querySelector('.hero-camera-bg');
            if (heroBackground) {
                heroBackground.style.transform = 'none';
            }
            
            // Plus de gestion du header car il n'est plus fixe
        } catch (error) {
            console.warn('Erreur lors du redimensionnement:', error);
        }
    });
}

function toggleMobileMenu() {
    const navbarMenu = document.getElementById('navbar-menu');
    const navbarToggle = document.getElementById('navbar-toggle');
    
    if (!navbarMenu || !navbarToggle) {
        console.warn('Éléments de navigation non trouvés');
        return;
    }
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        // Animation d'ouverture
        navbarMenu.classList.add('active');
        navbarMenu.classList.add('nav-slide-in');
        navbarMenu.classList.remove('nav-slide-out');
        
        // Animer les liens du menu avec délai
        const navLinks = navbarMenu.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(50px)';
            setTimeout(() => {
                link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, index * 100);
        });
    } else {
        // Animation de fermeture
        navbarMenu.classList.remove('active');
        navbarMenu.classList.add('nav-slide-out');
        navbarMenu.classList.remove('nav-slide-in');
    }
    
    navbarToggle.classList.toggle('active', isMenuOpen);
    
    // Accessibilité ARIA
    navbarToggle.setAttribute('aria-expanded', isMenuOpen);
    navbarToggle.setAttribute('aria-label', isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    
    // Animation du bouton hamburger améliorée
    animateHamburgerAdvanced(isMenuOpen);
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    // Focus management avec animation
    if (isMenuOpen) {
        setTimeout(() => {
            navbarMenu.focus();
        }, 300);
    }
}

// Animation hamburger améliorée
function animateHamburgerAdvanced(isOpen) {
    const spans = document.querySelectorAll('.navbar-toggle span');
    
    spans.forEach(span => {
        span.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });
    
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[1].style.transform = 'scale(0)';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[1].style.transform = 'scale(1)';
        spans[2].style.transform = 'none';
    }
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
    // Fonction simplifiée - pas d'effets sur header car il n'est plus fixe
    // Conserver pour d'autres effets de scroll si nécessaire
    
    // Parallax désactivé - fonction vide pour éviter les erreurs
    return;
}

function parallaxEffect() {
    // Désactiver complètement le parallax pour éviter les bugs
    return;
    
    /* Version simplifiée pour éviter les bugs
    const heroBackground = document.querySelector('.hero-camera-bg');
    
    if (!heroBackground || window.innerWidth <= 768) return;
    
    const scrolled = window.pageYOffset;
    
    // Effet très léger et limité
    if (scrolled <= window.innerHeight) {
        const rate = scrolled * -0.1; // Très léger
        heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
    */
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Vérifier si IntersectionObserver est supporté
    if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver non supporté - animations désactivées');
        return;
    }
    
    // Options pour l'observer
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.15
    };

    // Observer pour les animations d'entrée
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                const delay = element.dataset.delay || '0';
                
                // Appliquer l'animation avec délai
                setTimeout(() => {
                    element.classList.add(`animate-${animationType}`);
                    element.classList.add('animate-visible');
                }, parseInt(delay));
                
                // Arrêter d'observer une fois animé
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Animation du Hero (immédiate)
    initHeroAnimations();
    
    // Animation du Header
    initHeaderAnimations();
    
    // Observer les sections principales
    initSectionAnimations(observer);
    
    // Observer les cartes de service
    initServiceCardsAnimations(observer);
    
    // Observer les cartes de mission
    initMissionCardsAnimations(observer);
    
    // Animation des statistiques
    initStatsAnimation();
    
    // Animations hover
    initHoverAnimations();
}

// Animation du Hero
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroActions = document.querySelector('.hero-actions');
    
    if (heroTitle) {
        heroTitle.classList.add('animate-slideInLeft');
        heroTitle.style.animationDelay = '0.3s';
    }
    
    if (heroDescription) {
        heroDescription.classList.add('animate-fadeInUp');
        heroDescription.style.animationDelay = '0.6s';
    }
    
    if (heroActions) {
        heroActions.classList.add('animate-fadeInUp');
        heroActions.style.animationDelay = '0.9s';
    }
}

// Animation du Header
function initHeaderAnimations() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.add('animate-fadeInDown');
    }
}

// Animation des sections
function initSectionAnimations(observer) {
    const sections = [
        { selector: '.about-title', animation: 'slideInLeft', delay: 200 },
        { selector: '.about-description', animation: 'fadeInUp', delay: 400 },
        { selector: '.services-title', animation: 'fadeInUp', delay: 200 },
        { selector: '.mission-title', animation: 'fadeInUp', delay: 200 },
        { selector: '.process-title', animation: 'fadeInUp', delay: 200 }
    ];
    
    sections.forEach(section => {
        const element = document.querySelector(section.selector);
        if (element) {
            element.dataset.animation = section.animation;
            element.dataset.delay = section.delay;
            element.classList.add('animate-hidden');
            observer.observe(element);
        }
    });
}

// Animation des cartes de service
function initServiceCardsAnimations(observer) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        card.dataset.animation = 'scaleIn';
        card.dataset.delay = (index * 200).toString();
        card.classList.add('animate-hidden', 'card-hover', 'gpu-optimized');
        observer.observe(card);
    });
    
    // Cartes de la section "Nos Services"
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach((item, index) => {
        item.dataset.animation = 'fadeInUp';
        item.dataset.delay = (index * 150).toString();
        item.classList.add('animate-hidden', 'image-hover', 'gpu-optimized');
        observer.observe(item);
    });
}

// Animation des cartes de mission
function initMissionCardsAnimations(observer) {
    const missionCards = document.querySelectorAll('.mission-card');
    
    missionCards.forEach((card, index) => {
        card.dataset.animation = 'slideInStagger';
        card.dataset.delay = (index * 150).toString();
        card.classList.add('animate-hidden', 'card-hover', 'gpu-optimized');
        observer.observe(card);
    });
}

// Animation des statistiques
function initStatsAnimation() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.classList.add('counter-animation');
        setTimeout(() => {
            card.classList.add('animate-bounceIn');
        }, index * 200);
    });
    
    // Démarrer l'animation des chiffres après un délai
    setTimeout(() => {
        animateStats();
    }, 1000);
}

// Animations hover
function initHoverAnimations() {
    // Boutons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.classList.add('btn-hover', 'smooth-transition');
    });
    
    // Images
    const images = document.querySelectorAll('.service-img, .about-img, .service-bg-img, .card-bg-img');
    images.forEach(img => {
        if (img.parentElement) {
            img.parentElement.classList.add('image-hover');
        }
    });
    
    // Icônes
    const icons = document.querySelectorAll('.nav-link i, .contact-item i, .address-item i, .card-icon i');
    icons.forEach(icon => {
        icon.classList.add('icon-hover');
    });
    
    // Logo avec animation subtle
    const logo = document.querySelector('.logo-img');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.05)';
            logo.style.transition = 'transform 0.3s ease';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1)';
        });
    }
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const finalValue = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (isNaN(finalValue)) return;
        
        const duration = 2000; // 2 secondes
        const increment = finalValue / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            
            if (text.includes('+')) {
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
        // Animation de pulsation pour attirer l'attention
        playButton.classList.add('pulse-animation');
        
        playButton.addEventListener('click', function() {
            // Animation de click sophistiquée
            this.style.transition = 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            this.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                this.style.transform = 'translate(-50%, -50%) scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'translate(-50%, -50%) scale(1)';
                    openVideoModal();
                }, 100);
            }, 100);
        });
        
        // Animation hover
        playButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.15)';
            this.style.boxShadow = '0 0 30px rgba(255, 149, 0, 0.6)';
        });
        
        playButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
            this.style.boxShadow = '0 0 20px rgba(255, 149, 0, 0.3)';
        });
    }
    
    if (videoCard) {
        videoCard.classList.add('image-hover', 'smooth-transition');
    }
}

// Animation pour les formulaires et interactions
function initInteractionAnimations() {
    // Animation des liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animation des boutons de contact
    const contactBtns = document.querySelectorAll('.btn-contact');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Effet de ripple
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Animation des éléments au focus
    const focusElements = document.querySelectorAll('button, a, input');
    focusElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-orange)';
            this.style.outlineOffset = '2px';
            this.style.transition = 'outline 0.2s ease';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
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
            
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const targetPosition = target.offsetTop - 20; // Simple offset pour l'espacement
                
                // Utiliser une animation plus douce
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 seconde
                
                let startTime = null;
                
                function animateScroll(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Fonction d'easing
                    const ease = progress * (2 - progress);
                    const position = startPosition + (distance * ease);
                    
                    window.scrollTo(0, position);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    }
                }
                
                requestAnimationFrame(animateScroll);
                
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
// Optimisation des événements de scroll - Déjà géré dans initScrollEffects()
// const optimizedScrollHandler = throttle(function() {
//     // Logique de scroll optimisée
// }, 16); // 60fps

// window.addEventListener('scroll', optimizedScrollHandler);

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
    
    .service-card,
    .mission-card {
        transition: all 0.3s ease;
    }
    
    .service-card:hover,
    .mission-card:hover {
        transform: translateY(-5px);
    }
    
    /* Barre de progression de scroll */
    .scroll-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(255, 255, 255, 0.1);
        z-index: 9999;
    }
    
    .scroll-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-orange), var(--primary-dark));
        width: 0%;
        transition: width 0.1s ease;
    }
    
    /* Effet ripple pour les boutons */
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Animation de loading pour les images */
    .image-loading {
        position: relative;
        overflow: hidden;
    }
    
    .image-loading::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    /* Animations pour les éléments de navigation mobile */
    .navbar-menu.active {
        animation: menuSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    @keyframes menuSlideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Animation des dropdowns */
    .dropdown-menu {
        animation: dropdownFadeIn 0.3s ease-out forwards;
        transform-origin: top center;
    }
    
    @keyframes dropdownFadeIn {
        0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .hero-text > *,
    .hero-visual {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .hero-text > *:nth-child(1) { transition-delay: 0.1s; }
    .hero-text > *:nth-child(2) { transition-delay: 0.2s; }
    .hero-text > *:nth-child(3) { transition-delay: 0.3s; }
    .hero-visual { transition-delay: 0.4s; }
`;

document.head.appendChild(style);

// ===== GESTION DES ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== GESTION DES ERREURS D'IMAGES =====
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Image non trouvée:', this.src);
            this.style.display = 'none';
            
            // Ajouter un placeholder si nécessaire
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = 'Image non disponible';
            placeholder.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f0f0f0;
                color: #666;
                font-size: 14px;
                height: ${this.height || 200}px;
                width: ${this.width || '100%'};
            `;
            
            this.parentNode.insertBefore(placeholder, this);
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
    // Lazy loading pour les images avec data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }
    
    // Amélioration du chargement des images existantes
    const allImages = document.querySelectorAll('img:not([data-src])');
    allImages.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '1';
            });
        }
    });
}

// ===== MISSION CARDS FLIP EFFECT - VERSION SIMPLE ===== 
function initMissionCardFlip() {
    // Attendre que le DOM soit chargé
    setTimeout(() => {
        const flipCards = document.querySelectorAll('.flip-card');
        
        flipCards.forEach(card => {
            const flipBtn = card.querySelector('.flip-btn');
            const cardInner = card.querySelector('.flip-card-inner');
            
            // Clic sur le bouton + pour retourner
            if (flipBtn) {
                flipBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Sauvegarder la position de défilement actuelle
                    const currentScrollY = window.scrollY;
                    
                    // Fermer toutes les autres cartes
                    flipCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('flipped');
                        }
                    });
                    
                    // Retourner la carte actuelle
                    card.classList.add('flipped');
                    
                    // Restaurer la position de défilement pour empêcher le mouvement
                    setTimeout(() => {
                        window.scrollTo(0, currentScrollY);
                    }, 10);
                });
            }
            
            // Clic sur toute la carte pour la remettre à l'endroit
            if (cardInner) {
                cardInner.addEventListener('click', (e) => {
                    // Seulement si la carte est retournée
                    if (card.classList.contains('flipped')) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Sauvegarder la position de défilement actuelle
                        const currentScrollY = window.scrollY;
                        
                        card.classList.remove('flipped');
                        
                        // Restaurer la position de défilement
                        setTimeout(() => {
                            window.scrollTo(0, currentScrollY);
                        }, 10);
                    }
                });
            }
        });
        
        // Fermeture avec Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                flipCards.forEach(card => card.classList.remove('flipped'));
            }
        });
        
    }, 200);
}

// Animation d'entrée pour les cartes mission (amélioration)
function enhanceMissionCardAnimations() {
    if (!window.IntersectionObserver) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(document.querySelectorAll('.mission-card')).indexOf(card);
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
                
                observer.unobserve(card);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.mission-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.9)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}