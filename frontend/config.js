// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:4000/api',
    // Change this to your backend URL if different
    // BASE_URL: 'https://your-backend-url.com/api',
};

// Storage keys
const STORAGE_KEYS = {
    TOKEN: 'civic_events_token',
    USER: 'civic_events_user',
    PERSISTENT: 'civic_events_persistent', // 'true' if using localStorage, 'false' for sessionStorage
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, STORAGE_KEYS };
}

