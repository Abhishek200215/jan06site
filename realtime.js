// Real-time update system for automatic updates
class RealtimeSystem {
    constructor() {
        this.lastUpdateTime = null;
        this.updateInterval = null;
        this.updateCount = 0;
        this.isConnected = false;
        this.dataVersion = null;
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
            const response = await fetch(CONFIG.DATA_URL, {
                headers: {
                    'X-Master-Key': CONFIG.API_KEY
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const sharedData = data.record;
                
                if (sharedData && sharedData.timestamp) {
                    this.lastUpdateTime = sharedData.timestamp;
                    this.dataVersion = sharedData.version || '1.0';
                    
                    // Update local storage with shared data
                    this.updateLocalData(sharedData);
                    
                    // Update UI
                    this.updateUI(sharedData);
                    
                    console.log('Shared data loaded successfully');
                    return true;
                }
            }
        } catch (error) {
            console.log('Failed to load shared data:', error);
        }
        return false;
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
        try {
            const response = await fetch(CONFIG.DATA_URL + '?t=' + Date.now(), {
                headers: {
                    'X-Master-Key': CONFIG.API_KEY
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const sharedData = data.record;
                
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
            }
        } catch (error) {
            console.log('Update check failed:', error);
            this.isConnected = false;
            this.updateConnectionStatus(false);
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
    
    // Method to push updates to shared storage (for admin)
    async pushUpdate(collection, data) {
        try {
            // First get current data
            const response = await fetch(CONFIG.DATA_URL, {
                headers: {
                    'X-Master-Key': CONFIG.API_KEY
                }
            });
            
            if (response.ok) {
                const currentData = await response.json();
                let sharedData = currentData.record || {};
                
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
                sharedData.timestamp = Date.now();
                sharedData.version = (parseFloat(sharedData.version) || 1.0) + 0.1;
                
                // Save to JSONBin
                const saveResponse = await fetch(CONFIG.DATA_SAVE_URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': CONFIG.API_KEY
                    },
                    body: JSON.stringify(sharedData)
                });
                
                if (saveResponse.ok) {
                    console.log('Update pushed successfully');
                    return true;
                }
            }
        } catch (error) {
            console.error('Push update error:', error);
        }
        return false;
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