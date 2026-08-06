// js/form-handler.js - Form validation and submission

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.querySelector('.product-form');
    if (!productForm) return;

    // Determine if we are on add or edit page
    const isEditPage = window.location.pathname.includes('edit-product.html');
    let editProductId = null;

    if (isEditPage) {
        // We need an ID to edit
        const urlParams = new URLSearchParams(window.location.search);
        editProductId = urlParams.get('id');
        
        // If we have an ID, load the data into the form (for demo purposes)
        if (editProductId) {
            const product = getProductById(editProductId);
            if (product) {
                document.getElementById('productName').value = product.name;
                document.getElementById('category').value = product.category;
                document.getElementById('price').value = product.price;
                document.getElementById('sellerName').value = product.sellerName;
                document.getElementById('condition').value = product.condition;
                document.getElementById('description').value = product.description;
                
                const currentImg = document.querySelector('.current-image');
                if (currentImg) currentImg.src = product.image;
            } else {
                showToast('Product not found for editing', 'error');
            }
        }
    }

    // Image Upload Preview (Add Product)
    const fileInput = document.getElementById('productImage');
    const fileLabel = document.querySelector('.file-label span');
    
    // We will store the base64 string here if they upload an image
    let uploadedImageBase64 = null; 

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Change label text
                if (fileLabel) fileLabel.textContent = file.name;
                
                // Read file for preview/saving
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadedImageBase64 = event.target.result;
                    // Optional: show preview somewhere
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Change Image (Edit Product)
    const changeImgBtn = document.querySelector('.btn-change-image');
    if (changeImgBtn) {
        changeImgBtn.addEventListener('click', () => {
            // In a real app, this would open a file picker
            // For now, we'll just simulate selecting a random unsplash image
            const randomImages = [
                'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400'
            ];
            const randomImg = randomImages[Math.floor(Math.random() * randomImages.length)];
            uploadedImageBase64 = randomImg;
            
            const currentImg = document.querySelector('.current-image');
            if (currentImg) currentImg.src = randomImg;
            
            showToast('Image changed (simulated)', 'success');
        });
    }

    // Form Submission
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values
        const name = document.getElementById('productName').value.trim();
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const sellerName = document.getElementById('sellerName').value.trim();
        const condition = document.getElementById('condition').value;
        const description = document.getElementById('description').value.trim();

        // Basic validation
        if (!name || !category || !price || !sellerName || !condition || !description) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        const productData = {
            name,
            category,
            price: parseFloat(price),
            sellerName,
            condition,
            type: condition === 'Used' ? 'Second-hand' : 'Reusable',
            description,
            // Fallback image if none uploaded
            image: uploadedImageBase64 || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400'
        };

        if (isEditPage && editProductId) {
            // Update existing
            updateProduct(editProductId, productData);
            showToast('Product updated successfully!', 'success');
        } else {
            // Add new
            addProduct(productData);
            showToast('Product added successfully!', 'success');
            productForm.reset();
            if (fileLabel) fileLabel.textContent = 'Upload a photo of your product';
            uploadedImageBase64 = null;
        }

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
    });
});
