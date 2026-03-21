const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
}

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  htmlElement.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
  localStorage.setItem('theme', 'dark');
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  htmlElement.setAttribute('data-theme', 'light');
  themeToggle.textContent = '🌙';
  localStorage.setItem('theme', 'light');
}

function toggleDarkMode() {
  if (document.body.classList.contains('dark-mode')) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

themeToggle.addEventListener('click', toggleDarkMode);

// Initialize theme on page load
initializeTheme();

/* ============================================
   SMOOTH SCROLL NAVIGATION
   ============================================ */

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */

const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    header.classList.add('scroll-down');
  } else {
    header.classList.remove('scroll-down');
  }
  
  lastScrollTop = scrollTop;
});

/* ============================================
   FORM VALIDATION & SUBMISSION
   ============================================ */

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Validation rules
const validationRules = {
  name: {
    validate: (value) => value.trim().length >= 2,
    message: 'Name must be at least 2 characters long'
  },
  email: {
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message: 'Please enter a valid email address'
  },
  message: {
    validate: (value) => value.trim().length >= 10,
    message: 'Message must be at least 10 characters long'
  }
};

// Validate individual field
function validateField(input) {
  const fieldName = input.id;
  const value = input.value;
  const rule = validationRules[fieldName];
  
  if (!rule) return true;
  
  const isValid = rule.validate(value);
  const errorElement = input.nextElementSibling;
  
  if (!isValid) {
    input.classList.add('error');
    errorElement.textContent = rule.message;
    errorElement.classList.add('show');
    return false;
  } else {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    return true;
  }
}

// Real-time validation on input
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      validateField(input);
    }
  });
});

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validate all fields
  const isNameValid = validateField(nameInput);
  const isEmailValid = validateField(emailInput);
  const isMessageValid = validateField(messageInput);
  
  if (!isNameValid || !isEmailValid || !isMessageValid) {
    showFormMessage('Please fix the errors above', 'error');
    return;
  }
  
  // Prepare form data
  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  };
  
  // Show loading state
  const submitBtn = contactForm.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  try {
    // Simulate form submission (replace with actual backend endpoint)
    await simulateFormSubmission(formData);
    
    showFormMessage('✅ Message sent successfully! Thank you for reaching out.', 'success');
    contactForm.reset();
    
    // Clear error states
    [nameInput, emailInput, messageInput].forEach(input => {
      input.classList.remove('error');
      const errorElement = input.nextElementSibling;
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
      }
    });
  } catch (error) {
    showFormMessage('❌ Error sending message. Please try again.', 'error');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Display form message
function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message show ${type}`;
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      formMessage.classList.remove('show');
    }, 5000);
  }
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Here you would normally send data to your backend
      console.log('Form submitted:', data);
      
      // Randomly resolve or reject for demo purposes
      // In production, this should be a real API call
      resolve(data);
    }, 1500);
  });
}

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('.section, .skill-card, .project-card').forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(element);
});

/* ============================================
   SCROLL PROGRESS INDICATOR
   ============================================ */

function updateScrollProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  
  // You can use this to create a progress bar if needed
  document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
}

window.addEventListener('scroll', updateScrollProgress);

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */

document.addEventListener('keydown', (e) => {
  // Close theme toggle menu with Escape key (if you add a menu)
  if (e.key === 'Escape') {
    formMessage.classList.remove('show');
  }
});

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */

// Skip to main content link (optional)
const skipLink = document.createElement('a');
skipLink.href = '#about';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px;
  z-index: 100;
`;
skipLink.addEventListener('focus', () => {
  skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in';
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';
  });
} else {
  document.body.style.opacity = '1';
}


console.log('✨ Portfolio loaded successfully!');
console.log('🌙 Theme:', localStorage.getItem('theme') || 'light');
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("active");
  });
});
