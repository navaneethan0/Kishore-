/**
 * Settings Logic for RPLMS Senior Faculty
 */

document.addEventListener('DOMContentLoaded', () => {
    initSettings();
});

function initSettings() {
    setupSectionNavigation();
    setupSaveActions();
    setupThemeToggle();
}

/**
 * Handle Sidebar Navigation within Settings
 */
function setupSectionNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSector = document.getElementById(targetId);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Scroll to section
            if (targetSector) {
                targetSector.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Handle Save/Toast notifications
 */
function setupSaveActions() {
    const saveBtns = document.querySelectorAll('.btn-primary');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Changes saved successfully!');
        });
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Handle Theme Toggle UI
 */
function setupThemeToggle() {
    const cards = document.querySelectorAll('.theme-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const theme = card.querySelector('p').textContent.toLowerCase();
            showToast(`${theme} applied successfully!`);
            
            // This is just a UI mock, 
            // In a real app we would add 'dark-mode' class to body
            if (theme.includes('dark')) {
                document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
                // Note: Filter invert is a quick way to mock dark mode but not recommended for production
            } else {
                document.body.style.filter = 'none';
            }
        });
    });
}
