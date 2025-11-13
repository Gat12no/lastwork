// Main JavaScript for ZHIMPA ZHIMPA

// Simple authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not logged in and NOT on login/signup pages, redirect to login
    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'signup.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    // If logged in AND on login/signup pages, redirect to home
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
        return true;
    }
    
    return isLoggedIn;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isLoggedIn = checkAuth();
    
    // Update UI for logged in user
    if (isLoggedIn) {
        updateUIForLoggedInUser();
    }
    
    // Initialize forms and features
    initForms();
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const currentUser = getCurrentUser();
    const userMenu = document.getElementById('user-menu');
    const authButtons = document.getElementById('auth-buttons');
    
    if (userMenu) {
        userMenu.style.display = 'block';
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = currentUser.name || 'User';
        }
    }
    
    if (authButtons) {
        authButtons.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize all forms
function initForms() {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                const user = {
                    name: email.split('@')[0],
                    email: email
                };
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert('Please fill in all fields');
            }
        });
    }
    
    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            const user = {
                name: name,
                email: email
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            alert(`Account created for ${name}!`);
            window.location.href = 'index.html';
        });
    }
    
    // Recipe Filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                recipeCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Review Form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkAuth()) return;
            
            const name = document.getElementById('review-name').value;
            const title = document.getElementById('review-title').value;
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const review = document.getElementById('review-text').value;
            
            if (!ratingInput) {
                alert('Please select a rating');
                return;
            }
            
            const rating = ratingInput.value;
            const reviewContainer = document.getElementById('reviews-container');
            const newReview = document.createElement('div');
            newReview.className = 'review-card';
            
            const today = new Date();
            const dateString = today.toISOString().split('T')[0];
            
            newReview.innerHTML = `
                <div class="review-header">
                    <div class="review-author">${name}</div>
                    <div class="review-date">${dateString}</div>
                </div>
                <div class="review-rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
                <h4>${title || 'Great recipe!'}</h4>
                <p>${review}</p>
            `;
            
            reviewContainer.insertBefore(newReview, reviewContainer.firstChild);
            reviewForm.reset();
            alert('Thank you for your review!');
        });
    }
    
    // Newsletter Form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                alert(`Thank you for subscribing with ${email}!`);
                this.reset();
            }
        });
    });
    
    // Share Recipe Form
    const shareForm = document.getElementById('share-recipe-form');
    if (shareForm) {
        shareForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkAuth()) return;
            
            const title = document.getElementById('recipe-title').value;
            alert(`Recipe "${title}" submitted successfully!`);
            shareForm.reset();
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
            contactForm.reset();
        });
    }
    
    // Discussion Form
    const discussionForm = document.getElementById('discussion-form');
    if (discussionForm) {
        discussionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!checkAuth()) return;
            
            const name = document.getElementById('user-name').value;
            const message = document.getElementById('message').value;
            const discussionContainer = document.getElementById('discussion-container');
            const newMessage = document.createElement('div');
            newMessage.className = 'review-card';
            
            newMessage.innerHTML = `
                <div class="review-header">
                    <div class="review-author">${name}</div>
                    <div class="review-date">Just now</div>
                </div>
                <p>${message}</p>
            `;
            
            discussionContainer.insertBefore(newMessage, discussionContainer.firstChild);
            discussionForm.reset();
            
            // Remove "No messages yet" text if it exists
            const noMessages = discussionContainer.querySelector('p');
            if (noMessages && noMessages.textContent.includes('No messages yet')) {
                noMessages.remove();
            }
        });
    }
    
    // Save Recipe Button
    document.addEventListener('click', function(e) {
        if (e.target && e.target.textContent === 'Save') {
            e.preventDefault();
            if (!checkAuth()) return;
            alert('Recipe saved to your favorites!');
        }
    });
}