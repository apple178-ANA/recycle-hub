// js/api.js - Mock API and Database Service

const STORAGE_KEY = 'recyclehub_products';

// Initial dummy data
const initialProducts = [
    {
        id: 1,
        name: "Wooden Chair",
        category: "Furniture",
        price: 1200,
        sellerName: "Rahim",
        condition: "Used",
        type: "Second-hand",
        description: "Good condition wooden chair, lightly used.",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400",
        dateAdded: new Date().toISOString()
    },
    {
        id: 2,
        name: "Reusable Bottle",
        category: "Plastic",
        price: 50,
        sellerName: "Karim",
        condition: "Reusable",
        type: "Second-hand",
        description: "Clean and reusable plastic bottle. Good for daily use and helpful for reducing plastic waste.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400",
        dateAdded: new Date().toISOString()
    },
    {
        id: 3,
        name: "Second-hand Books",
        category: "Books",
        price: 300,
        sellerName: "Nabila",
        condition: "Used",
        type: "Second-hand",
        description: "Good condition academic books.",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
        dateAdded: new Date().toISOString()
    },
    {
        id: 4,
        name: "Old Bicycle",
        category: "Sports",
        price: 2500,
        sellerName: "Hasan",
        condition: "Used",
        type: "Second-hand",
        description: "Well-used but in working condition.",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400",
        dateAdded: new Date().toISOString()
    }
];

// Initialize local storage if empty
function initDB() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    }
}

// Get all products
function getProducts() {
    initDB();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// Get product by ID
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === parseInt(id));
}

// Add a new product
function addProduct(product) {
    const products = getProducts();
    
    // Generate a simple ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        ...product,
        id: newId,
        dateAdded: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    
    return newProduct;
}

// Update existing product
function updateProduct(id, updatedProduct) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        return products[index];
    }
    return null;
}

// Delete a product
function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== parseInt(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Initialize on script load
initDB();
