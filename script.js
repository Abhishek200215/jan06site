// ====== GLOBAL VARIABLES ======
let currentUser = null;
let isAdmin = false;
let deferredPrompt = null;
let voiceRecognition = null;
let isListening = false;
let currentLanguage = 'kn';

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

async function initializeApp() {
    try {
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
        }, 2000);
        
        // Load user session
        loadUserSession();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup voice recognition
        setupVoiceRecognition();
        
        // Setup PWA
        setupPWA();
        
        // Load initial data
        await loadInitialData();
        
        // Show welcome message
        showToast('ವೀರಪುರ ಗ್ರಾಮಕ್ಕೆ ಸುಸ್ವಾಗತ! 🏘️', 'success');
        
        // Check online status
        checkOnlineStatus();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('ಆರಂಭಿಕಗೊಳಿಸಲು ದೋಷ ಸಂಭವಿಸಿದೆ', 'error');
    }
}

// ====== USER SESSION ======
function loadUserSession() {
    const savedUser = localStorage.getItem('veerapura_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (currentUser.role === 'admin') {
            isAdmin = true;
        }
    }
}

function saveUserSession() {
    if (currentUser) {
        localStorage.setItem('veerapura_user', JSON.stringify(currentUser));
    }
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterServices(category);
            
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Transport tabs
    document.querySelectorAll('.transport-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            showTransportSchedule(type);
            
            document.querySelectorAll('.transport-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Online/offline events
    window.addEventListener('online', () => {
        showToast('ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪುನಃಸ್ಥಾಪಿಸಲಾಗಿದೆ', 'success');
    });
    
    window.addEventListener('offline', () => {
        showToast('ಆಫ್‌ಲೈನ್ ಮೋಡ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ', 'warning');
    });
}

// ====== NAVIGATION ======
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    mobileNav.classList.toggle('show');
}

// ====== LANGUAGE TOGGLE ======
function toggleLanguage() {
    currentLanguage = currentLanguage === 'kn' ? 'en' : 'kn';
    document.getElementById('lang-btn').textContent = currentLanguage === 'kn' ? 'English' : 'ಕನ್ನಡ';
    showToast(`ಭಾಷೆ ${currentLanguage === 'kn' ? 'ಕನ್ನಡ' : 'English'} ಆಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ`, 'info');
}

// ====== ADMIN FUNCTIONS ======
function showAdminLogin() {
    document.getElementById('admin-modal').style.display = 'flex';
}

function closeAdminModal() {
    document.getElementById('admin-modal').style.display = 'none';
}

function showLoginType(type) {
    document.querySelectorAll('.login-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.login-form').forEach(form => form.classList.add('hidden'));
    
    if (type === 'villager') {
        document.querySelector('.login-tab:nth-child(1)').classList.add('active');
        document.getElementById('villager-form').classList.remove('hidden');
    } else {
        document.querySelector('.login-tab:nth-child(2)').classList.add('active');
        document.getElementById('admin-form').classList.remove('hidden');
    }
}

function setVillagerName() {
    const name = document.getElementById('villager-name-input').value.trim();
    if (!name) {
        showToast('ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ', 'error');
        return;
    }
    
    currentUser = {
        name: name,
        role: 'villager',
        village: CONFIG.VILLAGE_NAME
    };
    
    saveUserSession();
    closeAdminModal();
    showToast(`ಸುಸ್ವಾಗತ ${name} ಸರ್!`, 'success');
}

function adminLogin() {
    const code = document.getElementById('admin-code-input').value.trim();
    
    if (code === CONFIG.ADMIN_CODE) {
        currentUser = {
            name: 'ನಿರ್ವಾಹಕ',
            role: 'admin',
            village: CONFIG.VILLAGE_NAME
        };
        
        isAdmin = true;
        saveUserSession();
        closeAdminModal();
        showToast('ನಿರ್ವಾಹಕರಾಗಿ ಪ್ರವೇಶಿಸಲಾಗಿದೆ', 'success');
        showAdminPanel();
    } else {
        showToast('ತಪ್ಪು ಕೋಡ್', 'error');
    }
}

function showAdminPanel() {
    if (!isAdmin) {
        showAdminLogin();
        return;
    }
    
    document.getElementById('admin-panel-modal').style.display = 'flex';
    loadAdminPanel();
}

function closeAdminPanelModal() {
    document.getElementById('admin-panel-modal').style.display = 'none';
}

// ====== DATA MANAGEMENT ======
async function loadInitialData() {
    try {
        await loadPrices();
        await loadServices();
        await loadLocalContacts();
        await loadJobs();
    } catch (error) {
        console.error('Data load error:', error);
        showToast('ಮಾಹಿತಿ ಲೋಡ್ ಮಾಡಲು ವಿಫಲ', 'error');
    }
}

async function loadPrices() {
    try {
        const prices = getFromLocalStorage('prices');
        const tbody = document.getElementById('prices-table-body');
        
        if (!tbody) return;
        
        if (prices.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        <p>ಇನ್ನೂ ಬೆಲೆಗಳು ಸೇರಿಸಲಾಗಿಲ್ಲ</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        prices.slice(0, 10).forEach(price => {
            html += `
                <tr>
                    <td><strong>${price.crop}</strong></td>
                    <td><span class="price-value">${price.price}</span></td>
                    <td>${price.market}</td>
                    <td>
                        <span class="trend-up">
                            <i class="fas fa-arrow-up"></i> ಹೆಚ್ಚಳ
                        </span>
                    </td>
                    <td>${price.date}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
    } catch (error) {
        console.error('Load prices error:', error);
    }
}

async function loadServices() {
    try {
        const services = getFromLocalStorage('services');
        const container = document.getElementById('services-grid');
        
        if (!container) return;
        
        if (services.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 40px;">
                    <i class="fas fa-tools" style="font-size: 3rem; color: var(--gray); margin-bottom: 20px;"></i>
                    <p>ಇನ್ನೂ ಸೇವೆಗಳು ಸೇರಿಸಲಾಗಿಲ್ಲ</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        services.forEach(service => {
            html += `
                <div class="service-card" data-category="${service.category || 'other'}">
                    <div class="service-header">
                        <h4>${service.name}</h4>
                        <span class="service-category">${getCategoryName(service.category)}</span>
                    </div>
                    <div class="service-body">
                        <p><i class="fas fa-user"></i> ${service.person}</p>
                        <p><i class="fas fa-phone"></i> ${service.phone}</p>
                        ${service.description ? `<p>${service.description}</p>` : ''}
                    </div>
                    <div class="service-actions">
                        <button class="btn btn-outline" onclick="callNumber('${service.phone}')">
                            <i class="fas fa-phone"></i> ಕರೆ
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Load services error:', error);
    }
}

async function loadLocalContacts() {
    try {
        const contacts = getFromLocalStorage('emergency');
        const container = document.getElementById('local-contacts');
        
        if (!container) return;
        
        if (contacts.length === 0) {
            const defaultContacts = [
                { name: 'ಗ್ರಾಮ ಸೇವಕ', phone: '9480012345', description: 'ಗ್ರಾಮ ಕಚೇರಿ' },
                { name: 'ಪಂಚಾಯತ್ ಅಧ್ಯಕ್ಷ', phone: '9448012345', description: 'ಗ್ರಾಮ ಪಂಚಾಯತ್' },
                { name: 'ಕೃಷಿ ಅಧಿಕಾರಿ', phone: '9481123456', description: 'ಕೃಷಿ ಕಚೇರಿ' },
                { name: 'ವಿದ್ಯುತ್ ದೂರವಾಣಿ', phone: '1912', description: 'ವಿದ್ಯುತ್ ದೂರವಾಣಿ' }
            ];
            
            let html = '';
            defaultContacts.forEach(contact => {
                html += `
                    <div class="local-contact">
                        <h5>${contact.name}</h5>
                        <p>${contact.description}</p>
                        <div class="contact-number">${contact.phone}</div>
                        <div class="contact-actions">
                            <button class="btn btn-outline" onclick="callNumber('${contact.phone}')">
                                <i class="fas fa-phone"></i> ಕರೆ
                            </button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
            return;
        }
        
    } catch (error) {
        console.error('Load local contacts error:', error);
    }
}

async function loadJobs() {
    try {
        const jobs = getFromLocalStorage('jobs');
        const container = document.getElementById('jobs-list');
        
        if (!container) return;
        
        if (jobs.length === 0) {
            const defaultJobs = [
                { title: 'ದಿನಗೂಲಿ ಕೆಲಸ', salary: '₹500/ದಿನ', location: 'ಗ್ರಾಮದಲ್ಲಿ', description: 'ನಿರ್ಮಾಣ ಕೆಲಸ', contact: '9880012345' },
                { title: 'ಕೃಷಿ ಸಹಾಯಕ', salary: '₹400/ದಿನ', location: 'ಕೃಷಿ ಭೂಮಿ', description: 'ಬೆಳೆ ಕಾಯುವಿಕೆ', contact: '9880012346' },
                { title: 'ಚಾಕರಿ', salary: '₹10,000/ತಿಂಗಳು', location: 'ಹತ್ತಿರದ ಪಟ್ಟಣ', description: 'ಕಾರ್ಖಾನೆ ಕೆಲಸ', contact: '9880012347' }
            ];
            
            let html = '';
            defaultJobs.forEach(job => {
                html += `
                    <div class="job-item">
                        <div class="job-header">
                            <h4>${job.title}</h4>
                            <span class="job-salary">${job.salary}</span>
                        </div>
                        <div class="job-body">
                            <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                            <p>${job.description}</p>
                            <p><i class="fas fa-phone"></i> ${job.contact}</p>
                        </div>
                        <div class="job-actions">
                            <button class="btn btn-primary" onclick="callNumber('${job.contact}')">
                                <i class="fas fa-phone"></i> ಸಂಪರ್ಕಿಸಿ
                            </button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
            return;
        }
        
    } catch (error) {
        console.error('Load jobs error:', error);
    }
}

// ====== UTILITY FUNCTIONS ======
function getCategoryName(category) {
    const categories = {
        'electrician': 'ವಿದ್ಯುತ್',
        'plumber': 'ಪ್ಲಂಬಿಂಗ್',
        'transport': 'ಸಾರಿಗೆ',
        'agriculture': 'ಕೃಷಿ',
        'other': 'ಇತರೆ'
    };
    return categories[category] || 'ಇತರೆ';
}

function filterServices(category) {
    const services = document.querySelectorAll('.service-card');
    services.forEach(service => {
        if (category === 'all' || service.getAttribute('data-category') === category) {
            service.style.display = 'block';
        } else {
            service.style.display = 'none';
        }
    });
}

function showTransportSchedule(type) {
    // Implementation for transport schedule
}

function filterPrices() {
    showToast('ಬೆಲೆಗಳು ಫಿಲ್ಟರ್ ಮಾಡಲಾಗುತ್ತಿದೆ', 'info');
}

function showMorePrices() {
    showToast('ಹೆಚ್ಚಿನ ಬೆಲೆಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ', 'info');
}

function showSchemeDetails(schemeId) {
    const schemes = {
        'pmkisan': 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್: ರೈತರಿಗೆ ವಾರ್ಷಿಕ ₹6000 ಸಹಾಯಧನ',
        'scholarship': 'ವಿದ್ಯಾರ್ಥಿ ವೇತನ: 10ನೇ ತರಗತಿ ಉತ್ತೀರ್ಣರಿಗೆ ₹5000',
        'womenshaki': 'ಮಹಿಳಾ ಶಕ್ತಿ: ಸ್ವಯಂ ಸಹಾಯಕ ಗುಂಪುಗಳಿಗೆ ₹1 ಲಕ್ಷದವರೆಗೆ ಸಾಲ',
        'ruralhouse': 'ಗ್ರಾಮೀಣ ಮನೆ: ಬಡವರಿಗೆ ಮನೆ ನಿರ್ಮಾಣಕ್ಕೆ ₹1.2 ಲಕ್ಷ ಸಹಾಯಧನ'
    };
    
    alert(schemes[schemeId] || 'ಯೋಜನೆ ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ');
}

// ====== EMERGENCY FUNCTIONS ======
function callEmergency(number) {
    if (confirm(`${number} ಗೆ ಕರೆ ಮಾಡಲು ಬಯಸುವಿರಾ?`)) {
        window.location.href = `tel:${number}`;
    }
}

function callNumber(number) {
    window.location.href = `tel:${number}`;
}

function whatsappEmergency(number) {
    window.open(`https://wa.me/91${number}`, '_blank');
}

// ====== LOCAL STORAGE FUNCTIONS ======
function saveToLocalStorage(collection, data) {
    const key = `veerapura_${collection}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(data);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
}

function getFromLocalStorage(collection) {
    const key = `veerapura_${collection}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

// ====== VOICE FUNCTIONS ======
function setupVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        voiceRecognition = new webkitSpeechRecognition();
        voiceRecognition.lang = 'kn-IN';
        voiceRecognition.continuous = false;
        voiceRecognition.interimResults = false;
    }
}

function startVoiceSearch() {
    showVoiceModal();
}

function showVoiceModal() {
    document.getElementById('voice-modal').style.display = 'flex';
}

function closeVoiceModal() {
    document.getElementById('voice-modal').style.display = 'none';
    if (isListening) {
        voiceRecognition.stop();
    }
}

// ====== TOAST NOTIFICATIONS ======
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ====== PWA FUNCTIONS ======
function setupPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.getElementById('install-app-btn');
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
            installBtn.onclick = installApp;
        }
    });
    
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        showToast('ಅಪ್ಲಿಕೇಶನ್ ಸ್ಥಾಪಿಸಲಾಗಿದೆ!', 'success');
        const installBtn = document.getElementById('install-app-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted install');
            }
            deferredPrompt = null;
        });
    } else {
        showToast('ಅಪ್ಲಿಕೇಶನ್ ಈಗಾಗಲೇ ಸ್ಥಾಪಿಸಲಾಗಿದೆ', 'info');
    }
}

