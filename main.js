// Optimized Portfolio Script
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const body = document.body;
    const navbar = document.querySelector('nav');
    const themeText = document.getElementById('theme-text');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const contactForm = document.getElementById('contact-form');
    const sceneContainers = document.querySelectorAll('.scene-container');
    const gridItems = document.querySelectorAll('.grid-item');
    const contactWrapper = document.querySelector('.contact-wrapper');
    const hero = document.querySelector('.hero');

    // ========================================
    // GOOGLE SHEETS INTEGRATION
    // ========================================
    // SETUP INSTRUCTIONS:
    // 1. Go to https://script.google.com/
    // 2. Create a new project
    // 3. Paste the Apps Script code (provided separately)
    // 4. Deploy as Web App
    // 5. Copy the deployment URL and paste it below
    
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQMnBqP2f_5ECl_M7a4SkU6YNbvmdZmo2dwjr_PWQupnZ5Hwl-mL4Klgk2ziIzORNixg/exec';
    
    // Submit form data to Google Sheets
    const submitToGoogleSheets = async (formData) => {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            // Note: no-cors mode means we can't read the response
            // But the submission will work
            return true;
        } catch (error) {
            console.error('Error submitting to Google Sheets:', error);
            return false;
        }
    };

    // ========================================
    // INITIALIZE THEME
    // ========================================
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            if (themeText) themeText.textContent = 'Light Mode';
        }
    };

    // ========================================
    // PAGE LOAD FADE-IN
    // ========================================
    body.style.opacity = '0';
    requestAnimationFrame(() => {
        body.style.transition = 'opacity 0.5s ease';
        body.style.opacity = '1';
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10);
    }, { passive: true });

    // ========================================
    // SMOOTH SCROLL NAVIGATION
    // ========================================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight;
                const top = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // STAGGERED ANIMATIONS ON SCROLL
    // ========================================
    const animOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const animObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, animOptions);

    // Apply animations
    sceneContainers.forEach((container, i) => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
    });

    // Grid items - no animations
    gridItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1) translateY(0)';
    });

    if (contactWrapper) {
        contactWrapper.style.opacity = '0';
        contactWrapper.style.transform = 'translateY(30px)';
        contactWrapper.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        animObserver.observe(contactWrapper);
    }

    // ========================================
    // PARALLAX EFFECT (Optimized)
    // ========================================
    let parallaxTicking = false;
    const updateParallax = () => {
        // Hero parallax
        if (hero && window.scrollY < window.innerHeight) {
            const scrolled = window.scrollY;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = Math.max(0, 1 - scrolled / 700);
        }

        parallaxTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });

    updateParallax();

    // ========================================
    // HOVER EFFECTS
    // ========================================
    const interactiveElements = [
        ...sceneContainers,
        ...document.querySelectorAll('button:not(.theme-toggle)')
    ];

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            element.style.transform = 'translateY(-5px) scale(1.02)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ========================================
    // PROJECT BUTTON REVEAL
    // ========================================
    sceneContainers.forEach(card => {
        const button = card.querySelector('button');
        if (button) {
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
    // CONTACT FORM SUBMISSION
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            if (name.value.trim() && email.value.trim() && subject.value.trim() && message.value.trim()) {
                const formData = {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim(),
                    timestamp: new Date().toLocaleString()
                };

                // Submit to Google Sheets
                const success = await submitToGoogleSheets(formData);

                if (success) {
                    alert('✅ Thank you for your message! I will get back to you soon.');
                    contactForm.reset();
                } else {
                    alert('⚠️ There was an issue sending your message. Please try again or email me directly.');
                }
            } else {
                alert('Please fill in all fields.');
            }

            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    }

    // ========================================
    // INITIALIZE
    // ========================================
    initTheme();
    console.log('Portfolio initialized');
    console.log('💡 Contact form submissions will be saved to Google Sheets');
});

// ========================================
// GLOBAL THEME TOGGLE
// ========================================
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeText = document.getElementById('theme-text');
    
    if (document.body.classList.contains('dark-mode')) {
        if (themeText) themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        if (themeText) themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}