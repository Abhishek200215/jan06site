const CONFIG = {
    // Basic configuration
    ADMIN_CODE: '123456',
    VILLAGE_NAME: 'ವೀರಪುರ',
    DISTRICT: 'ಹಾವೇರಿ',
    STATE: 'ಕರ್ನಾಟಕ',
    
    // Real-time configuration - Using GitHub Gist
    UPDATE_CHECK_INTERVAL: 10000,
    GIST_ID: 'b7750693ecabb3a1a5a6715fcf724291',
    GIST_FILENAME: 'veerapura-data.json',
    
    // WARNING: Do NOT put GitHub token here in client-side code!
    // It will be visible to everyone. Use a server instead.
    GITHUB_TOKEN: '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', // Leave this empty for now
    
    // Voice commands
    VOICE_COMMANDS: {
        'ಬೆಲೆ': 'market',
        'ಬೆಲೆಗಳು': 'market',
        'ಕೃಷಿ': 'market',
        'ತುರ್ತು': 'emergency',
        'ಆಂಬ್ಯುಲೆನ್ಸ್': 'emergency',
        'ಪೊಲೀಸ್': 'emergency',
        'ಹವಾಮಾನ': 'weather',
        'ಮಳೆ': 'weather',
        'ಕೆಲಸ': 'jobs',
        'ಉದ್ಯೋಗ': 'jobs',
        'ಸೇವೆ': 'services',
        'ವಿದ್ಯುತ್': 'services',
        'ಪ್ಲಂಬರ್': 'services'
    }
};

// GitHub Gist API URLs
CONFIG.GIST_API_URL = `https://api.github.com/gists/${CONFIG.GIST_ID}`;
CONFIG.GIST_RAW_URL = `https://gist.githubusercontent.com/abhishek200215/${CONFIG.GIST_ID}/raw/${CONFIG.GIST_FILENAME}`;

// Make globally available
window.CONFIG = CONFIG;
