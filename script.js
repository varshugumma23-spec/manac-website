// Enhanced script with login/register and recommendation system

// User tracking and recommendation system
let userActivity = {
    sections: {},
    interests: [],
    timeSpent: {},
    currentUser: null
};

let sectionStartTime = Date.now();
let currentSection = 'home';

// Track user activity
function trackSection(sectionName) {
    const timeSpent = Date.now() - sectionStartTime;
    userActivity.timeSpent[currentSection] = (userActivity.timeSpent[currentSection] || 0) + timeSpent;
    userActivity.sections[sectionName] = (userActivity.sections[sectionName] || 0) + 1;
    currentSection = sectionName;
    sectionStartTime = Date.now();
    
    // Show recommendation after 30 seconds on a section
    setTimeout(() => {
        if (currentSection === sectionName) {
            showRecommendation(sectionName);
        }
    }, 30000);
}

// Recommendation algorithm
function showRecommendation(section) {
    if (document.getElementById('recommendationPopup').style.display === 'block') return;
    
    const recommendations = {
        'courses': {
            text: "Based on your interest in our courses, we recommend starting with Java Full Stack - our most popular program!",
            link: "#courses"
        },
        'services': {
            text: "Interested in our services? Check out our placement assistance program with 95% success rate!",
            link: "#contact"
        },
        'about': {
            text: "Since you're learning about us, explore our success stories from 10,000+ students!",
            link: "#testimonials"
        }
    };
    
    const rec = recommendations[section];
    if (rec) {
        document.getElementById('recommendationText').textContent = rec.text;
        document.getElementById('recommendationLink').href = rec.link;
        document.getElementById('recommendationPopup').style.display = 'block';
        
        // Auto hide after 10 seconds
        setTimeout(() => {
            closeRecommendation();
        }, 10000);
    }
}

// Modal functions with navigation
function openModal(type) {
    // Navigate to dedicated pages instead of modal
    if (type === 'login') {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'register.html';
    }
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchForm(type) {
    if (type === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }
}

function closeRecommendation() {
    document.getElementById('recommendationPopup').style.display = 'none';
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    userActivity.currentUser = email;
    localStorage.setItem('manacUser', email);
    closeModal();
    updateUserInterface();
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    const userData = {
        name: event.target.querySelector('input[type="text"]').value,
        email: event.target.querySelector('input[type="email"]').value,
        phone: event.target.querySelector('input[type="tel"]').value,
        interest: event.target.querySelector('select').value
    };
    
    userActivity.currentUser = userData.email;
    userActivity.interests.push(userData.interest);
    localStorage.setItem('manacUser', userData.email);
    localStorage.setItem('manacUserData', JSON.stringify(userData));
    
    closeModal();
    updateUserInterface();
}

// Check if user is logged in and update UI
function updateUserInterface() {
    const savedUser = localStorage.getItem('manacUser');
    const userData = localStorage.getItem('manacUserData');
    
    if (savedUser) {
        // User is logged in
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        
        // Get user name
        let userName = 'User';
        if (userData) {
            const data = JSON.parse(userData);
            userName = data.name || savedUser.split('@')[0];
        } else {
            userName = savedUser.split('@')[0];
        }
        
        document.getElementById('userName').textContent = userName;
        userActivity.currentUser = savedUser;
        
        if (userData) {
            const data = JSON.parse(userData);
            userActivity.interests = [data.interest];
        }
    } else {
        // User is not logged in
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
    }
}

// Toggle dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
}

// Logout function
function logout() {
    localStorage.removeItem('manacUser');
    localStorage.removeItem('manacUserData');
    userActivity.currentUser = null;
    userActivity.interests = [];
    updateUserInterface();
    alert('Logged out successfully!');
}

// Smooth scrolling with tracking
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const sectionName = this.getAttribute('href').substring(1);
            trackSection(sectionName);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for section tracking
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id || 'home';
            trackSection(sectionId);
        }
    });
}, { threshold: 0.5 });

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
    }
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your interest! We will contact you soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat h3');
            stats.forEach(stat => {
                const finalValue = parseInt(stat.textContent.replace(/[^\d]/g, ''));
                animateCounter(stat, finalValue);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const suffix = element.textContent.includes('+') ? '+' : 
                      element.textContent.includes('%') ? '%' : '';
        element.textContent = Math.floor(current) + suffix;
    }, 40);
}

// Check if user is logged in and update UI
function updateUserInterface() {
    const savedUser = localStorage.getItem('manacUser');
    const userData = localStorage.getItem('manacUserData');
    
    if (savedUser) {
        // User is logged in
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        
        // Get user name
        let userName = 'User';
        if (userData) {
            const data = JSON.parse(userData);
            userName = data.name || savedUser.split('@')[0];
        } else {
            userName = savedUser.split('@')[0];
        }
        
        document.getElementById('userName').textContent = userName;
        userActivity.currentUser = savedUser;
        
        if (userData) {
            const data = JSON.parse(userData);
            userActivity.interests = [data.interest];
        }
    } else {
        // User is not logged in
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
    }
}

// Toggle dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('show');
}

// Logout function
function logout() {
    localStorage.removeItem('manacUser');
    localStorage.removeItem('manacUserData');
    userActivity.currentUser = null;
    userActivity.interests = [];
    updateUserInterface();
    alert('Logged out successfully!');
}

// Initialize on page load
window.addEventListener('load', () => {
    updateUserInterface();
    document.body.classList.add('loaded');
    
    setTimeout(() => {
        const savedUser = localStorage.getItem('manacUser');
        if (!savedUser) {
            document.getElementById('recommendationText').textContent = 'New here? Register now to get personalized course recommendations!';
            document.getElementById('recommendationLink').href = '#';
            document.getElementById('recommendationLink').onclick = () => {
                closeRecommendation();
                openModal('register');
            };
            document.getElementById('recommendationPopup').style.display = 'block';
        }
    }, 5000);
});
// Enhanced animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Magnetic effect for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        shapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Enhanced course card interactions
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateX(5deg) scale(1.02)';
            
            // Add glow effect to icon
            const icon = this.querySelector('.course-icon i');
            if (icon) {
                icon.style.filter = 'drop-shadow(0 0 20px currentColor)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) scale(1)';
            
            // Remove glow effect
            const icon = this.querySelector('.course-icon i');
            if (icon) {
                icon.style.filter = 'none';
            }
        });
    });

    // Typewriter effect restart on scroll
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    setTimeout(() => {
                        entry.target.style.animation = 'typing 4s steps(40, end), blink-caret 0.75s step-end infinite';
                    }, 100);
                }
            });
        });
        observer.observe(typewriterElement);
    }

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// CSS for ripple effect
const rippleCSS = `
.btn {
    position: relative;
    overflow: hidden;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);