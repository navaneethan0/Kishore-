/**
 * Add Profile Logic for RPLMS Senior Faculty
 */

document.addEventListener('DOMContentLoaded', () => {
    initAddProfile();
});

function initAddProfile() {
    setupTabs();
    setupLivePreview();
    setupFormSubmission();
    setupPasswordToggle();
    renderRecentProfiles();
}

/**
 * Handle Tab Switching
 */
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const formTitle = document.querySelector('.form-section-title');
    const submitBtn = document.querySelector('button[type="submit"]');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.getAttribute('data-tab');
            if (tabType === 'student') {
                formTitle.textContent = 'Student Information';
                submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Student`;
            } else {
                formTitle.textContent = 'Technical Staff Information';
                submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Staff`;
            }
            
            // Clear form when switching tabs if desired
            document.getElementById('profileForm').reset();
            updatePreview();
        });
    });
}

/**
 * Update Preview Card in real-time
 */
function setupLivePreview() {
    const inputs = ['fullName', 'dob', 'phoneNumber', 'department', 'batch', 'rollNumber', 'email'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updatePreview);
        }
    });
}

function updatePreview() {
    document.getElementById('prev-name').textContent = document.getElementById('fullName').value || '-';
    document.getElementById('prev-dob').textContent = document.getElementById('dob').value || '-';
    document.getElementById('prev-phone').textContent = document.getElementById('phoneNumber').value || '-';
    document.getElementById('prev-dept').textContent = document.getElementById('department').value || '-';
    document.getElementById('prev-batch').textContent = document.getElementById('batch').value || '-';
    document.getElementById('prev-roll').textContent = document.getElementById('rollNumber').value || '-';
    document.getElementById('prev-email').textContent = document.getElementById('email').value || '-';
}

/**
 * Password Visibility Toggle
 */
function setupPasswordToggle() {
    const buttons = document.querySelectorAll('.toggle-password');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle eye icon (optional but good)
            if (type === 'text') {
                btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
            } else {
                btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            }
        });
    });
}

/**
 * Form Submission Logic
 */
function setupFormSubmission() {
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic match validation
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;
        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }

        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        
        const profile = {
            id: Date.now(),
            name: document.getElementById('fullName').value,
            role: activeTab === 'student' ? 'Student' : 'Staff',
            department: document.getElementById('department').value,
            batch: document.getElementById('batch').value || '-',
            createdAt: new Date().toLocaleString(),
            rollNumber: document.getElementById('rollNumber').value || 'GEN-' + Math.floor(Math.random() * 1000)
        };

        // Save to LocalStorage
        let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        profiles.unshift(profile); // Add to beginning
        localStorage.setItem('profiles', JSON.stringify(profiles));

        // Show Success Modal
        showModal();
        
        // Reset and Re-render
        form.reset();
        updatePreview();
        renderRecentProfiles();
    });
}

function showModal() {
    document.getElementById('successModal').classList.add('show');
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

/**
 * Render Profiles Table
 */
function renderRecentProfiles() {
    const tbody = document.getElementById('profilesTableBody');
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    
    // Add dummy data if empty for demonstration as per wireframe
    if (profiles.length === 0) {
        profiles = [
            { id: 1, name: 'Arun Kumar', role: 'Student', department: 'AI & DS', batch: '2021', createdAt: 'May 15, 2025  10:30 AM' },
            { id: 2, name: 'Priya Sharma', role: 'Student', department: 'AI & DS', batch: '2021', createdAt: 'May 15, 2025  10:15 AM' },
            { id: 3, name: 'Rohan Mehta', role: 'Student', department: 'AI & DS', batch: '2021', createdAt: 'May 15, 2025  09:45 AM' }
        ];
        localStorage.setItem('profiles', JSON.stringify(profiles));
    }

    tbody.innerHTML = '';
    
    // Show only last 5 or some number
    profiles.slice(0, 5).forEach((p, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td style="font-weight: 600;">${p.name}</td>
            <td><span class="badge badge-${p.role.toLowerCase()}">${p.role}</span></td>
            <td>${p.department}</td>
            <td>${p.batch}</td>
            <td style="color: #64748b; font-size: 13px;">${p.createdAt}</td>
            <td>
                <div class="action-icons">
                    <a href="#" class="action-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>
                    <a href="#" class="action-link delete" onclick="deleteProfile(${p.id})"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></a>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteProfile(id) {
    if (confirm('Are you sure you want to delete this profile?')) {
        let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        profiles = profiles.filter(p => p.id !== id);
        localStorage.setItem('profiles', JSON.stringify(profiles));
        renderRecentProfiles();
    }
}
