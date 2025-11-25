// Navigation component and functions

/**
 * Load navigation into the page
 */
function loadNavigation() {
    const user = getCurrentUser();
    const isAdminUser = isAdmin();
    
    const nav = `
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <!-- Logo -->
                        <div class="flex-shrink-0 flex items-center">
                            <a href="dashboard.html" class="text-2xl font-bold text-blue-600">
                                CivicEvents+
                            </a>
                        </div>
                        
                        <!-- Navigation Links -->
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <a href="events.html" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Events
                            </a>
                            <a href="announcements.html" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Announcements
                            </a>
                            <a href="promos.html" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Promos
                            </a>
                            ${isAdminUser ? `
                                <a href="admin-dashboard.html" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Admin
                                </a>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Right side -->
                    <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        <!-- Search Bar -->
                        <div class="relative">
                            <input
                                type="text"
                                id="global-search"
                                placeholder="Search events, announcements..."
                                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>
                        
                        <!-- Notifications Bell -->
                        <button
                            id="notifications-btn"
                            class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                            onclick="toggleNotificationsDrawer()"
                            aria-label="Notifications"
                        >
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <span id="notification-count" class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hidden">0</span>
                        </button>
                        
                        <!-- Profile Dropdown -->
                        <div class="relative" id="profile-dropdown-container">
                            <button
                                id="profile-btn"
                                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onclick="toggleProfileDropdown()"
                                aria-label="Profile menu"
                            >
                                <div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                    ${user ? user.full_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span class="hidden md:block text-sm font-medium text-gray-700">
                                    ${user ? user.full_name : 'User'}
                                </span>
                                <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            <!-- Dropdown Menu -->
                            <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                                <a href="profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                                <a href="my-registrations.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Registrations</a>
                                ${isAdminUser ? '<a href="users.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Users</a>' : ''}
                                <hr class="my-1">
                                <button onclick="handleLogout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mobile menu button -->
                    <div class="sm:hidden flex items-center">
                        <button
                            id="mobile-menu-btn"
                            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onclick="toggleMobileMenu()"
                            aria-label="Menu"
                        >
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Mobile menu -->
            <div id="mobile-menu" class="hidden sm:hidden border-t border-gray-200">
                <div class="pt-2 pb-3 space-y-1">
                    <a href="events.html" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Events</a>
                    <a href="announcements.html" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Announcements</a>
                    <a href="promos.html" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Promos</a>
                    ${isAdminUser ? '<a href="admin-dashboard.html" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Admin</a>' : ''}
                    <a href="profile.html" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Profile</a>
                    <a href="my-registrations.html" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">My Registrations</a>
                    <button onclick="handleLogout()" class="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50">Sign Out</button>
                </div>
            </div>
        </nav>
        
        <!-- Notifications Drawer -->
        <div id="notifications-drawer" class="hidden fixed right-0 top-16 w-96 h-[calc(100vh-4rem)] bg-white shadow-xl z-40 border-l border-gray-200">
            <div class="flex flex-col h-full">
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-gray-800">Notifications</h2>
                    <button onclick="toggleNotificationsDrawer()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div id="notifications-list" class="flex-1 overflow-y-auto p-4">
                    <div class="text-center text-gray-500 py-8">Loading notifications...</div>
                </div>
            </div>
        </div>
        
        <!-- Overlay for mobile drawer -->
        <div id="drawer-overlay" class="hidden fixed inset-0 bg-black bg-opacity-50 z-30" onclick="toggleNotificationsDrawer()"></div>
    `;
    
    $('body').prepend(nav);
    
    // Load notifications count
    loadNotificationsCount();
    
    // Setup search functionality
    setupGlobalSearch();
    
    // Close dropdowns when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#profile-dropdown-container').length) {
            $('#profile-dropdown').addClass('hidden');
        }
    });
}

/**
 * Toggle profile dropdown
 */
function toggleProfileDropdown() {
    $('#profile-dropdown').toggleClass('hidden');
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    $('#mobile-menu').toggleClass('hidden');
}

/**
 * Toggle notifications drawer
 */
function toggleNotificationsDrawer() {
    const drawer = $('#notifications-drawer');
    const overlay = $('#drawer-overlay');
    
    if (drawer.hasClass('hidden')) {
        drawer.removeClass('hidden');
        overlay.removeClass('hidden');
        loadNotifications();
    } else {
        drawer.addClass('hidden');
        overlay.addClass('hidden');
    }
}

/**
 * Load notifications count
 */
async function loadNotificationsCount() {
    if (!isAuthenticated()) return;
    
    try {
        const response = await apiRequest('/notifications');
        if (response.status === 200 && response.data) {
            const unreadCount = response.data.filter(n => !n.read).length;
            const countBadge = $('#notification-count');
            
            if (unreadCount > 0) {
                countBadge.text(unreadCount).removeClass('hidden');
            } else {
                countBadge.addClass('hidden');
            }
        }
    } catch (error) {
        console.error('Failed to load notifications count:', error);
    }
}

/**
 * Load notifications list
 */
async function loadNotifications() {
    const container = $('#notifications-list');
    showLoading(container);
    
    try {
        const response = await apiRequest('/notifications');
        if (response.status === 200 && response.data) {
            const notifications = response.data;
            
            if (notifications.length === 0) {
                container.html('<div class="text-center text-gray-500 py-8">No notifications</div>');
                return;
            }
            
            let html = '<div class="space-y-2">';
            notifications.forEach(notification => {
                const isUnread = !notification.read;
                html += `
                    <div class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${isUnread ? 'bg-blue-50' : ''}" onclick="viewNotification('${notification.id}')">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-800">${escapeHtml(notification.title)}</h3>
                                <p class="text-sm text-gray-600 mt-1">${escapeHtml(notification.message)}</p>
                                <p class="text-xs text-gray-400 mt-2">${formatDate(notification.created_at)}</p>
                            </div>
                            ${isUnread ? '<div class="h-2 w-2 bg-blue-600 rounded-full ml-2"></div>' : ''}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.html(html);
        }
    } catch (error) {
        console.error('Failed to load notifications:', error);
        container.html('<div class="text-center text-red-500 py-8">Failed to load notifications</div>');
    }
}

/**
 * View notification detail
 */
function viewNotification(id) {
    window.location.href = `notification-detail.html?id=${id}`;
}

/**
 * Setup global search
 */
function setupGlobalSearch() {
    const searchInput = $('#global-search');
    const debouncedSearch = debounce(async function(query) {
        if (query.length < 2) return;
        
        // Redirect to events page with search query
        window.location.href = `events.html?search=${encodeURIComponent(query)}`;
    }, 500);
    
    searchInput.on('input', function() {
        debouncedSearch($(this).val());
    });
    
    searchInput.on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            const query = $(this).val();
            if (query.length >= 2) {
                window.location.href = `events.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
}

/**
 * Load footer
 */
function loadFooter() {
    const footer = `
        <footer class="bg-gray-800 text-white mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">CivicEvents+</h3>
                        <p class="text-gray-400 text-sm">
                            Connecting communities through civic engagement and events.
                        </p>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="events.html" class="hover:text-white">Events</a></li>
                            <li><a href="announcements.html" class="hover:text-white">Announcements</a></li>
                            <li><a href="promos.html" class="hover:text-white">Promos</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Contact</h3>
                        <p class="text-gray-400 text-sm">
                            For support, please contact your administrator.
                        </p>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2024 CivicEvents+. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    
    $('body').append(footer);
}

