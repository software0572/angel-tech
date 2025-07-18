// Main JavaScript Application

import { dom, debounce, throttle } from './utils.js';
import {
    AnimationOnScroll,
    ParallaxSystem,
    MorphingShapes,
    ParticleSystem,
    FluidAnimation,
    GlitchEffect,
    CustomCursor
} from './animations.js';
import {
    ThemeManager,
    NavigationManager,
    FormHandler,
    ScrollProgress,
    PerformanceMonitor
} from './components.js';

// Main Application Class
class WebProApp {
    constructor() {
        this.components = {};
        this.animations = {};
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Initialize core components
            this.initializeComponents();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Setup demo interactions
            this.setupDemoInteractions();
            
            // Setup performance optimizations
            this.setupPerformanceOptimizations();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('🚀 WebPro App initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize WebPro App:', error);
        }
    }
    
    initializeComponents() {
        // Theme Manager
        this.components.themeManager = new ThemeManager();
        
        // Navigation Manager
        this.components.navigationManager = new NavigationManager();
        
        // Form Handler
        const contactForm = dom.$('.contact-form');
        if (contactForm) {
            this.components.formHandler = new FormHandler('.contact-form');
        }
        
        // Scroll Progress
        this.components.scrollProgress = new ScrollProgress();
        
        // Performance Monitor (only in debug mode)
        this.components.performanceMonitor = new PerformanceMonitor();
        
        console.log('✅ Components initialized');
    }
    
    initializeAnimations() {
        // Animation on Scroll
        this.animations.aos = new AnimationOnScroll();
        
        // Parallax System (only on desktop)
        if (window.innerWidth >= 1024) {
            this.animations.parallax = new ParallaxSystem();
        }
        
        // Custom Cursor (only on desktop with mouse)
        if (window.innerWidth >= 1024 && !('ontouchstart' in window)) {
            this.animations.customCursor = new CustomCursor();
        }
        
        // Setup floating elements animation
        this.setupFloatingElements();
        
        // Setup hero cube animation
        this.setupHeroCube();
        
        console.log('✅ Animations initialized');
    }
    
    setupFloatingElements() {
        const floatingElements = dom.$$('.floating-shape');
        
        floatingElements.forEach((element, index) => {
            // Random initial position
            const randomX = Math.random() * 100;
            const randomY = Math.random() * 100;
            
            element.style.left = `${randomX}%`;
            element.style.top = `${randomY}%`;
            
            // Animate with different speeds
            const duration = 20 + (index * 5);
            element.style.animationDuration = `${duration}s`;
            element.style.animationDelay = `${index * -5}s`;
        });
    }
    
    setupHeroCube() {
        const heroCube = dom.$('.hero-cube');
        if (!heroCube) return;
        
        // Add interactive rotation on mouse move
        const heroSection = dom.$('.hero');
        if (heroSection && window.innerWidth >= 1024) {
            heroSection.addEventListener('mousemove', throttle((e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const rotateX = (y - 0.5) * 20;
                const rotateY = (x - 0.5) * 20;
                
                heroCube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }, 16));
            
            // Reset on mouse leave
            heroSection.addEventListener('mouseleave', () => {
                heroCube.style.transform = '';
            });
        }
    }
    
    setupDemoInteractions() {
        const demoButtons = dom.$$('.demo-btn');
        const demoCanvas = dom.$('#demo-canvas');
        
        if (!demoCanvas || demoButtons.length === 0) return;
        
        let currentDemo = null;
        
        demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const demoType = button.getAttribute('data-demo');
                
                // Update active button
                demoButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Stop current demo
                if (currentDemo && currentDemo.stop) {
                    currentDemo.stop();
                }
                
                // Start new demo
                currentDemo = this.startDemo(demoType, demoCanvas);
            });
        });
        
        console.log('✅ Demo interactions setup');
    }
    
    startDemo(type, container) {
        container.innerHTML = '';
        
        switch (type) {
            case 'morphing':
                const morphing = new MorphingShapes(container);
                morphing.start();
                return morphing;
                
            case 'particles':
                const particles = new ParticleSystem(container);
                particles.start();
                return particles;
                
            case 'fluid':
                const fluid = new FluidAnimation(container);
                fluid.start();
                return fluid;
                
            case 'glitch':
                const glitch = new GlitchEffect(container);
                glitch.start();
                return glitch;
                
            default:
                container.innerHTML = '<div class="demo-placeholder"><p>Selecciona una demostración para comenzar</p></div>';
                return null;
        }
    }
    
    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
        
        // Setup intersection observers for performance
        this.setupIntersectionObservers();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        console.log('✅ Performance optimizations applied');
    }
    
    setupLazyLoading() {
        const images = dom.$$('img[data-src]');
        
        if (images.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeScrollEvents() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            // Update header background opacity
            const header = dom.$('.header');
            if (header) {
                const scrollY = window.pageYOffset;
                const opacity = Math.min(scrollY / 100, 1);
                header.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.95})`;
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
    
    setupIntersectionObservers() {
        // Animate bento items on scroll
        const bentoItems = dom.$$('.bento-item');
        
        if (bentoItems.length === 0) return;
        
        const bentoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        bentoItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            bentoObserver.observe(item);
        });
    }
    
    preloadCriticalResources() {
        // Preload hero background images
        const criticalImages = [
            // Add any critical image URLs here
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    // Public methods for external access
    getComponent(name) {
        return this.components[name];
    }
    
    getAnimation(name) {
        return this.animations[name];
    }
    
    // Cleanup method
    destroy() {
        // Stop all animations
        Object.values(this.animations).forEach(animation => {
            if (animation && animation.stop) {
                animation.stop();
            }
        });
        
        // Remove event listeners
        // (In a real app, you'd track and remove all listeners)
        
        this.isInitialized = false;
        console.log('🧹 WebPro App destroyed');
    }
}

// Initialize the application
const app = new WebProApp();

// Make app globally accessible for debugging
window.WebProApp = app;

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        console.log('⏸️ Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        console.log('▶️ Page visible - resuming animations');
    }
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('💥 JavaScript Error:', event.error);
    
    // In production, you might want to send this to an error tracking service
    // errorTracker.captureException(event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled Promise Rejection:', event.reason);
    
    // Prevent the default browser behavior
    event.preventDefault();
});

// Export for module usage
export default app;

