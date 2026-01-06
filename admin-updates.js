// Admin panel with automatic updates
class AdminUpdates {
    constructor() {
        this.currentTab = 'announcements';
    }
    
    loadAdminPanel() {
        const tabs = [
            { id: 'announcements', name: '📢 ಘೋಷಣೆಗಳು', icon: 'fa-bullhorn' },
            { id: 'prices', name: '🌾 ಬೆಲೆಗಳು', icon: 'fa-seedling' },
            { id: 'services', name: '🛠️ ಸೇವೆಗಳು', icon: 'fa-tools' },
            { id: 'jobs', name: '👷 ಕೆಲಸಗಳು', icon: 'fa-briefcase' },
            { id: 'emergency', name: '🚑 ತುರ್ತು ಸಂಪರ್ಕ', icon: 'fa-ambulance' }
        ];
        
        const tabsContainer = document.getElementById('admin-panel-tabs');
        const contentContainer = document.getElementById('admin-panel-content');
        
        // Load tabs
        tabsContainer.innerHTML = '';
        tabs.forEach((tab, index) => {
            const button = document.createElement('button');
            button.innerHTML = `<i class="fas ${tab.icon}"></i> ${tab.name}`;
            button.onclick = () => this.loadAdminSection(tab.id);
            if (index === 0) button.classList.add('active');
            tabsContainer.appendChild(button);
        });
        
        // Load first section
        this.loadAdminSection(tabs[0].id);
    }
    
    loadAdminSection(sectionId) {
        this.currentTab = sectionId;
        const contentContainer = document.getElementById('admin-panel-content');
        const tabsContainer = document.getElementById('admin-panel-tabs');
        
        // Update active tab
        tabsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        switch(sectionId) {
            case 'announcements':
                contentContainer.innerHTML = this.getAnnouncementsForm();
                break;
            case 'prices':
                contentContainer.innerHTML = this.getPricesForm();
                break;
            case 'services':
                contentContainer.innerHTML = this.getServicesForm();
                break;
            case 'jobs':
                contentContainer.innerHTML = this.getJobsForm();
                break;
            case 'emergency':
                contentContainer.innerHTML = this.getEmergencyForm();
                break;
            default:
                contentContainer.innerHTML = `<p>ನಿರ್ವಹಣೆ ಲಭ್ಯವಿಲ್ಲ</p>`;
        }
    }
    
    getAnnouncementsForm() {
        return `
            <div class="admin-form-section">
                <h4><i class="fas fa-bullhorn"></i> ಹೊಸ ಘೋಷಣೆ ಸೇರಿಸಿ</h4>
                <div class="form-group">
                    <label>ಶೀರ್ಷಿಕೆ</label>
                    <input type="text" id="announcement-title" class="form-control" placeholder="ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ">
                </div>
                <div class="form-group">
                    <label>ವಿವರಣೆ</label>
                    <textarea id="announcement-text" class="form-control" placeholder="ವಿವರಣೆ ನಮೂದಿಸಿ" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label>ಮುಖ್ಯವಾಗಿದೆಯೇ?</label>
                    <select id="announcement-important" class="form-control">
                        <option value="no">ಸಾಮಾನ್ಯ</option>
                        <option value="yes">ಮುಖ್ಯ</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="adminSaveAnnouncement()">
                    <i class="fas fa-paper-plane"></i> ಘೋಷಣೆ ಪ್ರಕಟಿಸಿ
                </button>
                <div class="mt-4">
                    <h5><i class="fas fa-history"></i> ಹಿಂದಿನ ಘೋಷಣೆಗಳು</h5>
                    <div id="announcements-list" class="admin-list"></div>
                </div>
            </div>
        `;
    }
    
    getPricesForm() {
        return `
            <div class="admin-form-section">
                <h4><i class="fas fa-seedling"></i> ಹೊಸ ಬೆಲೆ ಸೇರಿಸಿ</h4>
                <div class="form-group">
                    <label>ಬೆಳೆ ಹೆಸರು</label>
                    <input type="text" id="price-crop" class="form-control" placeholder="ಬೆಳೆ ಹೆಸರು">
                </div>
                <div class="form-group">
                    <label>ಬೆಲೆ (₹/100kg)</label>
                    <input type="text" id="price-amount" class="form-control" placeholder="ಬೆಲೆ">
                </div>
                <div class="form-group">
                    <label>ಮಾರುಕಟ್ಟೆ</label>
                    <input type="text" id="price-market" class="form-control" placeholder="ಮಾರುಕಟ್ಟೆ ಹೆಸರು">
                </div>
                <div class="form-group">
                    <label>ಟ್ರೆಂಡ್</label>
                    <select id="price-trend" class="form-control">
                        <option value="new">ಹೊಸದು</option>
                        <option value="up">ಹೆಚ್ಚಳ</option>
                        <option value="down">ಕಡಿಮೆ</option>
                        <option value="stable">ಸ್ಥಿರ</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="adminSavePrice()">
                    <i class="fas fa-save"></i> ಬೆಲೆ ಸೇರಿಸಿ
                </button>
            </div>
        `;
    }
    
