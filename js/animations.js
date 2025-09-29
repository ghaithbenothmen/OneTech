// ===== GESTIONNAIRE D'ANIMATIONS ONETECH =====

class AnimationManager {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.animations = new Map();
        this.observers = new Map();
        
        this.init();
    }
    
    init() {
        // Détecter les changements de préférence
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.updateAnimations();
        });
        
        // Gérer les performances selon l'appareil
        this.detectPerformance();
        
        console.log('🎬 Animation Manager initialisé');
    }
    
    detectPerformance() {
        // Détecter si c'est un appareil faible performance
        const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                        navigator.deviceMemory <= 4 || 
                        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isLowEnd) {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
            console.log('📱 Mode performance optimisée activé');
        }
    }
    
    registerAnimation(element, animationType, options = {}) {
        if (!element) return;
        
        const animationId = this.generateId();
        
        const config = {
            element,
            type: animationType,
            delay: options.delay || 0,
            duration: options.duration || 600,
            easing: options.easing || 'ease-out',
            threshold: options.threshold || 0.15,
            ...options
        };
        
        this.animations.set(animationId, config);
        
        if (this.isReducedMotion) {
            this.applyReducedMotion(element);
        } else {
            this.setupIntersectionObserver(animationId, config);
        }
        
        return animationId;
    }
    
    setupIntersectionObserver(id, config) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(id);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: config.threshold,
            rootMargin: '50px'
        });
        
        observer.observe(config.element);
        this.observers.set(id, observer);
    }
    
    triggerAnimation(animationId) {
        const config = this.animations.get(animationId);
        if (!config) return;
        
        const { element, type, delay, duration } = config;
        
        setTimeout(() => {
            if (!this.isReducedMotion) {
                element.classList.add(`animate-${type}`);
                element.style.animationDuration = `${duration}ms`;
            }
            
            element.classList.add('animate-visible');
            
            // Callback après animation
            if (config.onComplete) {
                setTimeout(config.onComplete, duration);
            }
        }, delay);
    }
    
    applyReducedMotion(element) {
        element.classList.add('animate-visible');
        element.style.animation = 'none';
        element.style.transition = 'none';
    }
    
    updateAnimations() {
        this.animations.forEach((config, id) => {
            if (this.isReducedMotion) {
                this.applyReducedMotion(config.element);
            }
        });
    }
    
    generateId() {
        return 'anim_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Méthodes utilitaires
    pauseAll() {
        document.querySelectorAll('[class*="animate-"]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
    
    resumeAll() {
        document.querySelectorAll('[class*="animate-"]').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
    
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

// ===== ANIMATIONS PERSONNALISÉES ONETECH =====

class OneTechAnimations {
    constructor() {
        this.manager = new AnimationManager();
        this.initCustomAnimations();
    }
    
    initCustomAnimations() {
        // Animation du logo avec effet de brillance
        this.animateLogo();
        
        // Animation des statistiques avec compteur
        this.animateCounters();
        
        // Animation de typing pour les titres
        this.animateTyping();
        
        // Particules flottantes pour l'ambiance
        this.createFloatingParticles();
    }
    
    animateLogo() {
        const logo = document.querySelector('.logo-img');
        if (!logo) return;
        
        // Effet de brillance périodique
        setInterval(() => {
            logo.style.filter = 'brightness(1.2)';
            setTimeout(() => {
                logo.style.filter = 'brightness(1)';
            }, 200);
        }, 5000);
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            this.manager.registerAnimation(counter, 'fadeInUp', {
                onComplete: () => {
                    this.startCounter(counter);
                }
            });
        });
    }
    
    startCounter(element) {
        const target = parseInt(element.dataset.counter) || 0;
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    animateTyping() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '3px solid var(--primary-orange)';
            
            this.manager.registerAnimation(element, 'fadeIn', {
                onComplete: () => {
                    this.typeText(element, text);
                }
            });
        });
    }
    
    typeText(element, text) {
        let index = 0;
        const speed = 50;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, speed);
    }
    
    createFloatingParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createParticle(hero);
            }, i * 500);
        }
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.innerHTML = '●';
        
        particle.style.cssText = `
            position: absolute;
            color: rgba(255, 149, 0, 0.3);
            font-size: ${Math.random() * 10 + 5}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.appendChild(particle);
        
        // Supprimer après animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 20000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.oneTechAnimations = new OneTechAnimations();
});

// Animation CSS pour les particules
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);