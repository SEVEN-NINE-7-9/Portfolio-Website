// Optimized Portfolio Script
document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // CACHE DOM ELEMENTS
    // ========================================
    const DOM = {
        body: document.body,
        navbar: document.querySelector('nav'),
        themeText: document.getElementById('theme-text'),
        navLinks: document.querySelectorAll('nav a[href^="#"]'),
        sections: document.querySelectorAll('section[id]'),
        contactForm: document.getElementById('contact-form'),
        sceneContainers: document.querySelectorAll('.scene-container'),
        gridItems: document.querySelectorAll('.grid-item'),
        contactWrapper: document.querySelector('.contact-wrapper'),
        hero: document.querySelector('.hero'),
        heroContent: document.querySelector('.hero .container'),
        projectCards: document.querySelectorAll('.project-card'),
        skillItems: document.querySelectorAll('.skill-item')
    };

    // ========================================
    // GOOGLE SHEETS INTEGRATION
    // ========================================
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQMnBqP2f_5ECl_M7a4SkU6YNbvmdZmo2dwjr_PWQupnZ5Hwl-mL4Klgk2ziIzORNixg/exec';
    
    const submitToGoogleSheets = async (formData) => {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            return true;
        } catch (error) {
            console.error('Error submitting to Google Sheets:', error);
            return false;
        }
    };

    // ========================================
    // DETECT DESKTOP MODE ON MOBILE
    // ========================================
    const detectDesktopMode = () => {
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const screenWidth = window.innerWidth;
        
        if (isMobileDevice && screenWidth > 768) {
            document.documentElement.style.fontSize = '14px';
            DOM.body.style.transform = 'scale(0.85)';
            DOM.body.style.transformOrigin = 'top left';
            DOM.body.style.width = '117.6%';
        }
    };

    detectDesktopMode();
    window.addEventListener('resize', detectDesktopMode);

    // ========================================
    // THEME MANAGEMENT
    // ========================================
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            DOM.body.classList.add('dark-mode');
            if (DOM.themeText) DOM.themeText.textContent = 'Light Mode';
        }
    };

    // ========================================
    // PAGE LOAD FADE-IN (Enhanced)
    // ========================================
    DOM.body.style.opacity = '0';
    DOM.body.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
        DOM.body.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        DOM.body.style.opacity = '1';
        DOM.body.style.transform = 'translateY(0)';
    });

    // ========================================
    // NAVBAR SCROLL EFFECT (Optimized)
    // ========================================
    let scrollTimeout;
    const handleNavbarScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            DOM.navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, 10);
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ========================================
    // SMOOTH SCROLL NAVIGATION
    // ========================================
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = DOM.navbar.offsetHeight;
                const top = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // ENHANCED SCROLL ANIMATIONS
    // ========================================
    const animOptions = { 
        threshold: 0.15, 
        rootMargin: '0px 0px -80px 0px' 
    };
    
    const animObserver = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 50); // Stagger effect
                animObserver.unobserve(entry.target);
            }
        });
    }, animOptions);

    // Apply animations to contact wrapper
    if (DOM.contactWrapper) {
        DOM.contactWrapper.style.opacity = '0';
        DOM.contactWrapper.style.transform = 'translateY(30px)';
        DOM.contactWrapper.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        animObserver.observe(DOM.contactWrapper);
    }

    // ========================================
    // ENHANCED PARALLAX EFFECT
    // ========================================
    let parallaxTicking = false;
    
    const updateParallax = () => {
        if (DOM.hero && window.scrollY < window.innerHeight * 1.5) {
            const scrolled = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Smooth parallax calculations
            const parallaxSpeed = 0.4;
            const translateY = scrolled * parallaxSpeed;
            const opacity = Math.max(0, 1 - (scrolled / (windowHeight * 0.7)));
            const scale = Math.max(0.92, 1 - (scrolled / (windowHeight * 5)));
            const blur = Math.min(3, scrolled / 150);
            
            // Apply transforms
            if (DOM.heroContent) {
                DOM.heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
                DOM.heroContent.style.opacity = opacity;
            }
            
            DOM.hero.style.filter = `blur(${blur}px)`;
        } else if (DOM.hero && DOM.heroContent) {
            DOM.heroContent.style.transform = 'translateY(0) scale(1)';
            DOM.hero.style.filter = 'blur(0px)';
        }

        parallaxTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });

    // Initialize parallax with GPU acceleration
    if (DOM.heroContent) {
        DOM.heroContent.style.transition = 'none';
        DOM.heroContent.style.willChange = 'transform, opacity';
    }
    if (DOM.hero) {
        DOM.hero.style.transition = 'none';
        DOM.hero.style.willChange = 'filter';
    }
    
    updateParallax();

    // ========================================
    // ENHANCED HOVER EFFECTS
    // ========================================
    const addHoverEffect = (element, scaleAmount = 1.02, translateY = -5) => {
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.transform = `translateY(${translateY}px) scale(${scaleAmount})`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0) scale(1)';
        });
    };

    // Apply to scene containers
    DOM.sceneContainers.forEach(container => addHoverEffect(container));
    
    // Apply to buttons (excluding theme toggle)
    document.querySelectorAll('button:not(.theme-toggle)').forEach(btn => 
        addHoverEffect(btn, 1.05, -3)
    );

    // ========================================
    // PROJECT CARDS SMOOTH ANIMATION
    // ========================================
    DOM.projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, 
                                 transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);

        // Enhanced hover with rotation
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.03)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ========================================
    // SKILL ITEMS WAVE ANIMATION
    // ========================================
    DOM.skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.9)';
        item.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s, 
                                 transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(item);

        // Smooth hover with bounce
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // ========================================
    // GRID ITEMS STAGGER ANIMATION
    // ========================================
    DOM.gridItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9) translateY(20px)';
        item.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s, 
                                 transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1) translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        observer.observe(item);
    });

    // ========================================
    // SCENE CONTAINER BUTTON REVEAL
    // ========================================
    DOM.sceneContainers.forEach(card => {
        const button = card.querySelector('button');
        if (button) {
            button.style.opacity = '0';
            button.style.transform = 'translateY(8px)';
            button.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            card.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            });
            
            card.addEventListener('mouseleave', () => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(8px)';
            });
        }
    });

    // ========================================
    // FORM INPUT ANIMATIONS
    // ========================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });

        // Floating label effect
        input.addEventListener('input', function() {
            const label = this.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (this.value) {
                    label.style.transform = 'translateY(-2px)';
                    label.style.fontSize = '11px';
                } else {
                    label.style.transform = 'translateY(0)';
                    label.style.fontSize = '12px';
                }
                label.style.transition = 'all 0.3s ease';
            }
        });
    });

    // ========================================
    // CONTACT FORM SUBMISSION
    // ========================================
    if (DOM.contactForm) {
        DOM.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            submitButton.style.transform = 'scale(0.98)';
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toLocaleString()
            };

            // Validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValidEmail = emailRegex.test(formData.email);

            if (Object.values(formData).every(val => val)) {
                if (!isValidEmail) {
                    alert('⚠️ Please enter a valid email address.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    submitButton.style.transform = 'scale(1)';
                    return;
                }

                const success = await submitToGoogleSheets(formData);

                if (success) {
                    alert('✅ Thank you for your message! I will get back to you soon.');
                    DOM.contactForm.reset();
                    
                    // Smooth reset animation
                    formInputs.forEach(input => {
                        input.style.transform = 'scale(1)';
                    });
                } else {
                    alert('⚠️ There was an issue sending your message. Please try again or email me directly.');
                }
            } else {
                alert('Please fill in all fields.');
            }

            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            submitButton.style.transform = 'scale(1)';
        });
    }

    // ========================================
    // SMOOTH SCROLL REVEAL FOR SECTIONS
    // ========================================
    const revealSections = () => {
        DOM.sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.85) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    DOM.sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    window.addEventListener('scroll', revealSections, { passive: true });
    revealSections();

    // ========================================
    // CURSOR TRAIL EFFECT (Optional Enhancement)
    // ========================================
    const createCursorTrail = () => {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            requestAnimationFrame(animateCursor);
        };

        animateCursor();
    };

    // Uncomment to enable cursor trail
    // createCursorTrail();

    // ========================================
    // INITIALIZE
    // ========================================
    initTheme();
    console.log('✨ Portfolio initialized with enhanced animations');
    console.log('💡 Contact form submissions will be saved to Google Sheets');
});

// ========================================
// GLOBAL THEME TOGGLE
// ========================================
function toggleTheme() {
    const body = document.body;
    const themeText = document.getElementById('theme-text');
    
    body.classList.toggle('dark-mode');
    
    // Smooth theme transition
    body.style.transition = 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (body.classList.contains('dark-mode')) {
        if (themeText) themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        if (themeText) themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}