    getServicesForm() {
        return `
            <div class="admin-form-section">
                <h4><i class="fas fa-tools"></i> ಹೊಸ ಸೇವೆ ಸೇರಿಸಿ</h4>
                <div class="form-group">
                    <label>ಸೇವೆ ಹೆಸರು</label>
                    <input type="text" id="service-name" class="form-control" placeholder="ಸೇವೆ ಹೆಸರು">
                </div>
                <div class="form-group">
                    <label>ವ್ಯಕ್ತಿ ಹೆಸರು</label>
                    <input type="text" id="service-person" class="form-control" placeholder="ವ್ಯಕ್ತಿ ಹೆಸರು">
                </div>
                <div class="form-group">
                    <label>ದೂರವಾಣಿ ಸಂಖ್ಯೆ</label>
                    <input type="text" id="service-phone" class="form-control" placeholder="ದೂರವಾಣಿ ಸಂಖ್ಯೆ">
                </div>
                <div class="form-group">
                    <label>ವರ್ಗ</label>
                    <select id="service-category" class="form-control">
                        <option value="electrician">ವಿದ್ಯುತ್</option>
                        <option value="plumber">ಪ್ಲಂಬಿಂಗ್</option>
                        <option value="transport">ಸಾರಿಗೆ</option>
                        <option value="agriculture">ಕೃಷಿ</option>
                        <option value="other">ಇತರೆ</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ವಿವರಣೆ</label>
                    <textarea id="service-description" class="form-control" placeholder="ವಿವರಣೆ" rows="3"></textarea>
                </div>
                <button class="btn btn-primary" onclick="adminSaveService()">
                    <i class="fas fa-save"></i> ಸೇವೆ ಸೇರಿಸಿ
                </button>
            </div>
        `;
    }
    
    getJobsForm() {
        return `
            <div class="admin-form-section">
                <h4><i class="fas fa-briefcase"></i> ಹೊಸ ಕೆಲಸ ಸೇರಿಸಿ</h4>
                <div class="form-group">
                    <label>ಕೆಲಸದ ಹೆಸರು</label>
                    <input type="text" id="job-title" class="form-control" placeholder="ಕೆಲಸದ ಹೆಸರು">
                </div>
                <div class="form-group">
                    <label>ಸಂಬಳ</label>
                    <input type="text" id="job-salary" class="form-control" placeholder="ಸಂಬಳ">
                </div>
                <div class="form-group">
                    <label>ಸ್ಥಳ</label>
                    <input type="text" id="job-location" class="form-control" placeholder="ಸ್ಥಳ">
                </div>
                <div class="form-group">
                    <label>ವಿವರಣೆ</label>
                    <textarea id="job-description" class="form-control" placeholder="ವಿವರಣೆ" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>ಸಂಪರ್ಕ ಸಂಖ್ಯೆ</label>
                    <input type="text" id="job-contact" class="form-control" placeholder="ಸಂಪರ್ಕ ಸಂಖ್ಯೆ">
                </div>
                <button class="btn btn-primary" onclick="adminSaveJob()">
                    <i class="fas fa-save"></i> ಕೆಲಸ ಸೇರಿಸಿ
                </button>
            </div>
        `;
    }
    
    getEmergencyForm() {
        return `
            <div class="admin-form-section">
                <h4><i class="fas fa-ambulance"></i> ತುರ್ತು ಸಂಪರ್ಕ ಸೇರಿಸಿ</h4>
                <div class="form-group">
                    <label>ಹೆಸರು</label>
                    <input type="text" id="emergency-name" class="form-control" placeholder="ಹೆಸರು">
                </div>
                <div class="form-group">
                    <label>ದೂರವಾಣಿ ಸಂಖ್ಯೆ</label>
                    <input type="text" id="emergency-phone" class="form-control" placeholder="ದೂರವಾಣಿ ಸಂಖ್ಯೆ">
                </div>
                <div class="form-group">
                    <label>ವಿವರಣೆ</label>
                    <textarea id="emergency-description" class="form-control" placeholder="ವಿವರಣೆ" rows="3"></textarea>
                </div>
                <button class="btn btn-primary" onclick="adminSaveEmergency()">
                    <i class="fas fa-save"></i> ಸಂಪರ್ಕ ಸೇರಿಸಿ
                </button>
            </div>
        `;
    }
}

