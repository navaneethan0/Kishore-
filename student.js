/**
 * Student List Logic for RPLMS Senior Faculty
 */

document.addEventListener('DOMContentLoaded', () => {
    initStudentList();
});

let studentData = [];
let currentPage = 1;
const itemsPerPage = 5;

function initStudentList() {
    generateMockStudents();
    setupFilters();
    renderStudentTable();
    setupExport();
}

/**
 * Mock Data Generation
 */
function generateMockStudents() {
    const departments = ['AI & DS', 'CSE', 'IT', 'ECE'];
    const batches = ['2022 - 2026', '2021 - 2025', '2020 - 2024'];
    
    // Existing data from localStorage
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const existingStudents = profiles.filter(p => p.role.toLowerCase() === 'student');

    studentData = existingStudents.map((s, i) => ({
        id: s.id,
        studentID: `STD2025${(i+1).toString().padStart(3, '0')}`,
        name: s.name,
        rollNumber: s.rollNumber || `22BCS${(i+1).toString().padStart(3, '0')}`,
        department: s.department,
        batch: s.batch ? `${s.batch} - ${parseInt(s.batch)+4}` : '2022 - 2026',
        email: s.email || `${s.name.toLowerCase().replace(' ', '.')}@example.com`
    }));

    // Fill up to 120 entries
    const firstNames = ['Arun', 'Priya', 'Rohan', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Sonal', 'Rahul', 'Neha'];
    const lastNames = ['Kumar', 'Sharma', 'Mehta', 'P', 'S', 'Reddy', 'Singh', 'Verma', 'Gupta', 'Iyer'];

    for (let i = studentData.length; i < 120; i++) {
        const fname = firstNames[i % firstNames.length];
        const lname = lastNames[i % lastNames.length];
        const dept = departments[i % departments.length];
        const batch = batches[i % batches.length];
        
        studentData.push({
            id: Date.now() + i,
            studentID: `STD2025${(i+1).toString().padStart(3, '0')}`,
            name: `${fname} ${lname}`,
            rollNumber: `22BCS${(i+1).toString().padStart(3, '0')}`,
            department: dept,
            batch: batch,
            email: `${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`
        });
    }
}

/**
 * Filtering Logic
 */
function setupFilters() {
    const search = document.getElementById('studentSearch');
    const dept = document.getElementById('deptFilter');
    const batch = document.getElementById('batchFilter');

    const handleFilter = () => {
        currentPage = 1;
        renderStudentTable();
    };

    search.addEventListener('input', handleFilter);
    dept.addEventListener('change', handleFilter);
    batch.addEventListener('change', handleFilter);
}

function renderStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    const query = document.getElementById('studentSearch').value.toLowerCase();
    const dept = document.getElementById('deptFilter').value;
    const batch = document.getElementById('batchFilter').value;

    const filtered = studentData.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(query) || 
                             h.studentID.toLowerCase().includes(query) || 
                             h.rollNumber.toLowerCase().includes(query);
        const matchesDept = dept === 'all' || h.department === dept;
        const matchesBatch = batch === 'all' || h.batch === batch;
        return matchesSearch && matchesDept && matchesBatch;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    tbody.innerHTML = '';
    
    paginated.forEach((s, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td style="font-weight: 600;">${s.studentID}</td>
            <td style="font-weight: 500;">${s.name}</td>
            <td>${s.rollNumber}</td>
            <td>${s.department}</td>
            <td>${s.batch}</td>
            <td style="color: #64748b; font-size: 13px;">${s.email}</td>
            <td>
                <button class="action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updatePagination(filtered.length);
}

function updatePagination(total) {
    const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    
    document.getElementById('startEntry').textContent = start;
    document.getElementById('endEntry').textContent = end;
    document.getElementById('totalEntries').textContent = total;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= total;

    // Numerical buttons logic (Simplified)
    const btnContainer = document.querySelector('.pagination-buttons');
    const existing = btnContainer.querySelectorAll('.page-btn:not(#prevPage):not(#nextPage)');
    const ellipsis = btnContainer.querySelector('.pagination-ellipsis');
    
    existing.forEach(b => b.remove());
    if (ellipsis) ellipsis.remove();

    const maxPages = Math.ceil(total / itemsPerPage);
    const nextBtn = document.getElementById('nextPage');

    for (let i = 1; i <= Math.min(maxPages, 5); i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderStudentTable();
        });
        btnContainer.insertBefore(btn, nextBtn);
    }

    if (maxPages > 5) {
        const dots = document.createElement('span');
        dots.className = 'pagination-ellipsis';
        dots.textContent = '...';
        btnContainer.insertBefore(dots, nextBtn);

        const lastBtn = document.createElement('button');
        lastBtn.className = `page-btn ${maxPages === currentPage ? 'active' : ''}`;
        lastBtn.textContent = maxPages;
        lastBtn.addEventListener('click', () => {
            currentPage = maxPages;
            renderStudentTable();
        });
        btnContainer.insertBefore(lastBtn, nextBtn);
    }
}

/**
 * Export Logic
 */
function setupExport() {
    document.getElementById('exportBtn').addEventListener('click', () => {
        alert('Exporting student list to Excel...');
        // In a real app, this would use a library like SheetJS or generate a CSV
    });
}

// Global Nav
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderStudentTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * itemsPerPage < studentData.length) {
        currentPage++;
        renderStudentTable();
    }
});
