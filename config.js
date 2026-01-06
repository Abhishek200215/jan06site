// Configuration for Veerapura Village
const CONFIG = {
    // Basic configuration
    ADMIN_CODE: '123456',
    VILLAGE_NAME: 'ವೀರಪುರ',
    DISTRICT: 'ಹಾವೇರಿ',
    STATE: 'ಕರ್ನಾಟಕ',
    
    // Real-time configuration - Using JSONBin.io
    UPDATE_CHECK_INTERVAL: 10000, // Check every 10 seconds
    DATA_URL: 'https://api.jsonbin.io/v3/b/672c7a21ad19ca34f8b8d63e/latest',
    DATA_SAVE_URL: 'https://api.jsonbin.io/v3/b/672c7a21ad19ca34f8b8d63e',
    API_KEY: '$2a$10$4Y3K5r6S7T8U9V0W1X2Y3Z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q',
    
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