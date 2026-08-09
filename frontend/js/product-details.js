// js/product-details.js - Product Details & Gallery

document.addEventListener('DOMContentLoaded', () => {
    // Only run if we are on the product details page
    const detailsContainer = document.querySelector('.product-details-container');
    if (!detailsContainer) return;

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        // If no ID, redirect to products or show error
        detailsContainer.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 1.2rem;">Product not found. <a href="products.html" style="color: var(--primary-color);">Go back to products</a></div>';
        return;
    }

    // Fetch product details
    const product = getProductById(productId);

    if (!product) {
        detailsContainer.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 1.2rem;">Product not found. <a href="products.html" style="color: var(--primary-color);">Go back to products</a></div>';
        return;
    }

    // Populate the UI with product data
    
    // Page Title
    document.title = `${product.name} - RecycleHub`;

    // Images
    const mainImage = document.querySelector('.main-image img');
    if (mainImage) mainImage.src = product.image;

    // We can simulate thumbnails using slightly cropped versions of the main image
    const thumbnailsContainer = document.querySelector('.thumbnail-images');
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = `
            <div class="thumbnail active">
                <img src="${product.image}" alt="Thumbnail 1">
            </div>
            <div class="thumbnail">
                <img src="${product.image}&rect=0,0,1000,1000" alt="Thumbnail 2">
            </div>
            <div class="thumbnail">
                <img src="${product.image}&rect=100,100,800,800" alt="Thumbnail 3">
            </div>
        `;

        // Gallery Interaction
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active class from all
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked
                thumb.classList.add('active');
                // Update main image
                const newSrc = thumb.querySelector('img').src;
                mainImage.src = newSrc;
            });
        });
    }

    // Info Details
    const titleElement = document.querySelector('.title-price-row h1');
    const priceElement = document.querySelector('.price-big');
    const categoryBadge = document.querySelector('.category-badge');
    
    if (titleElement) titleElement.textContent = product.name;
    if (priceElement) priceElement.textContent = `৳${product.price}`;
    
    if (categoryBadge) {
        let categoryIcon = 'fa-leaf';
        if (product.category === 'Books') categoryIcon = 'fa-book';
        if (product.category === 'Sports') categoryIcon = 'fa-bicycle';
        if (product.category === 'Electronics') categoryIcon = 'fa-mobile-screen';
        
        categoryBadge.innerHTML = `<i class="fa-solid ${categoryIcon}"></i> ${product.category}`;
    }

    // Meta List
    const metaList = document.querySelector('.meta-list');
    if (metaList) {
        metaList.innerHTML = `
            <li><i class="fa-regular fa-user"></i> <span>Seller:</span> <strong>${product.sellerName}</strong></li>
            <li><i class="fa-solid fa-tag"></i> <span>Condition:</span> <strong>${product.condition}</strong></li>
            <li><i class="fa-solid fa-recycle"></i> <span>Type:</span> <strong>${product.type}</strong></li>
        `;
    }

    // Description
    const descBox = document.querySelector('.description-box');
    if (descBox) descBox.textContent = product.description;

    // Payment Modal Elements
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModal = document.getElementById('closePaymentModal');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    
    // Instruction Elements
    const instructionText = document.getElementById('instructionText');
    const accountNumber = document.getElementById('accountNumber');
    
    // Form Inputs
    const transactionId = document.getElementById('transactionId');
    const customerName = document.getElementById('customerName');
    const customerPhone = document.getElementById('customerPhone');

    // Payment Methods Info
    const paymentInfo = {
        bkash: {
            text: 'Please send money to our bKash Personal Number:',
            number: '01711223344'
        },
        nagad: {
            text: 'Please send money to our Nagad Personal Number:',
            number: '01922334455'
        },
        rocket: {
            text: 'Please send money to our Rocket Personal Number:',
            number: '01833445566'
        },
        bank: {
            text: 'Please transfer money to our Bank Account:',
            number: 'DBBL Acc: 123.456.7890'
        }
    };

    // Handle Payment Method Change
    if (paymentOptions.length > 0) {
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                const method = e.target.value;
                instructionText.textContent = paymentInfo[method].text;
                accountNumber.textContent = paymentInfo[method].number;
            });
        });
    }

    // Action Buttons
    const buyBtn = document.querySelector('.btn-buy');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            if (paymentModal) {
                // Populate summary
                document.getElementById('summaryProductName').textContent = product.name;
                document.getElementById('summaryProductPrice').textContent = `৳${product.price}`;
                document.getElementById('summaryTotalAmount').textContent = `৳${product.price}`;
                
                // Set default bKash info just in case
                document.querySelector('input[name="paymentMethod"][value="bkash"]').checked = true;
                instructionText.textContent = paymentInfo.bkash.text;
                accountNumber.textContent = paymentInfo.bkash.number;

                // Show modal
                paymentModal.classList.add('active');
            } else {
                showToast('Added to cart successfully!', 'success');
            }
        });
    }

    // Close Modal
    if (closePaymentModal) {
        closePaymentModal.addEventListener('click', () => {
            paymentModal.classList.remove('active');
        });
    }
    
    // Close on outside click
    if (paymentModal) {
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                paymentModal.classList.remove('active');
            }
        });
    }

    // Confirm Payment Submit
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            // Validate inputs
            if (!transactionId.value.trim() || !customerName.value.trim() || !customerPhone.value.trim()) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const originalText = confirmPaymentBtn.innerHTML;
            confirmPaymentBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            confirmPaymentBtn.disabled = true;
            
            // Simulate verification delay
            setTimeout(() => {
                confirmPaymentBtn.innerHTML = originalText;
                confirmPaymentBtn.disabled = false;
                
                paymentModal.classList.remove('active');
                
                // Clear form
                transactionId.value = '';
                customerName.value = '';
                customerPhone.value = '';
                
                // Reset to default payment method
                document.querySelector('input[name="paymentMethod"][value="bkash"]').checked = true;
                instructionText.textContent = paymentInfo.bkash.text;
                accountNumber.textContent = paymentInfo.bkash.number;
                
                // Success message
                showToast('Payment submitted successfully! Your transaction is being verified.', 'success');
            }, 1500);
        });
    }
    
    const shareBtn = document.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            // Copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Link copied to clipboard!', 'success');
            }).catch(() => {
                showToast('Failed to copy link', 'error');
            });
        });
    }

    // Manage Buttons
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.href = `edit-product.html?id=${product.id}`;
    }

    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this product?')) {
                deleteProduct(product.id);
                showToast('Product deleted successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'products.html';
                }, 1000);
            }
        });
    }
});
