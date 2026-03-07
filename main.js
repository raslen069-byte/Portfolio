// ═══════════════════════════════════════════════════════════════════
//  CREATIVE PORTFOLIO JAVASCRIPT
//  "Code is poetry" - Let's make it beautiful
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
//  CANVAS PARTICLE NETWORK (Constellation Effect)
// ═══════════════════════════════════════════════════════════════════
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.density = (this.canvas.width * this.canvas.height) / 12000;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.density; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`,
                origX: null,
                origY: null
            });
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((p, i) => {
            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * force * 2;
                    p.y -= Math.sin(angle) * force * 2;
                }
            }
            
            // Movement
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Connect particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle network
const canvas = document.getElementById('bgCanvas');
if (canvas) new ParticleNetwork(canvas);

// ═══════════════════════════════════════════════════════════════════
//  SCROLL PROGRESS BAR WITH GRADIENT
// ═══════════════════════════════════════════════════════════════════
class ScrollProgress {
    constructor(element) {
        this.element = element;
        this.hue = 0;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollTop / docHeight;
            
            this.hue = (progress * 270) % 360;
            this.element.style.background = `linear-gradient(90deg, 
                hsl(${this.hue}, 70%, 60%), 
                hsl(${(this.hue + 30) % 360}, 70%, 60%))`;
            this.element.style.transform = `scaleX(${progress})`;
        });
    }
}

const progressBar = document.getElementById('progressBar');
if (progressBar) new ScrollProgress(progressBar);

// ═══════════════════════════════════════════════════════════════════
//  FULLSCREEN MENU WITH STAGGERED ANIMATION
// ═══════════════════════════════════════════════════════════════════
class FullscreenMenu {
    constructor() {
        this.menuBtn = document.querySelector('.menu-btn');
        this.menu = document.getElementById('fullscreenMenu');
        this.links = document.querySelectorAll('.menu-link');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.menuBtn?.addEventListener('click', () => this.toggle());
        
        this.links.forEach((link, i) => {
            link.addEventListener('click', () => {
                this.close();
                link.style.transitionDelay = `${i * 0.05}s`;
            });
        });
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('active');
        this.menuBtn.classList.toggle('active');
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
        
        if (this.isOpen) {
            this.links.forEach((link, i) => {
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0)';
                }, i * 80);
            });
        }
    }
    
    close() {
        this.isOpen = false;
        this.menu.classList.remove('active');
        this.menuBtn.classList.remove('active');
        document.body.style.overflow = '';
        
        this.links.forEach(link => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-30px)';
        });
    }
}

new FullscreenMenu();

// ═══════════════════════════════════════════════════════════════════
//  MAGNETIC BUTTONS EFFECT
// ═══════════════════════════════════════════════════════════════════
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.strength = 0.3;
        this.init();
    }
    
    init() {
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.element.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'translate(0, 0)';
        });
    }
}

// Apply magnetic effect to CTA buttons
document.querySelectorAll('.submit-btn, .scroll-link').forEach(btn => {
    new MagneticButton(btn);
});

// ═══════════════════════════════════════════════════════════════════
//  TEXT REVEAL ANIMATION (Character by Character)
// ═══════════════════════════════════════════════════════════════════
class TextReveal {
    constructor(element) {
        this.element = element;
        this.text = element.textContent;
        this.element.textContent = '';
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.reveal();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.element);
    }
    
    reveal() {
        const chars = this.text.split('');
        let html = '';
        
        chars.forEach((char, i) => {
            if (char === ' ') {
                html += '&nbsp;';
            } else {
                html += `<span style="display: inline-block; opacity: 0; transform: translateY(20px); transition: opacity 0.03s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: ${i * 0.02}s">${char}</span>`;
            }
        });
        
        this.element.innerHTML = html;
        
        setTimeout(() => {
            this.element.querySelectorAll('span').forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 50);
    }
}

// Apply to section titles
document.querySelectorAll('.section-title').forEach(title => {
    new TextReveal(title);
});

// ═══════════════════════════════════════════════════════════════════
//  NUMBER COUNTER WITH SMOOTH ANIMATION
// ═══════════════════════════════════════════════════════════════════
class AnimatedCounter {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.dataset.count);
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animate() {
        // For 0, just display it
        if (this.target === 0) {
            this.element.textContent = '0';
            return;
        }

        // For small numbers (1-10), count smoothly
        if (this.target <= 10) {
            let current = 0;
            const increment = this.target / 20;
            const timer = setInterval(() => {
                current += increment;
                if (current >= this.target) {
                    this.element.textContent = this.target + '+';
                    clearInterval(timer);
                } else {
                    this.element.textContent = Math.floor(current) + '+';
                }
            }, 100);
        } else {
            // For larger numbers, use faster animation
            let current = 0;
            const increment = this.target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= this.target) {
                    this.element.textContent = this.target + '+';
                    clearInterval(timer);
                } else {
                    this.element.textContent = Math.floor(current) + '+';
                }
            }, 50);
        }
    }
}

document.querySelectorAll('.stat-number[data-count]').forEach(stat => {
    new AnimatedCounter(stat);
});

// ═══════════════════════════════════════════════════════════════════
//  PARALLAX QUOTE EFFECT
// ═══════════════════════════════════════════════════════════════════
class ParallaxQuotes {
    constructor() {
        this.quotes = document.querySelectorAll('.big-quote');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.quotes.forEach(quote => {
                const rect = quote.getBoundingClientRect();
                const speed = 0.1;
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (window.innerHeight - rect.top) * speed;
                    quote.style.transform = `translateY(${offset * 0.1}px)`;
                    quote.style.opacity = Math.min(1, offset / 300);
                }
            });
        });
    }
}

new ParallaxQuotes();

// ═══════════════════════════════════════════════════════════════════
//  PROJECT HOVER REVEAL EFFECT
// ═══════════════════════════════════════════════════════════════════
class ProjectReveal {
    constructor() {
        this.projects = document.querySelectorAll('.project-item');
        this.init();
    }
    
    init() {
        this.projects.forEach(project => {
            project.addEventListener('mouseenter', () => {
                this.projects.forEach(p => {
                    if (p !== project) {
                        p.style.filter = 'blur(4px) grayscale(100%)';
                        p.style.opacity = '0.2';
                    }
                });
            });
            
            project.addEventListener('mouseleave', () => {
                this.projects.forEach(p => {
                    p.style.filter = '';
                    p.style.opacity = '1';
                });
            });
        });
    }
}

new ProjectReveal();

// ═══════════════════════════════════════════════════════════════════
//  CURSOR TRAIL EFFECT
// ═══════════════════════════════════════════════════════════════════
class CursorTrail {
    constructor() {
        this.trail = [];
        this.trailLength = 20;
        this.init();
    }
    
    init() {
        // Create trail elements
        for (let i = 0; i < this.trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i * 0.3}px;
                height: ${8 - i * 0.3}px;
                background: rgba(255, 255, 255, ${0.3 - i * 0.015});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(dot);
            this.trail.push({ element: dot, x: 0, y: 0 });
        }
        
        document.addEventListener('mousemove', (e) => this.move(e));
    }
    
    move(e) {
        let x = e.clientX;
        let y = e.clientY;
        
        this.trail.forEach((dot, index) => {
            const prev = this.trail[index - 1] || { x, y };
            
            dot.x += (x - dot.x) * 0.3;
            dot.y += (y - dot.y) * 0.3;
            
            dot.element.style.left = dot.x + 'px';
            dot.element.style.top = dot.y + 'px';
            
            x = dot.x;
            y = dot.y;
        });
    }
}

// Only on desktop
if (window.innerWidth > 768) {
    new CursorTrail();
}

// ═══════════════════════════════════════════════════════════════════
//  CONTACT FORM WITH FLOATING LABELS & VALIDATION
// ═══════════════════════════════════════════════════════════════════
class ContactForm {
    constructor(form) {
        this.form = form;
        this.fields = form.querySelectorAll('input, textarea');
        this.submitBtn = form.querySelector('.submit-btn');
        this.init();
    }
    
    init() {
        this.fields.forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', () => {
                if (!field.value) {
                    field.parentElement.classList.remove('focused');
                }
            });
        });
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validation
        if (!this.validate(data)) return;
        
        // Animate button
        this.submitBtn.innerHTML = '<span>Sending...</span>';
        this.submitBtn.style.pointerEvents = 'none';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        this.submitBtn.innerHTML = '<span>✓ Message Sent!</span>';
        this.submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        new Notification('Message sent! I\'ll get back to you within 24 hours.', 'success');
        
        setTimeout(() => {
            this.form.reset();
            this.submitBtn.innerHTML = '<span>Send Message</span>';
            this.submitBtn.style.background = '';
            this.submitBtn.style.pointerEvents = '';
        }, 3000);
    }
    
    validate(data) {
        if (!data.name || !data.email || !data.message) {
            new Notification('Please fill in all fields', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            new Notification('Please enter a valid email address', 'error');
            return false;
        }
        
        return true;
    }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) new ContactForm(contactForm);

// ═══════════════════════════════════════════════════════════════════
//  NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════════
class Notification {
    constructor(message, type = 'info') {
        this.message = message;
        this.type = type;
        this.show();
    }
    
    show() {
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };
        
        const colors = {
            success: 'linear-gradient(135deg, #22c55e, #16a34a)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            info: 'linear-gradient(135deg, #6366f1, #4f46e5)'
        };
        
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 16px 24px;
            background: ${colors[this.type]};
            color: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            z-index: 10000;
            animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            font-size: 0.95rem;
            max-width: 400px;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 1.2rem; font-weight: bold">${icons[this.type]}</span>
            <span>${this.message}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
}

// Add notification animations
const animStyles = document.createElement('style');
animStyles.textContent = `
    @keyframes slideInUp {
        from { transform: translateY(100px) rotateX(-30deg); opacity: 0; }
        to { transform: translateY(0) rotateX(0); opacity: 1; }
    }
    @keyframes slideOutDown {
        from { transform: translateY(0) rotateX(0); opacity: 1; }
        to { transform: translateY(100px) rotateX(-30deg); opacity: 0; }
    }
