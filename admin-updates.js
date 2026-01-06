// Admin save functions with automatic real-time updates
function adminSaveAnnouncement() {
    const title = document.getElementById('announcement-title').value.trim();
    const text = document.getElementById('announcement-text').value.trim();
    
    if (!title || !text) {
        alert('ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಣೆ ಅಗತ್ಯ');
        return;
    }
    
    localRealtime.saveAnnouncement(title, text);
    
    // Clear form
    document.getElementById('announcement-title').value = '';
    document.getElementById('announcement-text').value = '';
}

function adminSavePrice() {
    const crop = document.getElementById('price-crop').value.trim();
    const price = document.getElementById('price-amount').value.trim();
    const market = document.getElementById('price-market').value.trim();
    const trend = document.getElementById('price-trend').value;
    
    if (!crop || !price) {
        alert('ಬೆಳೆ ಮತ್ತು ಬೆಲೆ ಅಗತ್ಯ');
        return;
    }
    
    localRealtime.savePrice(crop, price, market, trend);
    
    // Clear form
    document.getElementById('price-crop').value = '';
    document.getElementById('price-amount').value = '';
    document.getElementById('price-market').value = '';
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
    
    // Show saving message
    showToast('ಉಳಿಸಲಾಗುತ್ತಿದೆ...', 'info');
    
    // Push to real-time system
    const success = await realtimeSystem.pushUpdate('prices', priceData);
    
    if (success) {
        showToast('ಬೆಲೆ ಸೇರಿಸಲಾಗಿದೆ! ಎಲ್ಲರಿಗೂ ತೋರಿಸಲಾಗುತ್ತಿದೆ...', 'success');
        
        // Clear form
        document.getElementById('price-crop').value = '';
        document.getElementById('price-amount').value = '';
        document.getElementById('price-market').value = '';
    } else {
        showToast('ಬೆಲೆ ಸೇರಿಸಲಾಗಿದೆ (ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಲಾಗಿದೆ)', 'warning');
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
    
    // Show saving message
    showToast('ಉಳಿಸಲಾಗುತ್ತಿದೆ...', 'info');
    
    // Push to real-time system
    const success = await realtimeSystem.pushUpdate('services', serviceData);
    
    if (success) {
        showToast('ಸೇವೆ ಸೇರಿಸಲಾಗಿದೆ! ಎಲ್ಲರಿಗೂ ತೋರಿಸಲಾಗುತ್ತಿದೆ...', 'success');
        
        // Clear form
        document.getElementById('service-name').value = '';
        document.getElementById('service-person').value = '';
        document.getElementById('service-phone').value = '';
        document.getElementById('service-description').value = '';
    } else {
        showToast('ಸೇವೆ ಸೇರಿಸಲಾಗಿದೆ (ಸ್ಥಳೀಯವಾಗಿ ಉಳಿಸಲಾಗಿದೆ)', 'warning');
    }
}
