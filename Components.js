// Advanced JavaScript Components

import { debounce, throttle, dom, storage, EventEmitter } from './utils.js';

// Theme Manager Component
class ThemeManager extends EventEmitter {
    constructor() {
        super();
        this.currentTheme = 'light';
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.bindEvents();
        this.updateTheme();
    }
    
    loadSavedTheme() {
        const savedTheme = storage.get('theme', 'light');
        this.currentTheme = savedTheme;
    }
    
    bindEvents() {
        const themeToggle = dom.$('[data-theme-toggle]');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!storage.get('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.updateTheme();
        this.saveTheme();
        this.emit('themeChanged', theme);
    }
    
    updateTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update meta theme-color
        let metaThemeColor = dom.$('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = dom.create('meta', { name: 'theme-color' });
            document.head.appendChild(metaThemeColor);
        }
        
        const themeColors = {
            light: '#ffffff',
            dark: '#1a1a1a'
        };
        
        metaThemeColor.setAttribute('content', themeColors[this.currentTheme]);
    }
    
    saveTheme() {
        storage.set('theme', this.currentTheme);
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.activeSection = 'home';
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupSmoothScrolling();
        this.setupActiveSection();
    }
    
    bindEvents() {
        // Mobile menu toggle
        const menuToggle = dom.$('.nav-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Navigation links
        const navLinks = dom.$$('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav-menu')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isMenuOpen = true;
        const menuToggle = dom.$('.nav-toggle');
        const navList = dom.$('.nav-list');
        
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.classList.add('active');
        }
        
        if (navList) {
            navList.classList.add('active');
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        const menuToggle = dom.$('.nav-toggle');
        const navList = dom.$('.nav-list');
        
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
        }
        
        if (navList) {
            navList.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            this.scrollToSection(targetId);
            this.closeMenu();
        }
    }
    
    scrollToSection(sectionId) {
        const target = dom.$(`#${sectionId}`);
        if (!target) return;
        
        const headerHeight = dom.$('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    setupSmoothScrolling() {
        // Handle all anchor links
        const anchorLinks = dom.$$('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    this.scrollToSection(href.substring(1));
                }
            });
        });
    }
    
    setupActiveSection() {
        const sections = dom.$$('section[id]');
        if (sections.length === 0) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-100px 0px -100px 0px'
            }
        );
        
        sections.forEach(section => observer.observe(section));
    }
    
    setActiveSection(sectionId) {
        if (this.activeSection === sectionId) return;
        
        this.activeSection = sectionId;
        
        // Update navigation links
        const navLinks = dom.$$('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Form Handler Component
class FormHandler {
    constructor(formSelector) {
        this.form = dom.$(formSelector);
        this.isSubmitting = false;
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', debounce(() => this.validateField(input), 300));
        });
    }
    
    setupValidation() {
        // Add required field indicators
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const label = this.form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.textContent.includes('*')) {
                label.textContent += ' *';
            }
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const isValid = this.validateForm();
        if (!isValid) return;
        
        this.isSubmitting = true;
        this.setSubmitState(true);
        
        try {
            const formData = this.getFormData();
            await this.submitForm(formData);
            this.showSuccess();
            this.resetForm();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.isSubmitting = false;
            this.setSubmitState(false);
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (required && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }
        
        // Email validation
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
        }
        
        // Minimum length validation
        else if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                isValid = false;
                errorMessage = `Mínimo ${minLength} caracteres`;
            }
        }
        
        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    showFieldError(field, message) {
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        if (message) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Error al enviar el formulario'));
                }
            }, 2000);
        });
    }
    
    setSubmitState(isSubmitting) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        if (isSubmitting) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            submitButton.classList.add('loading');
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensaje';
            submitButton.classList.remove('loading');
        }
    }
    
    showSuccess() {
        this.showMessage('¡Mensaje enviado correctamente!', 'success');
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type) {
        // Create or update message element
        let messageElement = this.form.querySelector('.form-message');
        if (!messageElement) {
            messageElement = dom.create('div', { className: 'form-message' });
            this.form.appendChild(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear error states
        const errorElements = this.form.querySelectorAll('.form-error');
        errorElements.forEach(element => element.textContent = '');
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
}

// Scroll Progress Indicator
class ScrollProgress {
    constructor() {
        this.progressBar = null;
        this.init();
    }
    
    init() {
        this.createProgressBar();
        this.bindEvents();
    }
    
    createProgressBar() {
        this.progressBar = dom.create('div', {
            className: 'scroll-progress',
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
                z-index: 9999;
                transition: width 0.1s ease;
            `
        });
        
        document.body.appendChild(this.progressBar);
    }
    
    bindEvents() {
        window.addEventListener('scroll', throttle(() => {
            this.updateProgress();
        }, 16)); // ~60fps
    }
    
    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.isMonitoring = false;
        this.init();
    }
    
    init() {
        if (window.location.search.includes('debug=true')) {
            this.startMonitoring();
        }
    }
    
    startMonitoring() {
        this.isMonitoring = true;
        this.createDebugPanel();
        this.update();
    }
    
    createDebugPanel() {
        const panel = dom.create('div', {
            className: 'debug-panel',
            style: `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
            `
        });
        
        panel.innerHTML = `
            <div>FPS: <span id="fps-counter">0</span></div>
            <div>Memory: <span id="memory-usage">N/A</span></div>
        `;
        
        document.body.appendChild(panel);
    }
    
    update() {
        if (!this.isMonitoring) return;
        
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            this.updateDebugInfo();
        }
        
        requestAnimationFrame(() => this.update());
    }
    
    updateDebugInfo() {
        const fpsCounter = dom.$('#fps-counter');
        if (fpsCounter) {
            fpsCounter.textContent = this.fps;
            fpsCounter.style.color = this.fps < 30 ? 'red' : this.fps < 50 ? 'yellow' : 'green';
        }
        
        // Memory usage (if available)
        if (performance.memory) {
            const memoryUsage = dom.$('#memory-usage');
            if (memoryUsage) {
                const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
                const total = Math.round(performance.memory.totalJSHeapSize / 1048576);
                memoryUsage.textContent = `${used}/${total} MB`;
            }
        }
    }
}

// Export components
export {
    ThemeManager,
    NavigationManager,
    FormHandler,
    ScrollProgress,
    PerformanceMonitor
};

