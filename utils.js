// Advanced JavaScript Utilities

// Debounce function for performance optimization
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Advanced easing functions
export const easing = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInBounce: t => 1 - easing.easeOutBounce(1 - t),
    easeOutBounce: t => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
};

// Custom animation function
export function animate(element, properties, duration = 1000, easingFunc = easing.easeOutQuad) {
    return new Promise(resolve => {
        const startTime = performance.now();
        const startValues = {};
        const endValues = {};
        
        // Parse properties and get initial values
        for (const prop in properties) {
            const computedStyle = getComputedStyle(element);
            startValues[prop] = parseFloat(computedStyle[prop]) || 0;
            endValues[prop] = properties[prop];
        }
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFunc(progress);
            
            // Apply interpolated values
            for (const prop in properties) {
                const start = startValues[prop];
                const end = endValues[prop];
                const current = start + (end - start) * easedProgress;
                
                if (prop === 'opacity') {
                    element.style[prop] = current;
                } else {
                    element.style[prop] = `${current}px`;
                }
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        }
        
        requestAnimationFrame(step);
    });
}

// Intersection Observer utility
export function createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    return new IntersectionObserver(callback, observerOptions);
}

// Smooth scroll utility
export function smoothScrollTo(target, duration = 1000) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing.easeInOutQuad(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Device detection
export const device = {
    isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: () => /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent),
    isDesktop: () => !device.isMobile() && !device.isTablet(),
    hasTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    supportsWebGL: () => {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }
};

// Performance utilities
export const performance = {
    // Measure function execution time
    measure: (fn, name = 'Function') => {
        return function(...args) {
            const start = window.performance.now();
            const result = fn.apply(this, args);
            const end = window.performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        };
    },
    
    // FPS counter
    createFPSCounter: () => {
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;
        
        function update() {
            const currentTime = performance.now();
            frameCount++;
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(update);
        }
        
        update();
        return () => fps;
    }
};

// DOM utilities
export const dom = {
    // Create element with attributes
    create: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    // Query selector with error handling
    $: (selector, context = document) => {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.error(`Invalid selector: ${selector}`);
            return null;
        }
    },
    
    // Query selector all with error handling
    $$: (selector, context = document) => {
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (e) {
            console.error(`Invalid selector: ${selector}`);
            return [];
        }
    },
    
    // Add event listener with cleanup
    on: (element, event, handler, options = {}) => {
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    },
    
    // Check if element is in viewport
    isInViewport: (element, threshold = 0) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    }
};

// Math utilities
export const math = {
    // Linear interpolation
    lerp: (start, end, factor) => start + (end - start) * factor,
    
    // Clamp value between min and max
    clamp: (value, min, max) => Math.min(Math.max(value, min), max),
    
    // Map value from one range to another
    map: (value, inMin, inMax, outMin, outMax) => {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
    
    // Random number between min and max
    random: (min = 0, max = 1) => Math.random() * (max - min) + min,
    
    // Random integer between min and max (inclusive)
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Distance between two points
    distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
    
    // Normalize angle to 0-360 degrees
    normalizeAngle: (angle) => ((angle % 360) + 360) % 360
};

// Color utilities
export const color = {
    // Convert hex to RGB
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // Convert RGB to hex
    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // Interpolate between two colors
    interpolate: (color1, color2, factor) => {
        const c1 = color.hexToRgb(color1);
        const c2 = color.hexToRgb(color2);
        
        if (!c1 || !c2) return color1;
        
        const r = Math.round(math.lerp(c1.r, c2.r, factor));
        const g = Math.round(math.lerp(c1.g, c2.g, factor));
        const b = Math.round(math.lerp(c1.b, c2.b, factor));
        
        return color.rgbToHex(r, g, b);
    }
};

// Storage utilities
export const storage = {
    // Local storage with JSON support
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Failed to read from localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Failed to remove from localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
            return false;
        }
    }
};

// Event emitter for custom events
export class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        
        const index = this.events[event].indexOf(callback);
        if (index > -1) {
            this.events[event].splice(index, 1);
        }
    }
    
    emit(event, ...args) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(callback => {
            try {
                callback(...args);
            } catch (e) {
                console.error(`Error in event handler for ${event}:`, e);
            }
        });
    }
    
    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

