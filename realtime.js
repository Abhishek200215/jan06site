// Real-time update system using GitHub Gist
class RealtimeSystem {
    constructor() {
        this.lastUpdateTime = null;
        this.updateInterval = null;
        this.updateCount = 0;
        this.isConnected = false;
        this.dataVersion = null;
        this.retryCount = 0;
        this.maxRetries = 3;
    }
    
    async init() {
        console.log('🚀 Initializing real-time system...');
        
        // Start live indicator
        this.startLiveIndicator();
        
        // Load initial data
        await this.loadSharedData();
        
        // Start checking for updates
        this.startUpdateChecking();
        
        // Setup connection monitoring
        this.setupConnectionMonitoring();
        
        return this;
    }
    
    async loadSharedData() {
        try {
            // Try to load from Gist
            const response = await fetch(CONFIG.GIST_RAW_URL + '?t=' + Date.now());
            
            if (response.ok) {
                const sharedData = await response.json();
                
                if (sharedData && sharedData.timestamp) {
                    this.lastUpdateTime = sharedData.timestamp;
                    this.dataVersion = sharedData.version || '1.0';
                    
                    // Update local storage with shared data
                    this.updateLocalData(sharedData);
                    
                    // Update UI
                    this.updateUI(sharedData);
                    
                    console.log('✅ Shared data loaded successfully from Gist');
                    this.retryCount = 0;
                    return true;
                }
            }
        } catch (error) {
            console.log('⚠️ Failed to load shared data from Gist:', error);
            
            // Load from local storage as fallback
            return this.loadFromLocalStorage();
        }
        return false;
    }
    
    loadFromLocalStorage() {
        try {
            const localData = {
                announcements: JSON.parse(localStorage.getItem('veerapura_announcements') || '[]'),
                prices: JSON.parse(localStorage.getItem('veerapura_prices') || '[]'),
                services: JSON.parse(localStorage.getItem('veerapura_services') || '[]'),
                jobs: JSON.parse(localStorage.getItem('veerapura_jobs') || '[]'),
                emergency: JSON.parse(localStorage.getItem('veerapura_emergency') || '[]')
            };
            
            this.updateUI(localData);
            console.log('📂 Loaded data from local storage');
            return true;
        } catch (error) {
            console.error('Failed to load from local storage:', error);
            return false;
        }
    }
    
