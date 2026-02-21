// Darbar Murshadabad Shareef - Main Script

// Global variables
let mehfils = [];
let gallery = [];
let weeklySchedule = [];

// Admin password (change this to your desired password)
const ADMIN_PASSWORD = "sahiwal123";

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loading...');
    loadMehfils();
    loadGallery();
    loadSchedule();
    updateCurrentDate();
    setupEventListeners();
    displayMehfils(); // Ensure display on load
});

// Update current date
function updateCurrentDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const currentDate = new Date().toLocaleDateString('ur-PK', options);
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = currentDate;
    }
}

// Load mehfils from localStorage or use default
function loadMehfils() {
    try {
        const saved = localStorage.getItem('darbarMehfils');
        if (saved) {
            mehfils = JSON.parse(saved);
            console.log('Loaded mehfils from storage:', mehfils);
        } else {
            // Default mehfils - Today's date ke sath
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            mehfils = [
                {
                    id: 1,
                    date: today,
                    time: '15:00',
                    location: 'peshawar',
                    locationName: 'دربار مرشدآباد شریف، پشاور',
                    type: 'zikr',
                    typeName: 'ذکر و اذکار',
                    description: 'خصوصی مجلس ذکر - حضور مخدوم سید مرشد علی شاہ رحمتہ اللہ علیہ کا فیضان',
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUD_LA0S4cnoNXxemKzdC8gMznp0cPYdQBzA&s'
                },
                {
                    id: 2,
                    date: tomorrowStr,
                    time: '14:30',
                    location: 'sahiwal',
                    locationName: 'دارالخیر ساہیوال',
                    type: 'durood',
                    typeName: 'درود شریف',
                    description: 'مجلس درود و سلام - خصوصی شرکت دارالخیر ساہیوال',
                    image: 'https://i.postimg.cc/xTVc7Cms/Allah-ho.png'
                }
            ];
            saveMehfils();
        }
    } catch (e) {
        console.error('Error loading mehfils:', e);
    }
}

// Save mehfils to localStorage
function saveMehfils() {
    try {
        localStorage.setItem('darbarMehfils', JSON.stringify(mehfils));
        console.log('Saved mehfils to storage');
    } catch (e) {
        console.error('Error saving mehfils:', e);
    }
}

// Display mehfils on the page
function displayMehfils() {
    console.log('Displaying mehfils...');
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's mehfils
    const todayMehfils = mehfils.filter(m => m.date === today);
    console.log('Today mehfils:', todayMehfils);
    
    const upcomingMehfils = mehfils.filter(m => m.date > today).sort((a, b) => a.date.localeCompare(b.date));
    console.log('Upcoming mehfils:', upcomingMehfils);
    
    // Display today's mehfils
    const todayContainer = document.getElementById('today-mehfils');
    if (todayContainer) {
        if (todayMehfils.length > 0) {
            todayContainer.innerHTML = todayMehfils.map(createMehfilCard).join('');
        } else {
            todayContainer.innerHTML = `
                <div class="mehfil-card">
                    <p style="text-align: center; color: #666; padding: 20px;">آج کوئی مجلس نہیں ہے</p>
                </div>
            `;
        }
    }
    
    // Display upcoming mehfils
    const upcomingContainer = document.getElementById('upcoming-mehfils');
    if (upcomingContainer) {
        if (upcomingMehfils.length > 0) {
            upcomingContainer.innerHTML = upcomingMehfils.slice(0, 5).map(createMehfilCard).join('');
        } else {
            upcomingContainer.innerHTML = `
                <div class="mehfil-card">
                    <p style="text-align: center; color: #666; padding: 20px;">کوئی آنے والی مجلس نہیں</p>
                </div>
            `;
        }
    }
    
    // Display featured mehfil (Aaj ki khas mehfil)
    const featuredContainer = document.getElementById('featured-mehfil');
    if (featuredContainer) {
        if (todayMehfils.length > 0) {
            featuredContainer.innerHTML = createFeaturedMehfil(todayMehfils[0]);
        } else if (upcomingMehfils.length > 0) {
            featuredContainer.innerHTML = createUpcomingFeaturedMehfil(upcomingMehfils[0]);
        } else {
            featuredContainer.innerHTML = `
                <div class="mehfil-card featured">
                    <p style="text-align: center; padding: 30px;">کوئی مجلس شیڈول نہیں ہے</p>
                </div>
            `;
        }
    }
}

