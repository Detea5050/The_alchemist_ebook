// Countdown timer with cleanup
let countdownInterval;

function updateCountdown() {
    const now = new Date();
    const endDate = new Date();
    endDate.setUTCDate(now.getUTCDate() + 3); // 3 days from now in UTC
    
    const diff = endDate - now;
    
    // Don't show negative time if countdown ends
    if (diff <= 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = '<p>Special offer has ended</p>';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

function initCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Add animation to buy button
function setupBuyButton() {
    const buyButton = document.getElementById('buy-button');
    if (!buyButton) return;
    
    const originalContent = buyButton.innerHTML;
    
    buyButton.addEventListener('mouseenter', () => {
        buyButton.innerHTML = '<i class="fas fa-arrow-right"></i> GET INSTANT ACCESS';
    });
    
    buyButton.addEventListener('mouseleave', () => {
        buyButton.innerHTML = originalContent;
    });
    
    return function cleanup() {
        buyButton.removeEventListener('mouseenter');
        buyButton.removeEventListener('mouseleave');
    };
}

// Add pulse animation to ebook image
let pulseInterval;

function setupEbookPulse() {
    const ebookImage = document.getElementById('ebook-image');
    if (!ebookImage) return;
    
    pulseInterval = setInterval(() => {
        ebookImage.style.transform = 'scale(1.03)';
        setTimeout(() => {
            ebookImage.style.transform = 'scale(1)';
        }, 1000);
    }, 3000);
    
    return function cleanup() {
        clearInterval(pulseInterval);
    };
}

// ================= Payment Section Script ========================

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const plan = urlParams.get('plan') || 'basic'; // Default to basic if not specified
const method = urlParams.get('method');

// Plan information
const planInfo = {
    'basic': { name: 'Basic Plan', duration: '1 Month', price: 80 },
    'intermediate': { name: 'Basic to Advanced', duration: '2 Months', price: 150 },
    'vip': { name: 'VIP Plan', duration: '3 Months', price: 250 }
};

// Update the page with the selected plan
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    setupBuyButton();
    setupEbookPulse();
    updatePlanInfo();
    
    // Show default payment method based on URL parameter
    if (method) {
        setTimeout(() => {
            showPaymentMethod(method);
        }, 300);
    } else {
        showPaymentMethod('bank'); // Default to bank method
    }
});

function updatePlanInfo() {
    const planElement = document.getElementById('plan-info');
    if (!planElement || !planInfo[plan]) return;
    
    planElement.innerHTML = `
        <div class="plan-card">
            <h3>${planInfo[plan].name}</h3>
            <p><i class="fas fa-calendar-alt"></i> ${planInfo[plan].duration}</p>
            <p class="plan-price"><i class="fas fa-tag"></i> $${planInfo[plan].price}</p>
        </div>
    `;
    planElement.classList.add('fade-in');
}

function showPaymentMethod(method) {
    const validMethods = ['bank', 'crypto', 'eth'];
    if (!validMethods.includes(method)) return;
    
    // Hide all payment methods with animation
    document.querySelectorAll('.payment-method').forEach(el => {
        if (el.classList.contains('active-method')) {
            el.classList.add('fade-out');
            setTimeout(() => {
                el.classList.remove('active-method', 'fade-out');
                el.hidden = true;
            }, 300);
        }
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.payment-tab').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected method with animation
    setTimeout(() => {
        const methodElement = document.getElementById(`${method}-method`);
        if (methodElement) {
            methodElement.hidden = false;
            methodElement.classList.add('active-method', 'fade-in');
        }
    }, 300);
    
    // Activate selected tab
    const tab = document.querySelector(`.payment-tab[onclick*="showPaymentMethod('${method}')"]`);
    if (tab) tab.classList.add('active');
    
    // Update amounts based on plan
    updatePaymentAmounts(plan);
}

function updatePaymentAmounts(plan) {
    if (!planInfo[plan]) return;
    
    const exchangeRate = 1440;
    const btcRate = 42000;
    const ethRate = 2800;
    
    const usdAmount = planInfo[plan].price;
    const nairaAmount = usdAmount * exchangeRate;
    const btcAmount = usdAmount / btcRate;
    const ethAmount = usdAmount / ethRate;
    
    // Animate number changes
    animateValue('usd-amount', 0, usdAmount, 1000);
    animateValue('naira-amount', 0, nairaAmount, 1000);
    animateValue('naira-instruction', 0, nairaAmount, 1000);
    
    // Update BTC amounts
    const btcRateElement = document.getElementById('btc-rate');
    if (btcRateElement) btcRateElement.textContent = btcRate.toLocaleString();
    
    animateValue('btc-usd-amount', 0, usdAmount, 1000);
    animateValue('btc-amount', 0, btcAmount, 1000, 6);
    animateValue('btc-amount-instruction', 0, btcAmount, 1000, 6);
    animateValue('btc-usd-instruction', 0, usdAmount, 1000);
    
    // Update ETH amounts
    const ethRateElement = document.getElementById('eth-rate');
    if (ethRateElement) ethRateElement.textContent = ethRate.toLocaleString();
    
    animateValue('eth-usd-amount', 0, usdAmount, 1000);
    animateValue('eth-amount', 0, ethAmount, 1000, 6);
    animateValue('eth-amount-instruction', 0, ethAmount, 1000, 6);
    animateValue('eth-usd-instruction', 0, usdAmount, 1000);
}

function animateValue(id, start, end, duration, decimals = 0) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        
        if (decimals > 0) {
            obj.textContent = value.toFixed(decimals);
        } else {
            obj.textContent = Math.floor(value).toLocaleString();
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Fixed copy functionality
function copyToClipboard(text, event) {
    if (!event) return;
    
    const btn = event.currentTarget;
    if (!btn) return;
    
    const originalContent = btn.innerHTML;
    const originalBackground = btn.style.background;
    
    // Fallback for browsers that don't support clipboard API
    const fallbackCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; 
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(btn, originalContent, originalBackground);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            btn.innerHTML = '<i class="fas fa-times"></i> Failed!';
            btn.style.background = 'var(--error)';
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.style.background = originalBackground;
            }, 2000);
        }
        
        document.body.removeChild(textarea);
    };
    
    const showCopySuccess = (button, originalContent, originalBackground) => {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = 'var(--success)';
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = originalBackground;
        }, 2000);
    };
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
            .then(() => showCopySuccess(btn, originalContent, originalBackground))
            .catch(err => {
                console.error('Clipboard API failed, using fallback:', err);
                fallbackCopy();
            });
    } else {
        fallbackCopy();
    }
}