    startUpdateChecking() {
        // Check for updates every 10 seconds
        this.updateInterval = setInterval(async () => {
            await this.checkForUpdates();
        }, CONFIG.UPDATE_CHECK_INTERVAL);
        
        // Also check when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkForUpdates();
            }
        });
        
        // Check immediately
        this.checkForUpdates();
    }
    
    async checkForUpdates() {
        if (this.retryCount >= this.maxRetries) {
            console.log('Max retries reached, pausing updates');
            return;
        }
        
        try {
            const response = await fetch(CONFIG.GIST_RAW_URL + '?t=' + Date.now());
            
            if (response.ok) {
                const sharedData = await response.json();
                
                if (sharedData && sharedData.timestamp) {
                    if (this.lastUpdateTime !== sharedData.timestamp) {
                        console.log('🆕 New update detected!');
                        this.lastUpdateTime = sharedData.timestamp;
                        this.dataVersion = sharedData.version;
                        
                        // Update local storage
                        this.updateLocalData(sharedData);
                        
                        // Update UI
                        this.updateUI(sharedData);
                        
                        // Show notification
                        this.showUpdateNotification();
                        
                        // Increment update count
                        this.updateCount++;
                        this.updateLiveIndicator();
                    }
                }
                
                this.isConnected = true;
                this.updateConnectionStatus(true);
                this.retryCount = 0;
            } else {
                throw new Error('Failed to fetch');
            }
        } catch (error) {
            console.log('Update check failed:', error);
            this.isConnected = false;
            this.updateConnectionStatus(false);
            this.retryCount++;
        }
    }
    
    updateLocalData(sharedData) {
        // Update each collection in local storage
        const collections = ['announcements', 'prices', 'services', 'jobs', 'emergency'];
        
        collections.forEach(collection => {
            if (sharedData[collection] && Array.isArray(sharedData[collection])) {
                localStorage.setItem(`veerapura_${collection}`, JSON.stringify(sharedData[collection]));
            }
        });
    }
    
    updateUI(sharedData) {
        // Update announcement
        if (sharedData.announcements && sharedData.announcements.length > 0) {
            const latestAnnouncement = sharedData.announcements[0];
            const announcementText = document.getElementById('announcement-text');
            if (announcementText && latestAnnouncement.text) {
                announcementText.textContent = latestAnnouncement.text;
            }
        }
        
        // Update prices table
        if (sharedData.prices && sharedData.prices.length > 0) {
            this.updatePricesTable(sharedData.prices);
        }
        
        // Update services grid
        if (sharedData.services && sharedData.services.length > 0) {
            this.updateServicesGrid(sharedData.services);
        }
        
        // Update jobs list
        if (sharedData.jobs && sharedData.jobs.length > 0) {
            this.updateJobsList(sharedData.jobs);
        }
    }
    
    updatePricesTable(prices) {
        const tbody = document.getElementById('prices-table-body');
        if (!tbody) return;
        
        let html = '';
        prices.slice(0, 10).forEach(price => {
            html += `
                <tr class="new-update">
                    <td><strong>${price.crop}</strong></td>
                    <td><span class="price-value">${price.price}</span></td>
                    <td>${price.market}</td>
                    <td>
                        <span class="trend-${price.trend || 'new'}">
                            <i class="fas fa-${this.getTrendIcon(price.trend)}"></i>
                            ${this.getTrendText(price.trend)}
                        </span>
                    </td>
                    <td>${price.date}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            const rows = tbody.querySelectorAll('.new-update');
            rows.forEach(row => row.classList.remove('new-update'));
        }, 2000);
    }
    
    updateServicesGrid(services) {
        const container = document.getElementById('services-grid');
        if (!container) return;
        
        let html = '';
        services.forEach(service => {
            html += `
                <div class="service-card" data-category="${service.category || 'other'}">
                    <div class="service-header">
                        <h4>${service.name}</h4>
                        <span class="service-category">${this.getCategoryName(service.category)}</span>
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
    }
    
    updateJobsList(jobs) {
        const container = document.getElementById('jobs-list');
        if (!container) return;
        
        let html = '';
        jobs.forEach(job => {
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
    }
    
    getTrendIcon(trend) {
        const icons = {
            'up': 'arrow-up',
            'down': 'arrow-down',
            'stable': 'minus',
            'new': 'star'
        };
        return icons[trend] || 'star';
    }
    
    getTrendText(trend) {
        const texts = {
            'up': 'ಹೆಚ್ಚಳ',
            'down': 'ಕಡಿಮೆ',
            'stable': 'ಸ್ಥಿರ',
            'new': 'ಹೊಸದು'
        };
        return texts[trend] || 'ಹೊಸದು';
    }
    
    getCategoryName(category) {
        const categories = {
            'electrician': 'ವಿದ್ಯುತ್',
            'plumber': 'ಪ್ಲಂಬಿಂಗ್',
            'transport': 'ಸಾರಿಗೆ',
            'agriculture': 'ಕೃಷಿ',
            'other': 'ಇತರೆ'
        };
        return categories[category] || 'ಇತರೆ';
    }
    
    showUpdateNotification() {
        // Check if notification already exists
        if (document.querySelector('.realtime-notification')) {
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = 'realtime-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-sync-alt spinning"></i>
                <span>ಹೊಸ ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ!</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    startLiveIndicator() {
        const indicator = document.getElementById('live-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
    }
    
    updateLiveIndicator() {
        const countElement = document.getElementById('update-count');
        if (countElement) {
            countElement.textContent = this.updateCount;
        }
    }
    
    updateConnectionStatus(connected) {
        const indicator = document.getElementById('live-indicator');
        if (indicator) {
            if (connected) {
                indicator.classList.remove('disconnected');
                indicator.classList.add('connected');
            } else {
                indicator.classList.remove('connected');
                indicator.classList.add('disconnected');
            }
        }
    }
    
    setupConnectionMonitoring() {
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
            this.showToast('ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪುನಃಸ್ಥಾಪಿಸಲಾಗಿದೆ', 'success');
            this.checkForUpdates();
        });
        
        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
            this.showToast('ಆಫ್‌ಲೈನ್ ಮೋಡ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ', 'warning');
        });
    }
    
    showToast(message, type) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast toast-${type}`;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
    
    // Method to push updates to GitHub Gist (for admin)
    async pushUpdate(collection, data) {
        try {
            // First get current data from Gist
            let sharedData;
            try {
                const response = await fetch(CONFIG.GIST_RAW_URL);
                if (response.ok) {
                    sharedData = await response.json();
                } else {
                    // Create new data structure if Gist doesn't exist
                    sharedData = {
                        timestamp: new Date().toISOString(),
                        version: "1.0",
                        announcements: [],
                        prices: [],
                        services: [],
                        jobs: [],
                        emergency: []
                    };
                }
            } catch (error) {
                // Create new data structure
                sharedData = {
                    timestamp: new Date().toISOString(),
                    version: "1.0",
                    announcements: [],
                    prices: [],
                    services: [],
                    jobs: [],
                    emergency: []
                };
            }
            
            // Initialize collection if not exists
            if (!sharedData[collection]) {
                sharedData[collection] = [];
            }
            
            // Add timestamp and ID to data
            data.timestamp = Date.now();
            data.id = Date.now();
            
            // Add to collection
            sharedData[collection].unshift(data);
            
            // Keep only last 20 items
            sharedData[collection] = sharedData[collection].slice(0, 20);
            
            // Update timestamp and version
            sharedData.timestamp = new Date().toISOString();
            sharedData.version = (parseFloat(sharedData.version) || 1.0) + 0.1;
            
            // Save to GitHub Gist
            const saveResponse = await fetch(CONFIG.GIST_API_URL, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'Veerapura Village Data - Updated ' + new Date().toLocaleString(),
                    files: {
                        [CONFIG.GIST_FILENAME]: {
                            content: JSON.stringify(sharedData, null, 2)
                        }
                    }
                })
            });
            
            if (saveResponse.ok) {
                console.log('✅ Update pushed successfully to Gist');
                return true;
            } else {
                const errorData = await saveResponse.json();
                console.error('Gist update failed:', errorData);
                
                // Fallback: Save to local storage
                this.saveToLocalFallback(collection, data);
                return false;
            }
        } catch (error) {
            console.error('Push update error:', error);
            
            // Fallback: Save to local storage
            this.saveToLocalFallback(collection, data);
            return false;
        }
    }
    
    saveToLocalFallback(collection, data) {
        // Save to local storage
        const key = `veerapura_${collection}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(data);
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
        
        // Update UI immediately
        this.updateUIImmediately(collection, data);
        
        console.log('📂 Saved to local storage (fallback)');
        return true;
    }
    
    updateUIImmediately(collection, data) {
        switch(collection) {
            case 'announcements':
                const annEl = document.getElementById('announcement-text');
                if (annEl && data.text) {
                    annEl.textContent = data.text;
                }
                break;
            case 'prices':
                this.addNewPriceToTable(data);
                break;
        }
    }
    
    addNewPriceToTable(priceData) {
        const tbody = document.getElementById('prices-table-body');
        if (tbody) {
            const newRow = `
                <tr class="new-update">
                    <td><strong>${priceData.crop}</strong></td>
                    <td><span class="price-value">${priceData.price}</span></td>
                    <td>${priceData.market}</td>
                    <td>
                        <span class="trend-${priceData.trend || 'new'}">
                            <i class="fas fa-${this.getTrendIcon(priceData.trend)}"></i>
                            ${this.getTrendText(priceData.trend)}
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
        }
    }
}

// Create and initialize realtime system
const realtimeSystem = new RealtimeSystem();

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        realtimeSystem.init();
    });
} else {
    realtimeSystem.init();
}

// Make globally available
window.realtimeSystem = realtimeSystem;
