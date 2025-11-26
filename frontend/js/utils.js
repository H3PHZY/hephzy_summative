// Utility functions for the application

/**
 * Get the storage object (localStorage or sessionStorage) based on user preference
 */
function getStorage() {
    const isPersistent = localStorage.getItem(STORAGE_KEYS.PERSISTENT) === 'true';
    return isPersistent ? localStorage : sessionStorage;
}

/**
 * Save authentication token and user data
 */
function saveAuth(token, user, persistent = false) {
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.TOKEN, token);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.PERSISTENT, persistent.toString());
}

/**
 * Get authentication token
 */
function getToken() {
    const storage = getStorage();
    return storage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Get current user data
 */
function getCurrentUser() {
    const storage = getStorage();
    const userStr = storage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getToken();
}

/**
 * Check if user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

/**
 * Clear authentication data
 */
function clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PERSISTENT);
}

/**
 * Make API request with authentication
 */
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge headers properly
    const headers = {
        ...defaultOptions.headers,
        ...(options.headers || {}),
    };

    // Remove Content-Type for FormData (browser will set it with boundary)
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const config = {
        ...defaultOptions,
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        
        // Try to parse JSON, but handle cases where response might not be JSON
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            try {
                data = await response.json();
            } catch (parseError) {
                console.error('Failed to parse JSON response:', parseError);
                throw new Error('Invalid response from server');
            }
        } else {
            const text = await response.text();
            throw new Error(text || `HTTP error! status: ${response.status}`);
        }

        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
            clearAuth();
            if (window.location.pathname !== '/login.html' && window.location.pathname !== '/signup.html') {
                showToast('Your session has expired. Please login again.', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
            throw new Error('Unauthorized');
        }

        // Handle 403 Forbidden
        if (response.status === 403) {
            showToast('You do not have permission to perform this action.', 'error');
            throw new Error('Forbidden');
        }

        // Handle validation errors (400 status with errors array)
        if (response.status === 400 && data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map(err => err.message || `${err.field}: ${err.message}`).join(', ');
            throw new Error(errorMessages || data.message || 'Validation failed');
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
            throw error;
        }
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    $('.toast-container').remove();

    const toast = $(`
        <div class="toast-container fixed top-4 right-4 z-50 animate-slide-in">
            <div class="bg-white rounded-lg shadow-lg p-4 border-l-4 ${
                type === 'success' ? 'border-green-500' :
                type === 'error' ? 'border-red-500' :
                type === 'warning' ? 'border-yellow-500' :
                'border-blue-500'
            }">
                <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-800">${escapeHtml(message)}</span>
                    <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="$(this).closest('.toast-container').fadeOut(300, function() { $(this).remove(); })">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `);

    $('body').append(toast);

    setTimeout(() => {
        toast.fadeOut(300, function() {
            $(this).remove();
        });
    }, duration);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format date range
 */
function formatDateRange(startDate, endDate) {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
}

/**
 * Validate password strength
 */
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);

    return {
        isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
        checks: {
            minLength: password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
        },
    };
}

/**
 * Show loading spinner
 */
function showLoading(element) {
    if (typeof element === 'string') {
        element = $(element);
    }
    element.html(`
        <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    `);
}

/**
 * Show skeleton loader
 */
function showSkeleton(count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="bg-white rounded-lg shadow p-6 animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        `;
    }
    return html;
}

/**
 * Handle form errors from API response
 */
function handleFormErrors(errors, formElement) {
    // Clear previous errors
    formElement.find('.error-message').remove();
    formElement.find('.border-red-500').removeClass('border-red-500');

    if (Array.isArray(errors)) {
        errors.forEach(error => {
            const field = formElement.find(`[name="${error.field}"]`);
            if (field.length) {
                field.addClass('border-red-500');
                field.after(`<p class="error-message text-red-500 text-sm mt-1">${escapeHtml(error.message)}</p>`);
            }
        });
    }
}

/**
 * Check if route requires authentication
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Check if route requires admin role
 */
function requireAdmin() {
    if (!requireAuth()) return false;
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}