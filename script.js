// DOM Elements
const lengthSlider = document.getElementById('length');
const lengthDisplay = document.getElementById('lengthDisplay');
const passwordField = document.getElementById('passwordField');
const copyBtn = document.getElementById('copyBtn');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// Character sets
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Event Listeners
lengthSlider.addEventListener('input', function() {
    lengthDisplay.textContent = this.value;
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    generatePassword();
});

// Main Functions
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const options = {
        uppercase: document.getElementById('uppercase').checked,
        lowercase: document.getElementById('lowercase').checked,
        numbers: document.getElementById('numbers').checked,
        symbols: document.getElementById('symbols').checked
    };

    // Check if at least one option is selected
    if (!Object.values(options).some(val => val)) {
        alert('Please select at least one character type!');
        return;
    }

    // Build character pool
    let charPool = '';
    for (const [type, checked] of Object.entries(options)) {
        if (checked) {
            charPool += charSets[type];
        }
    }

    // Generate password
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool[randomIndex];
    }

    passwordField.value = password;
    calculateStrength(password, options);
    
    // Reset copy button
    copyBtn.textContent = 'Copy';
    copyBtn.classList.remove('copied');
}

function calculateStrength(password, options) {
    let score = 0;
    
    // Length bonus
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety bonus
    const selectedOptions = Object.values(options).filter(val => val).length;
    score += selectedOptions;
    
    // Pattern checks
    if (password.length >= 8 && selectedOptions >= 3) score += 1;
    if (password.length >= 12 && selectedOptions >= 4) score += 1;
    
    // Update strength display
    const maxScore = 8;
    const percentage = (score / maxScore) * 100;
    
    strengthFill.style.width = percentage + '%';
    
    if (percentage <= 25) {
        strengthFill.className = 'strength-fill weak';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#dc3545';
    } else if (percentage <= 50) {
        strengthFill.className = 'strength-fill medium';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#ffc107';
    } else if (percentage <= 75) {
        strengthFill.className = 'strength-fill strong';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#28a745';
    } else {
        strengthFill.className = 'strength-fill very-strong';
        strengthText.textContent = 'Very Strong';
        strengthText.style.color = '#17a2b8';
    }
}

async function copyPassword() {
    if (!passwordField.value) {
        alert('Generate a password first!');
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordField.value);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        passwordField.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    }
}