function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'ವೀರಪುರ ಗ್ರಾಮ ಅಪ್ಲಿಕೇಶನ್',
            text: 'ನಮ್ಮ ಹಳ್ಳಿಯ ಡಿಜಿಟಲ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showToast('ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ', 'success');
            })
            .catch(() => {
                prompt('ಲಿಂಕ್ ನಕಲಿಸಿ:', window.location.href);
            });
    }
}

// ====== UTILITY FUNCTIONS ======
function checkOnlineStatus() {
    if (!navigator.onLine) {
        showToast('ಆಫ್‌ಲೈನ್ ಮೋಡ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ', 'warning');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function closeAnnouncement() {
    document.querySelector('.announcement-bar').style.display = 'none';
}

// ====== DEFAULT DATA ======
function setupDefaultData() {
    if (localStorage.getItem('veerapura_default_set')) {
        return;
    }
    
    // Default prices
    const defaultPrices = [
        {
            crop: 'ಭತ್ತ',
            price: '₹2,800',
            market: 'ಹಾವೇರಿ ಮಾರುಕಟ್ಟೆ',
            date: new Date().toLocaleDateString('kn-IN'),
            type: 'price'
        },
        {
            crop: 'ಕಬ್ಬು',
            price: '₹3,200',
            market: 'ಹಿರೇಕೇರೂರು ಮಾರುಕಟ್ಟೆ',
            date: new Date().toLocaleDateString('kn-IN'),
            type: 'price'
        }
    ];
    
    defaultPrices.forEach(price => {
        saveToLocalStorage('prices', price);
    });
    
    // Default services
    const defaultServices = [
        {
            name: 'ವಿದ್ಯುತ್ ಕೆಲಸಗಾರ',
            person: 'ರಾಮು',
            phone: '9880123456',
            category: 'electrician',
            description: 'ಎಲ್ಲಾ ರೀತಿಯ ವಿದ್ಯುತ್ ದುರಸ್ತಿ ಕೆಲಸ'
        },
        {
            name: 'ಪ್ಲಂಬರ್',
            person: 'ಶಂಕರ್',
            phone: '9845012345',
            category: 'plumber',
            description: 'ನೀರು ಸರಬರಾಜು ಮತ್ತು ದುರಸ್ತಿ'
        }
    ];
    
    defaultServices.forEach(service => {
        saveToLocalStorage('services', service);
    });
    
    localStorage.setItem('veerapura_default_set', 'true');
}

setupDefaultData();