// Create admin updates instance
const adminUpdates = new AdminUpdates();

// Admin save functions with automatic real-time updates
async function adminSaveAnnouncement() {
    if (!isAdmin) {
        showToast('ನಿರ್ವಾಹಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ', 'error');
        return;
    }
    
    const title = document.getElementById('announcement-title').value.trim();
    const text = document.getElementById('announcement-text').value.trim();
    const important = document.getElementById('announcement-important').value;
    
    if (!title || !text) {
        showToast('ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಣೆ ಅಗತ್ಯ', 'error');
        return;
    }
    
    const announcement = {
        title,
        text,
        important: important === 'yes',
        date: new Date().toLocaleDateString('kn-IN'),
        author: currentUser.name,
        timestamp: Date.now()
    };
    
    // Push to real-time system
    const success = await realtimeSystem.pushUpdate('announcements', announcement);
    
    if (success) {
        showToast('ಘೋಷಣೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ! ಎಲ್ಲರಿಗೂ ತೋರಿಸಲಾಗುತ್ತಿದೆ...', 'success');
        
        // Clear form
        document.getElementById('announcement-title').value = '';
        document.getElementById('announcement-text').value = '';
        
        // Update local storage
        saveToLocalStorage('announcements', announcement);
        
        // Update UI immediately
        document.getElementById('announcement-text').textContent = text;
    } else {
        showToast('ಘೋಷಣೆ ಪ್ರಕಟಿಸಲು ವಿಫಲವಾಗಿದೆ', 'error');
    }
}

async function adminSavePrice() {
    if (!isAdmin) {
        showToast('ನಿರ್ವಾಹಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ', 'error');
        return;
    }
    
    const crop = document.getElementById('price-crop').value.trim();
    const price = document.getElementById('price-amount').value.trim();
    const market = document.getElementById('price-market').value.trim() || CONFIG.DISTRICT + ' ಮಾರುಕಟ್ಟೆ';
    const trend = document.getElementById('price-trend').value;
    
    if (!crop || !price) {
        showToast('ಬೆಳೆ ಮತ್ತು ಬೆಲೆ ಅಗತ್ಯ', 'error');
        return;
    }
    
    const priceData = {
        crop,
        price,
        market,
        trend,
        date: new Date().toLocaleDateString('kn-IN'),
        timestamp: Date.now()
    };
    
    // Push to real-time system
    const success = await realtimeSystem.pushUpdate('prices', priceData);
    
    if (success) {
        showToast('ಬೆಲೆ ಸೇರಿಸಲಾಗಿದೆ! ಎಲ್ಲರಿಗೂ ತೋರಿಸಲಾಗುತ್ತಿದೆ...', 'success');
        
        // Clear form
        document.getElementById('price-crop').value = '';
        document.getElementById('price-amount').value = '';
        document.getElementById('price-market').value = '';
        
        // Update local storage
        saveToLocalStorage('prices', priceData);
        
        // Update UI immediately
        addNewPriceToTable(priceData);
    } else {
        showToast('ಬೆಲೆ ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ', 'error');
    }
}

async function adminSaveService() {
    if (!isAdmin) {
        showToast('ನಿರ್ವಾಹಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ', 'error');
        return;
    }
    
    const name = document.getElementById('service-name').value.trim();
    const person = document.getElementById('service-person').value.trim();
    const phone = document.getElementById('service-phone').value.trim();
    const category = document.getElementById('service-category').value;
    const description = document.getElementById('service-description').value.trim();
    
    if (!name || !person || !phone) {
        showToast('ಹೆಸರು, ವ್ಯಕ್ತಿ ಮತ್ತು ದೂರವಾಣಿ ಅಗತ್ಯ', 'error');
        return;
    }
    
    const serviceData = {
        name,
        person,
        phone,
        category,
        description,
        timestamp: Date.now()
    };
    
    // Push to real-time system
    const success = await realtimeSystem.pushUpdate('services', serviceData);
    
    if (success) {
        showToast('ಸೇವೆ ಸೇರಿಸಲಾಗಿದೆ! ಎಲ್ಲರಿಗೂ ತೋರಿಸಲಾಗುತ್ತಿದೆ...', 'success');
        
        // Clear form
        document.getElementById('service-name').value = '';
        document.getElementById('service-person').value = '';
        document.getElementById('service-phone').value = '';
        document.getElementById('service-description').value = '';
        
        // Update local storage
        saveToLocalStorage('services', serviceData);
    } else {
        showToast('ಸೇವೆ ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ', 'error');
    }
}

