/**
 * APEX Auto Detailing - Main JavaScript
 * Handles interactivity and dynamic elements on the website
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --------- Elements ---------
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.querySelector('.back-to-top');
    const navItems = document.querySelectorAll('.nav-links a');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const bookingForm = document.getElementById('booking-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    

    // --------- Functions ---------
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        
        // Toggle menu icon
        if (navLinks.classList.contains('active')) {
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    // Handle header scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            backToTopBtn.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            backToTopBtn.classList.remove('show');
        }
        
        // Update active navigation based on scroll position
        updateActiveNav();
    }
    
    // Update active navigation link based on scroll position
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200;
        
        document.querySelectorAll('section').forEach(section => {
            if (section.offsetTop <= scrollPosition && 
                section.offsetTop + section.offsetHeight > scrollPosition) {
                
                const currentId = section.getAttribute('id');
                
                // Remove active class from all links
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to current link
                const activeLink = document.querySelector(`.nav-links a[href="#${currentId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Close mobile menu when a link is clicked
    function closeMobileMenuOnClick() {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    // Smooth scroll implementation
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetPosition = document.querySelector(targetId).offsetTop - 70;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        closeMobileMenuOnClick();
    }
    
    // Testimonial Slider
    let currentSlide = 0;
    
    // Initialize testimonial slider
    function initTestimonialSlider() {
        if (testimonialSlides.length === 0) return;
        
        // Create dots for each slide
        testimonialSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            
            if (index === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        // Show first slide
        showSlide(currentSlide);
    }
    
    function showSlide(n) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and dot
        testimonialSlides[n].classList.add('active');
        if (dots.length > 0) {
            dots[n].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }
    
    function goToSlide(n) {
        currentSlide = n;
        showSlide(currentSlide);
    }
    
    // Set automatic slide transition
    let slideInterval = setInterval(nextSlide, 5000);
    
    function resetSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Handle form submission
    function handleBookingSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Simple validation
        let isValid = true;
        const requiredFields = ['name', 'email', 'phone', 'service', 'vehicle', 'date'];
        
        requiredFields.forEach(field => {
            const input = bookingForm.querySelector(`[name="${field}"]`);
            
            if (!formValues[field]) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // In a real application, this would send data to a server
        // For demo purposes, just show a success message
        alert('Thank you for your booking request! We will contact you shortly to confirm your appointment.');
        bookingForm.reset();
    }
    
    // Handle newsletter form submission
    function handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            emailInput.style.borderColor = 'red';
            return;
        }
        
        // In a real application, this would send data to a server
        // For demo purposes, just show a success message
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    }
    
    // Calculate and update service prices based on vehicle type
    function updateServicePrices() {
        const vehicleSelect = document.getElementById('vehicle');
        const serviceSelect = document.getElementById('service');
        
        if (!vehicleSelect || !serviceSelect) return;
        
        const priceDisplay = document.createElement('div');
        priceDisplay.classList.add('price-display');
        
        // Insert price display after service select
        if (!document.querySelector('.price-display')) {
            serviceSelect.parentNode.appendChild(priceDisplay);
        }
        
        function calculatePrice() {
            const vehicle = vehicleSelect.value;
            const service = serviceSelect.value;
            
            // Price matrix
            const prices = {
                'sedan': {
                    'express': 90,
                    'standard': 150,
                    'premium': 225,
                    'quick-refresh': 75,
                    'deep-clean': 130
                },
                'small-suv': {
                    'express': 110,
                    'standard': 180,
                    'premium': 275,
                    'quick-refresh': 90,
                    'deep-clean': 160
                },
                'large-suv': {
                    'express': 130,
                    'standard': 210,
                    'premium': 325,
                    'quick-refresh': 105,
                    'deep-clean': 190
                }
            };
            
            if (vehicle && service && prices[vehicle] && prices[vehicle][service]) {
                const price = prices[vehicle][service];
                priceDisplay.innerHTML = `<p>Estimated Price: <strong>$${price}</strong></p>`;
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        }
        
        vehicleSelect.addEventListener('change', calculatePrice);
        serviceSelect.addEventListener('change', calculatePrice);
    }
    
    
    // --------- Event Listeners ---------
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll for navigation links
    navItems.forEach(item => {
        item.addEventListener('click', smoothScroll);
    });
    
    // Testimonial slider controls
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideInterval();
        });
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideInterval();
        });
    }
    
    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Form submissions
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    
    // --------- Initializations ---------
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize price calculator
    updateServicePrices();
    
    // Set initial active nav item
    updateActiveNav();
    
    // AOS animation initialization (if library is included)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }

    // Add animation classes to elements when they come into view
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Service card hover effects enhancement
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.btn').classList.remove('btn-outline');
            this.querySelector('.btn').classList.add('btn');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.btn').classList.add('btn-outline');
            this.querySelector('.btn').classList.remove('btn');
        });
    });
});