// js/main.js - Global UI Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Determine the current page and set the active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Remove hardcoded active class
        link.classList.remove('active');
        
        // Add active class to the current link
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Mobile Navigation Toggle (placeholder for future CSS implementation)
    // If we add a hamburger menu icon, this would toggle the menu visibility
    const navContainer = document.querySelector('.nav-container');
    const toggleBtn = document.createElement('div');
    toggleBtn.classList.add('mobile-menu-toggle');
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    toggleBtn.style.display = 'none'; // Hidden by default, show in media query
    
    // Quick inline styling for mobile toggle just in case
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '1.5rem';
    toggleBtn.style.color = 'var(--white)';
    
    // Insert before nav-links
    if(window.innerWidth <= 768) {
        toggleBtn.style.display = 'block';
    }
    navContainer.insertBefore(toggleBtn, document.querySelector('.nav-links'));

    toggleBtn.addEventListener('click', () => {
        const links = document.querySelector('.nav-links');
        if (links.style.display === 'flex') {
            links.style.display = 'none';
        } else {
            links.style.display = 'flex';
            links.style.flexDirection = 'column';
            links.style.position = 'absolute';
            links.style.top = '60px';
            links.style.left = '0';
            links.style.width = '100%';
            links.style.backgroundColor = 'var(--primary-color)';
            links.style.padding = '20px';
            links.style.zIndex = '1000';
        }
    });

    window.addEventListener('resize', () => {
        if(window.innerWidth > 768) {
            toggleBtn.style.display = 'none';
            document.querySelector('.nav-links').style.display = 'flex';
            document.querySelector('.nav-links').style.flexDirection = 'row';
            document.querySelector('.nav-links').style.position = 'static';
            document.querySelector('.nav-links').style.padding = '0';
        } else {
            toggleBtn.style.display = 'block';
            document.querySelector('.nav-links').style.display = 'none';
        }
    });
});

// Utility function to show Toast Notifications
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Styling
    toast.style.minWidth = '250px';
    toast.style.backgroundColor = type === 'success' ? '#16a34a' : '#dc2626';
    toast.style.color = 'white';
    toast.style.padding = '15px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    toast.style.fontSize = '1rem';
    toast.style.fontWeight = '500';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';

    // Icon
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if(toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
