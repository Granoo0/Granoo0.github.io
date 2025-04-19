document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        themeToggle.setAttribute('aria-label', theme === 'light' ? 'Toggle dark mode' : 'Toggle light mode');
    }
    
    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Set initial theme based on system preference (optional)
    // Uncomment the following lines if you want to set the initial theme based on system preference
    
    // const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // const initialTheme = systemPrefersDark ? 'dark' : 'light';
    // localStorage.setItem('theme', initialTheme);
    
    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 300) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Dynamic year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Projects Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectGrid = document.querySelector('.project-grid');
    
    // Project data
    const projects = [
        {
            id: 1,
            title: "E-Commerce Platform",
            category: "web",
            description: "A full-featured online store with product management, cart, and checkout functionality.",
            tags: ["HTML", "CSS", "JavaScript", "React"],
            image: "assets/project1.jpg"
        },
        {
            id: 2,
            title: "Mobile Fitness App",
            category: "mobile",
            description: "Cross-platform fitness tracking application with workout plans and progress analytics.",
            tags: ["React Native", "Firebase", "UI Design"],
            image: "assets/project2.jpg"
        },
        {
            id: 3,
            title: "Portfolio Website",
            category: "web",
            description: "Responsive portfolio website with modern design and smooth animations.",
            tags: ["HTML", "CSS", "JavaScript"],
            image: "assets/project3.jpg"
        },
        {
            id: 4,
            title: "Dashboard UI Kit",
            category: "design",
            description: "Customizable admin dashboard UI kit with 50+ components and 10 color schemes.",
            tags: ["Figma", "UI Design", "Design System"],
            image: "assets/project4.jpg"
        },
        {
            id: 5,
            title: "Task Management Tool",
            category: "web",
            description: "Collaborative task management application with real-time updates and team features.",
            tags: ["Vue.js", "Node.js", "MongoDB"],
            image: "assets/project5.jpg"
        },
        {
            id: 6,
            title: "Travel Booking App",
            category: "mobile",
            description: "Mobile application for booking flights and hotels with integrated payment system.",
            tags: ["Flutter", "Firebase", "UI Design"],
            image: "assets/project6.jpg"
        }
    ];
    
    // Load projects
    function loadProjects(filter = 'all') {
        projectGrid.innerHTML = '';
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <button class="btn btn-secondary view-project" data-id="${project.id}">View Details</button>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description.substring(0, 100)}...</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            projectGrid.appendChild(projectCard);
        });
        
        // Add event listeners to project buttons
        document.querySelectorAll('.view-project').forEach(button => {
            button.addEventListener('click', function() {
                const projectId = parseInt(this.getAttribute('data-id'));
                openProjectModal(projectId);
            });
        });
    }
    
    // Filter projects
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            const filter = this.getAttribute('data-filter');
            loadProjects(filter);
        });
    });
    
    // Initialize projects
    loadProjects();
    
    // Project Modal
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    
    function openProjectModal(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="modal-project-img">
            <h2 class="modal-project-title">${project.title}</h2>
            <span class="modal-project-subtitle">${project.category.charAt(0).toUpperCase() + project.category.slice(1)} Project</span>
            <p class="modal-project-description">${project.description}</p>
            
            <div class="modal-project-details">
                <div class="detail-item">
                    <h4>Project Type</h4>
                    <p>${project.category === 'web' ? 'Web Application' : 
                       project.category === 'mobile' ? 'Mobile Application' : 'UI/UX Design'}</p>
                </div>
                <div class="detail-item">
                    <h4>Technologies</h4>
                    <p>${project.tags.join(', ')}</p>
                </div>
            </div>
            
            <div class="modal-project-tags">
                ${project.tags.map(tag => `<span class="modal-project-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="modal-buttons">
                <a href="#" class="btn btn-primary">Visit Website</a>
                <a href="#" class="btn btn-secondary">View Code</a>
            </div>
        `;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    modalClose.addEventListener('click', function() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Testimonials Slider
    const testimonialSlides = document.querySelector('.testimonial-slides');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    const testimonialDots = document.querySelector('.testimonial-dots');
    
    // Testimonial data
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "CEO, TechStart Inc.",
            text: "Granoo's work on our e-commerce platform was exceptional. He delivered ahead of schedule and implemented features that significantly improved our conversion rates.",
            image: "assets/testimonial1.jpg"
        },
        {
            name: "Michael Chen",
            role: "Product Manager, Digital Solutions",
            text: "Working with Granoo was a pleasure. His attention to detail and problem-solving skills helped us overcome several technical challenges in our mobile app development.",
            image: "assets/testimonial2.jpg"
        },
        {
            name: "Emily Rodriguez",
            role: "Design Director, Creative Minds",
            text: "Granoo's UI designs transformed our dashboard interface. His user-centric approach resulted in a 40% increase in user engagement across our platform.",
            image: "assets/testimonial3.jpg"
        },
        {
            name: "James Carter",  
            role: "Product Manager, TechNova Solutions",  
            text: "Granoo's UX strategy revolutionized our mobile app. His attention to detail and seamless navigation flow led to a 30% boost in user retention within just three months.",  
            image: "assets/testimonial2.jpg"  
        },
        {
            name: "Sophia Lee",  
            role: "CEO, Bloom Digital",  
            text: "Working with Granoo was a game-changer. His intuitive design system streamlined our workflow and reduced customer support queries by 50%. Highly recommend his expertise!",  
            image: "assets/testimonial1.jpg"  
        },
        {
            name: "Michael Thompson",  
            role: "Head of Development, AlphaCore",  
            text: "Granoo’s UI/UX work on our SaaS platform was exceptional. His designs improved onboarding completion rates by 65%, making a huge impact on our business growth.",  
            image: "assets/testimonial2.jpg"  
        },
        {
            name: "Aisha Patel",  
            role: "Marketing Director, Visionary Labs",  
            text: "Granoo’s creative direction elevated our brand’s digital presence. His designs not only look stunning but also increased conversion rates by 35%. A true professional!",  
            image: "assets/testimonial3.jpg"  
        },
        {
            name: "Daniel Kim",  
            role: "Founder, NexGen Apps",  
            text: "Granoo’s ability to blend aesthetics with functionality is unmatched. His redesign of our app interface led to a 4.8-star rating on the App Store—our highest ever!",  
            image: "assets/testimonial2.jpg"  
        }
    ];
    
    // Load testimonials
    function loadTestimonials() {
        testimonialSlides.innerHTML = '';
        testimonialDots.innerHTML = '';
        
        testimonials.forEach((testimonial, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            slide.innerHTML = `
                <div class="testimonial-content">
                    <p class="testimonial-text">"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <img src="${testimonial.image}" alt="${testimonial.name}">
                        <div class="author-info">
                            <h4>${testimonial.name}</h4>
                            <p>${testimonial.role}</p>
                        </div>
                    </div>
                </div>
            `;
            testimonialSlides.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = 'testimonial-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            testimonialDots.appendChild(dot);
        });
    }
    
    let currentSlide = 0;
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider();
    }
    
    function updateSlider() {
        testimonialSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    testimonialPrev.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        updateSlider();
    });
    
    testimonialNext.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateSlider();
    });
    
    // Auto-advance testimonials
    let testimonialInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateSlider();
    }, 5000);
    
    // Pause on hover
    testimonialSlides.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialSlides.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateSlider();
        }, 5000);
    });
    
    // Initialize testimonials
    loadTestimonials();
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = '0';
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    bar.style.width = width + '%';
                    observer.unobserve(bar);
                }
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });
    }
    
    animateSkillBars();
    
    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
        });
        
        // Validate form
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        if (name.value.trim() === '') {
            document.getElementById('nameError').textContent = 'Name is required';
            document.getElementById('nameError').classList.add('show');
            isValid = false;
        }
        
        if (email.value.trim() === '') {
            document.getElementById('emailError').textContent = 'Email is required';
            document.getElementById('emailError').classList.add('show');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            document.getElementById('emailError').textContent = 'Please enter a valid email';
            document.getElementById('emailError').classList.add('show');
            isValid = false;
        }
        
        if (subject.value.trim() === '') {
            document.getElementById('subjectError').textContent = 'Subject is required';
            document.getElementById('subjectError').classList.add('show');
            isValid = false;
        }
        
        if (message.value.trim() === '') {
            document.getElementById('messageError').textContent = 'Message is required';
            document.getElementById('messageError').classList.add('show');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    contactForm.style.display = 'block';
                }, 3000);
            }, 1000);
        }
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Scroll reveal animation
    const scrollReveal = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 1000,
        delay: 200,
        reset: false
    });
    
    scrollReveal.reveal('.hero-content, .hero-image', { interval: 200 });
    scrollReveal.reveal('.about-text, .about-timeline', { interval: 200 });
    scrollReveal.reveal('.project-card', { interval: 200 });
    scrollReveal.reveal('.technical-skills, .soft-skills', { interval: 200 });
    scrollReveal.reveal('.testimonial-slider', { interval: 200 });
    scrollReveal.reveal('.contact-info, .contact-form', { interval: 200 });
});

// Add mouse move parallax effect
const imageWrapper = document.querySelector('.image-wrapper');

if (imageWrapper) {
    imageWrapper.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        imageWrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Reset on mouse leave
    imageWrapper.addEventListener('mouseleave', () => {
        imageWrapper.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

function adjustTogglePosition() {
    const themeToggle = document.querySelector('.theme-toggle');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth <= 768) {
        // Mobile layout
        const hamburgerRect = hamburger.getBoundingClientRect();
        themeToggle.style.right = `${hamburgerRect.width + 20}px`;
    } else {
        // Desktop layout
        themeToggle.style.right = '20px';
    }
}

// Run on load and resize
window.addEventListener('load', adjustTogglePosition);
window.addEventListener('resize', adjustTogglePosition);