`;
document.head.appendChild(animStyles);

// ═══════════════════════════════════════════════════════════════════
//  REVEAL ON SCROLL WITH DELAY
// ═══════════════════════════════════════════════════════════════════
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll(
            '.philosophy-item, .service-card, .testimonial-card, .project-item, .info-block'
        );
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, i * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        this.elements.forEach(el => {
            el.classList.add('scroll-reveal');
            observer.observe(el);
        });
    }
}

new ScrollReveal();

// Add reveal styles
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    .scroll-reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyles);

// ═══════════════════════════════════════════════════════════════════
//  ACTIVE SECTION HIGHLIGHT
// ═══════════════════════════════════════════════════════════════════
class ActiveSection {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-item, .menu-link');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.id;
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

new ActiveSection();

// ═══════════════════════════════════════════════════════════════════
//  HERO PARALLAX
// ═══════════════════════════════════════════════════════════════════
class HeroParallax {
    constructor() {
        this.hero = document.querySelector('.hero-title');
        this.heroQuote = document.querySelector('.hero-quote');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const maxScroll = 500;
            
            if (scrolled < maxScroll) {
                const progress = scrolled / maxScroll;
                
                if (this.hero) {
                    this.hero.style.transform = `translateY(${scrolled * 0.4}px)`;
                    this.hero.style.opacity = 1 - progress;
                }
                
                if (this.heroQuote) {
                    this.heroQuote.style.transform = `translateY(${scrolled * 0.2}px)`;
                    this.heroQuote.style.opacity = 1 - progress * 0.5;
                }
            }
        });
    }
}

new HeroParallax();

// ═══════════════════════════════════════════════════════════════════
//  CONSOLE EASTER EGG
// ═══════════════════════════════════════════════════════════════════
console.log(`
%c╔═══════════════════════════════════════════════════════════╗
%c║                                                           ║
%c║   👋  Hello, Fellow Developer!                           ║
%c║                                                           ║
%c║   "Code is poetry written for machines to read           ║
%c║    and humans to maintain."                              ║
%c║                                                           ║
%c║   Like what you see? Let's create something amazing!     ║
%c║                                                           ║
%c╚═══════════════════════════════════════════════════════════╝
`, 
    'color: #6366f1; font-size: 4px;',
    'color: #888; font-size: 4px;',
    'color: #fff; font-size: 4px;',
    'color: #888; font-size: 4px;',
    'color: #ec4899; font-size: 4px;',
    'color: #888; font-size: 4px;',
    'color: #22c55e; font-size: 4px;',
    'color: #888; font-size: 4px;'
);

console.log('%c🚀 Built with ❤️ using vanilla JavaScript', 'color: #6366f1; font-size: 12px;');