async function adminSaveJob() {
    if (!isAdmin) {
        showToast('ನಿರ್ವಾಹಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ', 'error');
        return;
    }
    
    const title = document.getElementById('job-title').value.trim();
    const salary = document.getElementById('job-salary').value.trim();
    const location = document.getElementById('job-location').value.trim();
    const description = document.getElementById('job-description').value.trim();
    const contact = document.getElementById('job-contact').value.trim();
    
    if (!title || !salary || !contact) {
        showToast('ಹೆಸರು, ಸಂಬಳ ಮತ್ತು ಸಂಪರ್ಕ ಅಗತ್ಯ', 'error');
        return;
    }
    
    const jobData = {
        title,
        salary,
        location,
        description,
        contact,
        timestamp: Date.now()
    };
    
    // Push to real-time system
    const success = await realtimeSystem.pushUpdate('jobs', jobData);
    
    if (success) {
        showToast('ಕೆಲಸ ಸೇರಿಸಲಾಗಿದೆ! ಎಲ್ಲರಿಗೂ ತೋರಿಸಲಾಗುತ್ತಿದೆ...', 'success');
        
        // Clear form
        document.getElementById('job-title').value = '';
        document.getElementById('job-salary').value = '';
        document.getElementById('job-location').value = '';
        document.getElementById('job-description').value = '';
        document.getElementById('job-contact').value = '';
        
        // Update local storage
        saveToLocalStorage('jobs', jobData);
    } else {
        showToast('ಕೆಲಸ ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ', 'error');
    }
}

async function adminSaveEmergency() {
    if (!isAdmin) {
        showToast('ನಿರ್ವಾಹಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ', 'error');
        return;
    }
    
    const name = document.getElementById('emergency-name').value.trim();
    const phone = document.getElementById('emergency-phone').value.trim();
    const description = document.getElementById('emergency-description').value.trim();
    
    if (!name || !phone) {
        showToast('ಹೆಸರು ಮತ್ತು ದೂರವಾಣಿ ಅಗತ್ಯ', 'error');
        return;
    }
    
    const emergencyData = {
        name,
        phone,
        description,
        timestamp: Date.now()
    };
    
    // Push to real-time system
    const success = await realtimeSystem.pushUpdate('emergency', emergencyData);
    
    if (success) {
        showToast('ತುರ್ತು ಸಂಪರ್ಕ ಸೇರಿಸಲಾಗಿದೆ!', 'success');
        
        // Clear form
        document.getElementById('emergency-name').value = '';
        document.getElementById('emergency-phone').value = '';
        document.getElementById('emergency-description').value = '';
        
        // Update local storage
        saveToLocalStorage('emergency', emergencyData);
    } else {
        showToast('ಸಂಪರ್ಕ ಸೇರಿಸಲು ವಿಫಲವಾಗಿದೆ', 'error');
    }
}

// Helper function to add new price to table immediately
function addNewPriceToTable(priceData) {
    const tbody = document.getElementById('prices-table-body');
    if (tbody) {
        const newRow = `
            <tr class="new-update">
                <td><strong>${priceData.crop}</strong></td>
                <td><span class="price-value">${priceData.price}</span></td>
                <td>${priceData.market}</td>
                <td>
                    <span class="trend-${priceData.trend || 'new'}">
                        <i class="fas fa-${getTrendIcon(priceData.trend)}"></i>
                        ${getTrendText(priceData.trend)}
                    </span>
                </td>
                <td>${priceData.date}</td>
            </tr>
        `;
        
        if (tbody.children.length > 0) {
            tbody.insertAdjacentHTML('afterbegin', newRow);
        } else {
            tbody.innerHTML = newRow;
        }
        
        // Remove animation class after 2 seconds
        setTimeout(() => {
            const newRows = tbody.querySelectorAll('.new-update');
            newRows.forEach(row => row.classList.remove('new-update'));
        }, 2000);
    }
}

function getTrendIcon(trend) {
    const icons = {
        'up': 'arrow-up',
        'down': 'arrow-down',
        'stable': 'minus',
        'new': 'star'
    };
    return icons[trend] || 'star';
}

function getTrendText(trend) {
    const texts = {
        'up': 'ಹೆಚ್ಚಳ',
        'down': 'ಕಡಿಮೆ',
        'stable': 'ಸ್ಥಿರ',
        'new': 'ಹೊಸದು'
    };
    return texts[trend] || 'ಹೊಸದು';
}

// Update the showAdminPanel function to use the new system
function showAdminPanel() {
    if (!isAdmin) {
        showAdminLogin();
        return;
    }
    
    document.getElementById('admin-panel-modal').style.display = 'flex';
    adminUpdates.loadAdminPanel();
}

// Helper function to save to local storage
function saveToLocalStorage(collection, data) {
    const key = `veerapura_${collection}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(data);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
}