// Create mehfil card HTML
function createMehfilCard(mehfil) {
    const imageUrl = mehfil.image || 'images/allah-ho.png';
    
    return `
        <div class="mehfil-card">
            <div class="mehfil-header">
                <span class="mehfil-date">${formatDate(mehfil.date)}</span>
                <span class="mehfil-badge">${mehfil.typeName}</span>
            </div>
            <div class="mehfil-body">
                <img src="${imageUrl}" alt="مجلس کی تصویر" onerror="this.src='https://img.freepik.com/free-vector/islamic-label-with-mosque_1394-476.jpg'">
                <div class="mehfil-details">
                    <p><i class="fas fa-clock"></i> ${mehfil.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${mehfil.locationName}</p>
                    <p><i class="fas fa-info-circle"></i> ${mehfil.description}</p>
                </div>
            </div>
        </div>
    `;
}

// Create featured mehfil card for today
function createFeaturedMehfil(mehfil) {
    return `
        <div class="mehfil-header">
            <span class="mehfil-date">آج کی مجلس</span>
            <span class="mehfil-badge">${mehfil.typeName}</span>
        </div>
        <div class="mehfil-body">
            <div class="mehfil-details">
                <p><i class="fas fa-clock"></i> وقت: ${mehfil.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> مقام: ${mehfil.locationName}</p>
                <p><i class="fas fa-info-circle"></i> ${mehfil.description}</p>
            </div>
        </div>
    `;
}

// Create featured mehfil card for upcoming
function createUpcomingFeaturedMehfil(mehfil) {
    return `
        <div class="mehfil-header">
            <span class="mehfil-date">آنے والی مجلس</span>
            <span class="mehfil-badge">${formatDate(mehfil.date)}</span>
        </div>
        <div class="mehfil-body">
            <div class="mehfil-details">
                <p><i class="fas fa-clock"></i> وقت: ${mehfil.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> مقام: ${mehfil.locationName}</p>
                <p><i class="fas fa-info-circle"></i> ${mehfil.description}</p>
            </div>
        </div>
    `;
}

// Format date for display
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ur-PK', options);
    } catch (e) {
        return dateStr;
    }
}

// Load gallery from localStorage
function loadGallery() {
    const saved = localStorage.getItem('darbarGallery');
    if (saved) {
        gallery = JSON.parse(saved);
    } else {
        // Default gallery with working images
        gallery = [
            { id: 1, image: 'https://i.postimg.cc/m2xsRpTm/hero1.jpg', caption: 'دربار مرشدآباد شریف' },
            { id: 2, image: 'https://i.postimg.cc/xTVc7Cms/Allah-ho.png', caption: 'مجلس ذکر' },
            { id: 3, image: 'images/hero3.jpg', caption: 'خصوصی اجتماع' }
        ];
    }
    displayGallery();
}

// Display gallery
function displayGallery() {
    const galleryContainer = document.getElementById('gallery-grid');
    if (galleryContainer) {
        galleryContainer.innerHTML = gallery.map(item => `
            <div class="gallery-item">
                <img src="${item.image}" alt="${item.caption}" onerror="this.src='https://i.postimg.cc/xTVc7Cms/Allah-ho.png'">
                <div class="gallery-caption">${item.caption}</div>
            </div>
        `).join('');
    }
}

