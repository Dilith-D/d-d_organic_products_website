// Products data
const products = [
    {
        id: 1,
        name: "Dried Cow Dung Manure",
        price: 250,
        description: "Premium quality dried cow dung manure, rich in nutrients for healthy plant growth.",
        emoji: "🐄"
    },
    {
        id: 2,
        name: "Goat Manure",
        price: 300,
        description: "Organic goat manure pellets, excellent for improving soil structure and fertility.",
        emoji: "🐐"
    },
    {
        id: 3,
        name: "Clamp Powder",
        price: 180,
        description: "Natural clamp powder for enhanced root development and plant immunity.",
        emoji: "🌿"
    },
    {
        id: 4,
        name: "Vermi Compost",
        price: 350,
        description: "High-quality vermicompost made from organic waste, perfect for all plants.",
        emoji: "🪱"
    },
    {
        id: 5,
        name: "Shell Powder",
        price: 200,
        description: "Calcium-rich shell powder for stronger plants and better fruit development.",
        emoji: "🐚"
    },
    {
        id: 6,
        name: "Quail Manure",
        price: 400,
        description: "Nutrient-dense quail manure, ideal for vegetables and flowering plants.",
        emoji: "🦆"
    },
    {
        id: 7,
        name: "Neem Oil",
        price: 450,
        description: "Pure cold-pressed neem oil for natural pest control and plant health.",
        emoji: "🌳"
    },
    {
        id: 8,
        name: "Hybrid Vegetable Seeds",
        price: 150,
        description: "High-yield hybrid vegetable seeds for your kitchen garden.",
        emoji: "🌱"
    },
    {
        id: 9,
        name: "Chicken Droppings",
        price: 220,
        description: "Processed chicken droppings, nitrogen-rich fertilizer for rapid growth.",
        emoji: "🐔"
    }
];

// Cart management
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    initSmoothScrolling();
    initIntersectionObserver();
});

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-icon" role="img" aria-label="${product.name}">
                ${product.emoji}
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">₹${product.price}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </article>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification('Product added to cart!');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-icon">${item.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} each</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCartUI();
    }
}

// Toggle cart
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    
    cartModal.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
}

// Buy now
function buyNow() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    const orderDetails = cart.map(item => 
        `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Hello DD Organic Products! 🌱\n\nI'd like to order:\n\n${orderDetails}\n\n*Total: ₹${total}*\n\nPlease confirm availability and delivery details.`;
    
    const whatsappNumber = '919400605440'; // Replace with actual number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Handle contact form
function handleContactForm(event) {
    event.preventDefault();
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
    event.target.reset();
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#00dc82' : '#ff4444';
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${bgColor};
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideInUp 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    // Animate hamburger menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    menuToggle.classList.toggle('active');
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Initialize Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll('.product-card, .feature-item, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Save cart to localStorage (optional feature)
function saveCart() {
    localStorage.setItem('ddOrganicCart', JSON.stringify(cart));
}

// Load cart from localStorage (optional feature)
function loadCart() {
    const savedCart = localStorage.getItem('ddOrganicCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
    saveCart();
    showNotification('Cart cleared!');
}

// Sticky header on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0,0,0,0.95)';
    } else {
        header.style.background = 'rgba(0,0,0,0.8)';
    }
});
