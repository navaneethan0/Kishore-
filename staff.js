/**
 * Staff Availability Logic for RPLMS Senior Faculty
 */

document.addEventListener('DOMContentLoaded', () => {
    initStaffList();
});

let staffData = [];
let currentPage = 1;
const itemsPerPage = 5;

function initStaffList() {
    generateMockStaff();
    setupFilters();
    renderStaffTable();
}

/**
 * Mock Data Generation
 */
function generateMockStaff() {
    const departments = ['AI & DS', 'CSE', 'IT', 'ECE'];
    const designations = ['Associate Professor', 'Assistant Professor', 'Lab Technician'];
    const statuses = ['Available', 'Assigned'];
    
    // Existing data from localStorage if profiles exist
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const existingStaff = profiles.filter(p => p.role.toLowerCase() === 'staff');

    staffData = existingStaff.map((s, i) => ({
        id: s.id,
        staffID: s.rollNumber || `STF00${i+1}`,
        name: s.name,
        department: s.department,
        designation: 'Staff',
        status: 'Available',
        assignment: '-'
    }));

    // Add more mock data to reach 30 entries
    const baseNames = ['Arvind Kumar', 'Meena R', 'Karthik S', 'Lakshmi N', 'Naveen P', 'Suresh M', 'Deepa V', 'Vijay K'];
    for (let i = staffData.length; i < 30; i++) {
        const isAssigned = Math.random() > 0.6;
        staffData.push({
            id: Date.now() + i,
            staffID: `STF${(i+1).toString().padStart(3, '0')}`,
            name: `Dr. ${baseNames[i % baseNames.length]}`,
            department: departments[i % departments.length],
            designation: designations[i % designations.length],
            status: isAssigned ? 'Assigned' : 'Available',
            assignment: isAssigned ? `PRJ-2025-0${(i%5)+1} (Team ${String.fromCharCode(65 + (i%5))})` : '-'
        });
    }

    // Update Stats
    document.querySelector('.stat-card.green .stat-value').textContent = staffData.filter(s => s.status === 'Available').length;
    document.querySelector('.stat-card.orange .stat-value').textContent = staffData.filter(s => s.status === 'Assigned').length;
}

/**
 * Filter and Render Logic
 */
function setupFilters() {
    const searchInput = document.getElementById('staffSearch');
    const statusFilter = document.getElementById('statusFilter');
    const deptFilter = document.getElementById('deptFilter');
    const clearBtn = document.getElementById('clearFilters');

    const handleFilter = () => {
        currentPage = 1; // Reset to page 1 on filter
        renderStaffTable();
    };

    searchInput.addEventListener('input', handleFilter);
    statusFilter.addEventListener('change', handleFilter);
    deptFilter.addEventListener('change', handleFilter);

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = 'all';
        deptFilter.value = 'all';
        handleFilter();
    });
}

function renderStaffTable() {
    const tbody = document.getElementById('staffTableBody');
    const query = document.getElementById('staffSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const dept = document.getElementById('deptFilter').value;

    const filtered = staffData.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(query) || s.staffID.toLowerCase().includes(query);
        const matchesStatus = status === 'all' || s.status.toLowerCase() === status;
        const matchesDept = dept === 'all' || s.department === dept;
        return matchesSearch && matchesStatus && matchesDept;
    });

    // Pagination slice
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    tbody.innerHTML = '';
    
    paginated.forEach((s, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td style="font-weight: 600;">${s.staffID}</td>
            <td style="font-weight: 500;">${s.name}</td>
            <td>${s.department}</td>
            <td>${s.designation}</td>
            <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
            <td style="color: #64748b; font-size: 13px;">${s.assignment}</td>
            <td>
                <button class="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updatePaginationInfo(filtered.length);
}

function updatePaginationInfo(totalCount) {
    const start = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalCount);
    
    document.getElementById('startEntry').textContent = start;
    document.getElementById('endEntry').textContent = end;
    document.getElementById('totalEntries').textContent = totalCount;

    // Enabled/Disable buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= totalCount;

    // Render page number buttons (simplified)
    const btnContainer = document.querySelector('.pagination-buttons');
    const existingNumBtns = btnContainer.querySelectorAll('.page-btn:not(#prevPage):not(#nextPage)');
    existingNumBtns.forEach(b => b.remove());

    const pageCount = Math.ceil(totalCount / itemsPerPage);
    const nextBtn = document.getElementById('nextPage');

    for (let i = 1; i <= Math.min(pageCount, 5); i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderStaffTable();
        });
        btnContainer.insertBefore(btn, nextBtn);
    }
}

// Global Nav
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderStaffTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalCount = staffData.length; // Approximate
    if (currentPage * itemsPerPage < totalCount) {
        currentPage++;
        renderStaffTable();
    }
});
