// js/products.js - Product Listing & Filtering

document.addEventListener('DOMContentLoaded', () => {
    // Only run this script if there is a product grid on the page
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    // We can be on index.html (featured products) or products.html (all products)
    const isProductsPage = window.location.pathname.includes('products.html');
    
    // Elements for filtering (only on products.html)
    const categoryFilter = document.querySelector('.filter-group select:nth-child(2)');
    const conditionFilter = document.querySelectorAll('.filter-group select')[1];
    const searchInput = document.querySelector('.search-box input');
    const productCountText = document.querySelector('.product-count');

    // Function to render products
    function renderProducts(productsToRender) {
        productGrid.innerHTML = ''; // Clear current grid

        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-light);">No products found matching your criteria.</div>';
            if (productCountText) productCountText.textContent = `Showing 0 products`;
            return;
        }

        productsToRender.forEach(product => {
            // Badges logic
            let categoryIcon = 'fa-leaf';
            if (product.category === 'Books') categoryIcon = 'fa-book';
            if (product.category === 'Sports') categoryIcon = 'fa-bicycle';
            if (product.category === 'Electronics') categoryIcon = 'fa-mobile-screen';
            
            let statusClass = product.condition === 'Used' ? 'tag-used' : 'tag-reusable';
            if (!isProductsPage) statusClass = product.condition === 'Used' ? 'status-used' : 'status-reusable';

            // Create card HTML based on the page context
            const card = document.createElement('div');
            card.className = 'product-card';
            
            if (isProductsPage) {
                // products.html layout
                card.innerHTML = `
                    <div class="image-wrapper">
                        <a href="product-details.html?id=${product.id}">
                            <img src="${product.image}" alt="${product.name}">
                        </a>
                        <span class="status-tag ${statusClass}">${product.condition}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title-list">${product.name}</h3>
                        <span class="badge category-${product.category.toLowerCase()}"><i class="fa-solid ${categoryIcon}"></i> ${product.category}</span>
                        <p class="product-desc-list">${product.description}</p>
                        <div class="price-list">৳${product.price}</div>
                        <div class="product-footer-list">
                            <div class="seller"><i class="fa-regular fa-user"></i> Seller: ${product.sellerName}</div>
                            <a href="product-details.html?id=${product.id}" class="btn btn-view"><i class="fa-solid fa-cart-shopping"></i> View</a>
                        </div>
                    </div>
                `;
            } else {
                // index.html layout
                card.innerHTML = `
                    <a href="product-details.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <div class="product-info">
                        <div class="product-header">
                            <h3>${product.name}</h3>
                            <span class="badge category-${product.category.toLowerCase()}">${product.category}</span>
                        </div>
                        <p>${product.description}</p>
                        <div class="price">৳${product.price}</div>
                        <div class="product-footer">
                            <div class="seller"><i class="fa-regular fa-user"></i> Seller: ${product.sellerName}</div>
                            <span class="status-badge ${statusClass}">${product.condition}</span>
                        </div>
                    </div>
                `;
            }
            productGrid.appendChild(card);
        });

        if (productCountText) {
            productCountText.textContent = `Showing ${productsToRender.length} product${productsToRender.length !== 1 ? 's' : ''}`;
        }
    }

    // Function to apply filters
    function applyFilters() {
        const allProducts = getProducts();
        
        const catValue = categoryFilter ? categoryFilter.value : 'All Categories';
        const condValue = conditionFilter ? conditionFilter.value : 'All Conditions';
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';

        const filtered = allProducts.filter(product => {
            const matchCategory = catValue === 'All Categories' || product.category === catValue;
            const matchCondition = condValue === 'All Conditions' || product.condition === condValue;
            const matchSearch = product.name.toLowerCase().includes(searchValue) || 
                                product.description.toLowerCase().includes(searchValue);
            
            return matchCategory && matchCondition && matchSearch;
        });

        renderProducts(filtered);
    }

    // Initial render
    let productsList = getProducts();
    if (!isProductsPage) {
        // Only show latest 4 on home page
        productsList = productsList.slice(-4);
    }
    renderProducts(productsList);

    // Event listeners for filters (only if they exist on the page)
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (conditionFilter) conditionFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
});