// Enhanced payment confirmation
function confirmPayment() {
    const button = document.querySelector('.confirm-button');
    if (!button) return;
    
    // Store original state
    const originalContent = button.innerHTML;
    const originalClasses = button.className;
    
    // Show processing state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.classList.add('processing');
    button.classList.remove('pulse');
    
    // Simulate processing delay
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check-circle"></i> Payment Confirmed!';
        button.style.background = 'linear-gradient(to right, var(--success), #5cb85c)';
        
        // Show confirmation message
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation-message';
        confirmation.innerHTML = `
            <h3><i class="fas fa-check-circle"></i> Thank you for your payment!</h3>
            <p>We've received your payment details and will contact you shortly to confirm your Payment.</p>
            <p>Check your email for confirmation and next steps.</p>
            <a href="index.html" class="return-home-btn">Return to Home</a>
        `;
        
        const confirmationContainer = document.querySelector('.payment-confirmation');
        if (confirmationContainer) {
            confirmationContainer.before(confirmation);
            
            // Scroll to confirmation
            setTimeout(() => {
                confirmation.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }, 1500);
}

// Cleanup when leaving page
window.addEventListener('beforeunload', function() {
    clearInterval(countdownInterval);
    clearInterval(pulseInterval);
});

// Enhanced payment confirmation with reliable notification
function confirmPayment(event) {
    // Prevent default behavior if this is triggered by a form
    if (event) event.preventDefault();
    
    const button = document.querySelector('.confirm-button');
    if (!button) {
        console.error('Confirm button not found');
        return;
    }

    // Disable button to prevent multiple clicks
    button.disabled = true;
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'payment-notification';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle notification-icon"></i>
            <div class="notification-text">
                <h4>Payment Received!</h4>
                <p>We've recorded your payment confirmation.</p>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add to DOM first before animating
    document.body.appendChild(notification);
    
    // Force reflow to enable animation
    void notification.offsetWidth;
    
    // Animate in
    notification.classList.add('show');

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });
    }

    // Auto-close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
        closeNotification(notification);
    }, 5000);

    // Simulate processing (replace with actual payment verification)
    setTimeout(() => {
        // Update button state
        button.innerHTML = '<i class="fas fa-check-circle"></i> Payment Confirmed!';
        button.style.backgroundColor = '#4CAF50';
        
        // Create confirmation message
        showConfirmationMessage();
        
        // Clear the auto-close timer if notification was already closed
        clearTimeout(autoCloseTimer);
    }, 1500);
}

function closeNotification(notification) {
    if (!notification) return;
    
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function showConfirmationMessage() {
    const confirmationContainer = document.querySelector('.payment-confirmation');
    if (!confirmationContainer) return;
    
    // Remove any existing confirmation messages
    const existingConfirmation = document.querySelector('.confirmation-message');
    if (existingConfirmation) {
        existingConfirmation.remove();
    }
    
    const confirmation = document.createElement('div');
    confirmation.className = 'confirmation-message';
    confirmation.innerHTML = `
        <h3><i class="fas fa-check-circle"></i> Thank you for your payment!</h3>
        <p>We've received your payment details and will contact you shortly.</p>
        <p>Check your email for confirmation and next steps.</p>
        <a href="index.html" class="return-home-btn">Return to Home</a>
    `;
    
    confirmationContainer.before(confirmation);
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize event listener properly
document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.querySelector('.confirm-button');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmPayment);
    }
});

setInterval(updateCryptoAmounts, 300000);

 function showPaymentMethod(method) {
            try {
                // Hide all methods
                document.querySelectorAll('.payment-method').forEach(el => {
                    el.classList.remove('active-method');
                    el.hidden = true;
                });
                
                // Show selected method
                const methodElement = document.getElementById(`${method}-method`);
                if (methodElement) {
                    methodElement.classList.add('active-method');
                    methodElement.hidden = false;
                } else {
                    console.error(`Element with ID ${method}-method not found`);
                    return;
                }
                
                // Update tab states
                document.querySelectorAll('.payment-tab').forEach(tab => {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                });
                
                const activeTab = document.querySelector(`.payment-tab[onclick*="${method}"]`);
                if (activeTab) {
                    activeTab.classList.add('active');
                    activeTab.setAttribute('aria-selected', 'true');
                }
            } catch (error) {
                console.error('Error in showPaymentMethod:', error);
            }
        }
