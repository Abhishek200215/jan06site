// Local storage real-time system (NO external API needed)
class LocalRealtime {
    constructor() {
        console.log('🏘️ Veerapura Local Realtime System Started');
        this.init();
    }
    
    init() {
        // Load initial data
        this.loadData();
        
        // Listen for updates from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('vp_update_')) {
                console.log('🔄 Update from another tab/browser');
                this.loadData();
                this.showNotification('ಹೊಸ ಮಾಹಿತಿ ಬಂದಿದೆ!');
            }
        });
        
        // Check for updates every 5 seconds
        setInterval(() => this.checkForUpdates(), 5000);
        
        // Initial check
        this.checkForUpdates();
    }
    
    loadData() {
        console.log('📂 Loading data from localStorage...');
        
        // Try to load from localStorage
        const data = this.getLocalData();
        
        // Update UI
        this.updateUI(data);
        
        return data;
    }
    
    getLocalData() {
        return {
            announcements: JSON.parse(localStorage.getItem('vp_announcements') || '[]'),
            prices: JSON.parse(localStorage.getItem('vp_prices') || '[]'),
            services: JSON.parse(localStorage.getItem('vp_services') || '[]'),
            jobs: JSON.parse(localStorage.getItem('vp_jobs') || '[]'),
            emergency: JSON.parse(localStorage.getItem('vp_emergency') || '[]')
        };
    }
    
    updateUI(data) {
        // Update announcement bar
        if (data.announcements.length > 0) {
            const latest = data.announcements[0];
            const el = document.getElementById('announcement-text');
            if (el && latest.text) {
                el.textContent = latest.text;
            }
        }
        
        // Update prices table
        if (data.prices.length > 0) {
            this.updatePricesTable(data.prices);
        }
        
        // Update services
        if (data.services.length > 0) {
            this.updateServices(data.services);
        }
        
        // Update jobs
        if (data.jobs.length > 0) {
            this.updateJobs(data.jobs);
        }
    }
    
    updatePricesTable(prices) {
        const tbody = document.getElementById('prices-table-body');
        if (!tbody) return;
        
        let html = '';
        prices.slice(0, 10).forEach(price => {
            html += `
                <tr>
                    <td><strong>${price.crop}</strong></td>
                    <td>${price.price}</td>
                    <td>${price.market}</td>
                    <td>${this.getTrendBadge(price.trend)}</td>
                    <td>${price.date}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }
    
    getTrendBadge(trend) {
        const badges = {
            'up': '<span style="color: green;">⬆️ ಹೆಚ್ಚಳ</span>',
            'down': '<span style="color: red;">⬇️ ಕಡಿಮೆ</span>',
            'stable': '<span style="color: blue;">➖ ಸ್ಥಿರ</span>',
            'new': '<span style="color: orange;">🌟 ಹೊಸದು</span>'
        };
        return badges[trend] || '<span>➖ ಸ್ಥಿರ</span>';
    }
    
    updateServices(services) {
        const container = document.getElementById('services-grid');
        if (!container) return;
        
        let html = '';
        services.forEach(service => {
            html += `
                <div class="service-card">
                    <h4>${service.name}</h4>
                    <p><i class="fas fa-user"></i> ${service.person}</p>
                    <p><i class="fas fa-phone"></i> ${service.phone}</p>
                    ${service.description ? `<p>${service.description}</p>` : ''}
                    <button onclick="callNumber('${service.phone}')" style="margin-top: 10px;">
                        <i class="fas fa-phone"></i> ಕರೆ ಮಾಡಿ
                    </button>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    updateJobs(jobs) {
        const container = document.getElementById('jobs-list');
        if (!container) return;
        
        let html = '';
        jobs.forEach(job => {
            html += `
                <div class="job-item">
                    <h4>${job.title}</h4>
                    <p><strong>ಸಂಬಳ:</strong> ${job.salary}</p>
                    <p><strong>ಸ್ಥಳ:</strong> ${job.location}</p>
                    <p>${job.description}</p>
                    <p><i class="fas fa-phone"></i> ${job.contact}</p>
                    <button onclick="callNumber('${job.contact}')">
                        <i class="fas fa-phone"></i> ಸಂಪರ್ಕಿಸಿ
                    </button>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-bell"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; margin-left: 10px;">
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
    
    checkForUpdates() {
        // For now, just update timestamp
        localStorage.setItem('vp_last_check', Date.now());
    }
    
    // ADMIN FUNCTIONS
    saveAnnouncement(title, text) {
        const announcement = {
            title,
            text,
            date: new Date().toLocaleDateString('kn-IN'),
            author: 'ನಿರ್ವಾಹಕ',
            timestamp: Date.now()
        };
        
        const existing = JSON.parse(localStorage.getItem('vp_announcements') || '[]');
        existing.unshift(announcement);
        localStorage.setItem('vp_announcements', JSON.stringify(existing.slice(0, 50)));
        
        // Update UI immediately
        const el = document.getElementById('announcement-text');
        if (el) el.textContent = text;
        
        // Notify other tabs
        localStorage.setItem('vp_update_announcements', Date.now());
        
        this.showNotification('ಘೋಷಣೆ ಸೇರಿಸಲಾಗಿದೆ!');
        return true;
    }
    
    savePrice(crop, price, market, trend) {
        const priceData = {
            crop,
            price,
            market: market || 'ಹಾವೇರಿ ಮಾರುಕಟ್ಟೆ',
            trend: trend || 'stable',
            date: new Date().toLocaleDateString('kn-IN'),
            timestamp: Date.now()
        };
        
        const existing = JSON.parse(localStorage.getItem('vp_prices') || '[]');
        existing.unshift(priceData);
        localStorage.setItem('vp_prices', JSON.stringify(existing.slice(0, 50)));
        
        // Notify other tabs
        localStorage.setItem('vp_update_prices', Date.now());
        
        this.showNotification('ಬೆಲೆ ಸೇರಿಸಲಾಗಿದೆ!');
        return true;
    }
    
    saveService(name, person, phone, category, description) {
        const serviceData = {
            name,
            person,
            phone,
            category: category || 'other',
            description,
            timestamp: Date.now()
        };
        
        const existing = JSON.parse(localStorage.getItem('vp_services') || '[]');
        existing.unshift(serviceData);
        localStorage.setItem('vp_services', JSON.stringify(existing.slice(0, 50)));
        
        // Notify other tabs
        localStorage.setItem('vp_update_services', Date.now());
        
        this.showNotification('ಸೇವೆ ಸೇರಿಸಲಾಗಿದೆ!');
        return true;
    }
}

// Initialize
const localRealtime = new LocalRealtime();
window.localRealtime = localRealtime;

// Make helper functions globally available
window.saveAnnouncement = function(title, text) {
    return localRealtime.saveAnnouncement(title, text);
};

window.savePrice = function(crop, price, market, trend) {
    return localRealtime.savePrice(crop, price, market, trend);
};

window.saveService = function(name, person, phone, category, description) {
    return localRealtime.saveService(name, person, phone, category, description);
};
