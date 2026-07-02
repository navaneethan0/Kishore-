/**
 * Core Application Logic for RPLMS Senior Faculty Module
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    toggleSidebar();
    highlightActiveLink();
}

/**
 * Handle sidebar toggle on mobile
 */
function toggleSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

/**
 * Highlight the active sidebar menu item based on the current URL
 */
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        
        // Remove active class from all
        item.classList.remove('active');

        // Check if the current page matches the item's href
        if (currentPath.includes(itemPath) && itemPath !== '#') {
            item.classList.add('active');
        } 
        // Special case for dashboard if we are at root or pages/
        else if ((currentPath === '/' || currentPath.endsWith('index.html')) && itemPath.includes('dashboard.html')) {
            item.classList.add('active');
        }
    });
}

/**
 * Common Tool: Format Date
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

/**
 * Common Tool: Toggle Element Visibility
 */
function toggleElement(id, displayStyle = 'block') {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = el.style.display === 'none' ? displayStyle : 'none';
    }
}