// Load weekly schedule
function loadSchedule() {
    const scheduleContainer = document.getElementById('weekly-schedule');
    if (scheduleContainer) {
        const schedule = [
            { day: 'پیر', time: 'بعد نماز مغرب', type: 'ذکر و اذکار' },
            { day: 'جمعرات', time: 'بعد نماز عشاء', type: 'درود شریف' },
            { day: 'ہفتہ', time: 'صبح 10 بجے', type: 'خصوصی مجلس' }
        ];
        
        scheduleContainer.innerHTML = schedule.map(item => `
            <li>
                <i class="fas fa-calendar-day"></i>
                <strong>${item.day}:</strong> ${item.time} - ${item.type}
            </li>
        `).join('');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Show other location input
    const locationSelect = document.getElementById('mehfilLocation');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            const otherGroup = document.getElementById('otherLocationGroup');
            if (otherGroup) {
                otherGroup.style.display = this.value === 'other' ? 'block' : 'none';
            }
        });
    }
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    };
}

// Admin Panel Functions
function openAdminPanel() {
    document.getElementById('passwordModal').style.display = 'block';
}

function verifyPassword() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('adminModal').style.display = 'block';
    } else {
        alert('غلط پاس ورڈ!');
    }
    document.getElementById('adminPassword').value = '';
}

function closeModal() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('passwordModal').style.display = 'none';
}

// Add new mehfil
function addNewMehfil(event) {
    event.preventDefault();
    
    const location = document.getElementById('mehfilLocation').value;
    let locationName = '';
    
    if (location === 'peshawar') {
        locationName = 'دربار مرشدآباد شریف، پشاور';
    } else if (location === 'sahiwal') {
        locationName = 'دارالخیر ساہیوال';
    } else {
        locationName = document.getElementById('otherLocation').value || 'دیگر مقام';
    }
    
    const type = document.getElementById('mehfilType').value;
    const typeNames = {
        'zikr': 'ذکر و اذکار',
        'durood': 'درود شریف',
        'bait': 'بیعت',
        'special': 'خصوصی مجلس'
    };
    
    const newMehfil = {
        id: Date.now(),
        date: document.getElementById('mehfilDate').value,
        time: document.getElementById('mehfilTime').value,
        location: location,
        locationName: locationName,
        type: type,
        typeName: typeNames[type],
        description: document.getElementById('mehfilDescription').value,
        image: document.getElementById('mehfilImage').value || ''
    };
    
    mehfils.push(newMehfil);
    saveMehfils();
    displayMehfils(); // Yeh line important hai
    closeModal();
    
    alert('مجلس کامیابی سے شامل کر دی گئی!');
    
    // Form reset karein
    event.target.reset();
}

// Quick add from Sahiwal
function openAddMehfilModal() {
    const modal = document.getElementById('addMehfilModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Today's date set karein
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('quickDate');
        if (dateInput) {
            dateInput.value = today;
        }
    }
}

function closeAddModal() {
    document.getElementById('addMehfilModal').style.display = 'none';
}

function quickAddMehfil(event) {
    event.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    
    const newMehfil = {
        id: Date.now(),
        date: document.getElementById('quickDate').value || today,
        time: document.getElementById('quickTime').value || '15:00',
        location: 'sahiwal',
        locationName: 'دارالخیر ساہیوال',
        type: 'special',
        typeName: 'خصوصی مجلس',
        description: document.getElementById('quickDesc').value || 'مجلس کا انعقاد',
        image: ''
    };
    
    mehfils.push(newMehfil);
    saveMehfils();
    displayMehfils(); // Yeh line important hai
    closeAddModal();
    
    alert('اطلاع کامیابی سے بھیج دی گئی!');
    
    // Form reset karein
    event.target.reset();
}

// Manual refresh function - agar manually refresh karna ho to
function refreshMehfils() {
    displayMehfils();
    console.log('Manual refresh done');
}

// Export functions for global use
window.openAdminPanel = openAdminPanel;
window.closeModal = closeModal;
window.openAddMehfilModal = openAddMehfilModal;
window.closeAddModal = closeAddModal;
window.addNewMehfil = addNewMehfil;
window.quickAddMehfil = quickAddMehfil;
window.verifyPassword = verifyPassword;
window.refreshMehfils = refreshMehfils;


// -------------------------------------------------

