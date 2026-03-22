// ✅ EmailJS Init
(function() {
  emailjs.init("JS-tTd_N1IHO3hwJm");
})();

/* ============================================
   THEME TOGGLE
   ============================================ */

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  savedTheme === 'dark' ? enableDarkMode() : disableDarkMode();
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
  document.body.classList.contains('dark-mode')
    ? disableDarkMode()
    : enableDarkMode();
}

themeToggle.addEventListener('click', toggleDarkMode);
initializeTheme();

/* ============================================
   FORM HANDLING
   ============================================ */

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// ✅ Email भेजும் function
function sendEmail(data) {
  return emailjs.send("service_ljltbsc", "template_ecrky6q", {
    name: data.name,
    email: data.email,
    message: data.message
  });
}

// Validation rules
const validationRules = {
  name: {
    validate: (value) => value.trim().length >= 2,
    message: 'Name must be at least 2 characters long'
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  message: {
    validate: (value) => value.trim().length >= 10,
    message: 'Message must be at least 10 characters long'
  }
};

function validateField(input) {
  const rule = validationRules[input.id];
  if (!rule) return true;

  const isValid = rule.validate(input.value);
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

// Real-time validation
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('blur', () => validateField(input));
});

/* ============================================
   FORM SUBMIT
   ============================================ */

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isValid =
    validateField(nameInput) &&
    validateField(emailInput) &&
    validateField(messageInput);

  if (!isValid) {
    showFormMessage('Please fix the errors above', 'error');
    return;
  }

  const formData = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
  };

  const submitBtn = contactForm.querySelector('.submit-btn');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    // ✅ REAL EMAIL SEND
    await sendEmail(formData);

    showFormMessage('✅ Message sent successfully!', 'success');
    contactForm.reset();

  } catch (error) {
    showFormMessage('❌ Error sending message.', 'error');
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});

/* ============================================
   MESSAGE DISPLAY
   ============================================ */

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message show ${type}`;

  if (type === 'success') {
    setTimeout(() => {
      formMessage.classList.remove('show');
    }, 5000);
  }
}
