// Main JavaScript for Papa's Park Website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Change accent color on page load
    const changeAccentColor = () => {
        // Array of accent colors to cycle through
        const accentColors = [
            '#00be55', // Green
            '#0058c5', // Blue
            '#ff0205'  // Red
        ];
        
        // Matching secondary colors (darker variants)
        const secondaryColors = [
            '#008e40', // Darker Green
            '#004494', // Darker Blue
            '#c50104'  // Darker Red
        ];
        
        // Matching hue rotate values for SVG filtering (for the logo)
        const hueRotateValues = [
            '140deg', // Green
            '210deg', // Blue
            '0deg'    // Red
        ];
        
        // For true cycling on each visit, we use the current day + an offset
        const today = new Date();
        const dayOffset = today.getDate() + today.getMonth() + today.getFullYear();
        const colorIndex = dayOffset % accentColors.length;
        
        const selectedColor = accentColors[colorIndex];
        const selectedSecondaryColor = secondaryColors[colorIndex];
        const selectedHueRotate = hueRotateValues[colorIndex];
        
        // Apply the colors to CSS variables
        document.documentElement.style.setProperty('--primary-color', selectedColor);
        document.documentElement.style.setProperty('--secondary-color', selectedSecondaryColor);
        document.documentElement.style.setProperty('--logo-hue-rotate', selectedHueRotate);
        
        // Store the selected colors and the current date in localStorage
        localStorage.setItem('papas-park-accent-color', selectedColor);
        localStorage.setItem('papas-park-secondary-color', selectedSecondaryColor);
        localStorage.setItem('papas-park-logo-hue-rotate', selectedHueRotate);
        localStorage.setItem('papas-park-color-date', today.toDateString());
    };
    
    // Check if there's a stored color from today, otherwise set a new one
    const storedColor = localStorage.getItem('papas-park-accent-color');
    const storedSecondaryColor = localStorage.getItem('papas-park-secondary-color');
    const storedHueRotate = localStorage.getItem('papas-park-logo-hue-rotate');
    const storedDate = localStorage.getItem('papas-park-color-date');
    const today = new Date().toDateString();
    
    // If we have stored colors from today, use them; otherwise, get new colors
    if (storedColor && storedSecondaryColor && storedHueRotate && storedDate === today) {
        document.documentElement.style.setProperty('--primary-color', storedColor);
        document.documentElement.style.setProperty('--secondary-color', storedSecondaryColor);
        document.documentElement.style.setProperty('--logo-hue-rotate', storedHueRotate);
    } else {
        // Clear old colors if they're from a different day
        if (storedDate !== today) {
            localStorage.removeItem('papas-park-accent-color');
            localStorage.removeItem('papas-park-secondary-color');
            localStorage.removeItem('papas-park-logo-hue-rotate');
            localStorage.removeItem('papas-park-color-date');
        }
        changeAccentColor();
    }
    
    // Mobile Navigation Toggle
    const setupMobileNav = () => {
        const nav = document.querySelector('.main-nav');
        const navToggle = document.createElement('button');
        navToggle.className = 'nav-toggle';
        navToggle.innerHTML = '<span class="menu-icon">&#9776;</span>';
        navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        
        // Add the toggle button before the nav
        nav.insertAdjacentElement('beforebegin', navToggle);
        
        // Add responsive class to the nav
        nav.classList.add('responsive');
        
        // Initially hide the nav on mobile
        if (window.innerWidth < 768) {
            nav.style.maxHeight = '0';
            nav.style.overflow = 'hidden';
        }
        
        // Toggle navigation when hamburger is clicked
        navToggle.addEventListener('click', function() {
            if (nav.style.maxHeight === '0px' || !nav.style.maxHeight) {
                nav.style.maxHeight = nav.scrollHeight + 'px';
            } else {
                nav.style.maxHeight = '0';
            }
        });
        
        // Reset nav height on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                nav.style.maxHeight = 'none';
            } else if (!navToggle.classList.contains('active')) {
                nav.style.maxHeight = '0';
            }
        });
    };
    
    // Setup the mobile nav
    setupMobileNav();
    
    // Form Validation
    const setupFormValidation = () => {
        const contactForm = document.querySelector('.contact-form');
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Simple validation example
                let valid = true;
                const requiredInputs = contactForm.querySelectorAll('[required]');
                
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        valid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });
                
                if (valid) {
                    // Here you would normally send the form data to a server
                    alert('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    alert('Please fill in all required fields.');
                }
            });
        }
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const emailValue = emailInput.value.trim();
                
                if (emailValue && isValidEmail(emailValue)) {
                    // Here you would normally send the email to a server
                    alert('Thank you for subscribing to our newsletter!');
                    newsletterForm.reset();
                } else {
                    alert('Please enter a valid email address.');
                    emailInput.classList.add('error');
                }
            });
        }
    };
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Setup form validation
    setupFormValidation();
    
    // Smooth Scrolling for internal links
    const setupSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Add active class to current navigation item based on URL
    const setActiveNavItem = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.main-nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Set home as active if we're on the main page
        if (currentPath === 'index.html' || currentPath === '') {
            const homeLink = document.querySelector('.main-nav a[href="index.html"], .main-nav a[href="./"], .main-nav a[href="/"], .main-nav a[href="#"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    };
    
    // Set active nav item
    setActiveNavItem();
}); 