// History Section Variables
let currentDeleteId = null;
let currentFilter = 'all';

// Open History Modal
function openHistoryModal() {
    loadHistory();
    document.getElementById('historyModal').style.display = 'block';
}

// Close History Modal
function closeHistoryModal() {
    document.getElementById('historyModal').style.display = 'none';
}

// Load History (past mehfils)
function loadHistory() {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    // Past mehfils filter karein (30 din purani)
    let pastMehfils = mehfils.filter(m => m.date < today && m.date >= thirtyDaysAgoStr);
    
    // Filter apply karein
    if (currentFilter !== 'all') {
        pastMehfils = pastMehfils.filter(m => m.location === currentFilter);
    }
    
    // Date ke according sort karein (newest first)
    pastMehfils.sort((a, b) => b.date.localeCompare(a.date));
    
    // Update badge count
    updateHistoryBadge(pastMehfils.length);
    
    // Display history
    const historyList = document.getElementById('historyList');
    if (pastMehfils.length > 0) {
        historyList.innerHTML = pastMehfils.map(mehfil => `
            <div class="history-item ${mehfil.location}" data-id="${mehfil.id}">
                <div class="history-item-content">
                    <div class="history-item-header">
                        <span class="history-date">${formatDate(mehfil.date)}</span>
                        <span class="history-type">${mehfil.typeName}</span>
                        <span class="history-location">
                            <i class="fas fa-map-marker-alt"></i> ${mehfil.locationName}
                        </span>
                    </div>
                    <div class="history-description">
                        ${mehfil.description}
                    </div>
                    <div class="history-time">
                        <i class="fas fa-clock"></i> وقت: ${mehfil.time}
                    </div>
                </div>
                <button class="delete-history-btn" onclick="openDeleteConfirm(${mehfil.id})" title="حذف کریں">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    } else {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>کوئی گذشتہ مجلس نہیں مل سکی</p>
            </div>
        `;
    }
}

// Update history badge
function updateHistoryBadge(count) {
    const badge = document.getElementById('historyCount');
    if (badge) {
        badge.textContent = count;
        if (count > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Filter history
function filterHistory(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reload history with filter
    loadHistory();
}

// Open delete confirmation
function openDeleteConfirm(id) {
    currentDeleteId = id;
    document.getElementById('deleteConfirmModal').style.display = 'block';
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteConfirmModal').style.display = 'none';
    currentDeleteId = null;
}

// Confirm delete single mehfil
function confirmDelete() {
    if (currentDeleteId) {
        // Mehfil remove karein
        mehfils = mehfils.filter(m => m.id !== currentDeleteId);
        saveMehfils();
        
        // Update displays
        displayMehfils();
        loadHistory();
        
        closeDeleteModal();
        alert('مجلس حذف کر دی گئی!');
    }
}

// Confirm delete all past mehfils
function confirmDeleteAll() {
    if (confirm('کیا آپ واقعی تمام پرانی مجالس حذف کرنا چاہتے ہیں؟')) {
        const today = new Date().toISOString().split('T')[0];
        
        // Sirf aaj ki aur future ki mehfils rahein
        mehfils = mehfils.filter(m => m.date >= today);
        
        saveMehfils();
        displayMehfils();
        loadHistory();
        
        alert('تمام پرانی مجالس حذف کر دی گئیں!');
    }
}

// Auto-delete old mehfils (30 days se purani)
function autoDeleteOldMehfils() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    mehfils = mehfils.filter(m => m.date >= thirtyDaysAgoStr);
    saveMehfils();
    displayMehfils();
}

// Call this on load
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    autoDeleteOldMehfils(); // Purani mehfils auto-delete
    updateHistoryBadge(mehfils.filter(m => m.date < new Date().toISOString().split('T')[0]).length);
});

// Export functions
window.openHistoryModal = openHistoryModal;
window.closeHistoryModal = closeHistoryModal;
window.filterHistory = filterHistory;
window.openDeleteConfirm = openDeleteConfirm;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.confirmDeleteAll = confirmDeleteAll;
