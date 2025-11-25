// Announcements-related functions

/**
 * Load announcements list
 */
async function loadAnnouncements() {
    const container = $('#announcements-list');
    showLoading(container);
    
    try {
        const response = await apiRequest('/announcements');
        if (response.status === 200 && response.data) {
            let announcements = response.data;
            
            // Filter by published (unless admin)
            if (!isAdmin()) {
                announcements = announcements.filter(a => a.published);
            }
            
            if (announcements.length === 0) {
                container.html(`
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No announcements found</h3>
                        <p class="mt-1 text-sm text-gray-500">Check back later for new announcements.</p>
                    </div>
                `);
                return;
            }
            
            let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
            announcements.forEach(announcement => {
                html += `
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                        <div class="flex items-start justify-between mb-4">
                            <h3 class="text-xl font-semibold text-gray-800 flex-1">${escapeHtml(announcement.title)}</h3>
                            ${!announcement.published ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">Draft</span>' : ''}
                        </div>
                        <p class="text-sm text-gray-500 mb-4">${formatDate(announcement.created_at)}</p>
                        <div class="flex items-center justify-between">
                            <a href="announcement-detail.html?id=${announcement.id}" class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                Listen →
                            </a>
                            ${isAdmin() ? `
                                <div class="flex space-x-2">
                                    <a href="announcement-edit.html?id=${announcement.id}" class="text-gray-600 hover:text-gray-800">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </a>
                                    <button onclick="deleteAnnouncement('${announcement.id}')" class="text-red-600 hover:text-red-800">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.html(html);
        }
    } catch (error) {
        console.error('Failed to load announcements:', error);
        container.html(`
            <div class="text-center py-12">
                <p class="text-red-500">Failed to load announcements. Please try again later.</p>
            </div>
        `);
    }
}

/**
 * Load announcement detail
 */
async function loadAnnouncementDetail(announcementId) {
    const container = $('#announcement-detail');
    showLoading(container);
    
    try {
        const response = await apiRequest(`/announcements/${announcementId}`);
        if (response.status === 200 && response.data) {
            const announcement = response.data;
            const isAdminUser = isAdmin();
            
            let html = `
                <div class="bg-white rounded-lg shadow-lg p-8">
                    <div class="flex items-start justify-between mb-6">
                        <div class="flex-1">
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">${escapeHtml(announcement.title)}</h1>
                            ${!announcement.published ? '<span class="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">Draft</span>' : ''}
                        </div>
                        ${isAdminUser ? `
                            <div class="flex space-x-2">
                                <a href="announcement-edit.html?id=${announcement.id}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Edit
                                </a>
                                <button onclick="deleteAnnouncement('${announcement.id}')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                    Delete
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <p class="text-gray-600 mb-6">${formatDate(announcement.created_at)}</p>
                    
                    <!-- Audio Player -->
                    <div class="mb-8">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">Audio</h2>
                        <div class="bg-gray-50 rounded-lg p-6">
                            <audio controls class="w-full" aria-label="Announcement audio">
                                <source src="${escapeHtml(announcement.audio_url)}" type="audio/mpeg">
                                <source src="${escapeHtml(announcement.audio_url)}" type="audio/wav">
                                <source src="${escapeHtml(announcement.audio_url)}" type="audio/m4a">
                                <source src="${escapeHtml(announcement.audio_url)}" type="audio/ogg">
                                Your browser does not support the audio element.
                            </audio>
                            <p class="mt-4 text-sm text-gray-600">
                                <a href="${escapeHtml(announcement.audio_url)}" target="_blank" class="text-blue-600 hover:text-blue-700">
                                    Download audio file
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            `;
            
            container.html(html);
        }
    } catch (error) {
        console.error('Failed to load announcement:', error);
        container.html(`
            <div class="text-center py-12">
                <p class="text-red-500">Failed to load announcement. Please try again later.</p>
                <a href="announcements.html" class="mt-4 inline-block text-blue-600 hover:text-blue-700">Back to Announcements</a>
            </div>
        `);
    }
}

/**
 * Delete announcement (admin only)
 */
async function deleteAnnouncement(announcementId) {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) return;
    
    try {
        const response = await apiRequest(`/announcements/${announcementId}`, {
            method: 'DELETE',
        });
        
        if (response.status === 200) {
            showToast('Announcement deleted successfully', 'success');
            setTimeout(() => {
                window.location.href = 'announcements.html';
            }, 1000);
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete announcement', 'error');
    }
}

/**
 * Create announcement
 */
async function createAnnouncement(event) {
    event.preventDefault();
    
    const form = $(event.target);
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.html();
    
    submitBtn.prop('disabled', true).html('Creating...');
    
    // Validate file
    const audioInput = $('#audio')[0];
    if (audioInput.files.length === 0) {
        showToast('Audio file is required', 'error');
        submitBtn.prop('disabled', false).html(originalText);
        return;
    }
    
    const file = audioInput.files[0];
    if (file.size > 5 * 1024 * 1024) {
        showToast('Audio file size must be less than 5MB', 'error');
        submitBtn.prop('disabled', false).html(originalText);
        return;
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('published', $('#published').is(':checked'));
    formData.append('audio', file);
    
    try {
        const response = await apiRequest('/announcements', {
            method: 'POST',
            body: formData,
        });
        
        if (response.status === 201) {
            showToast('Announcement created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'announcements.html';
            }, 1000);
        }
    } catch (error) {
        console.error('Failed to create announcement:', error);
        showToast(error.message || 'Failed to create announcement', 'error');
    } finally {
        submitBtn.prop('disabled', false).html(originalText);
    }
}

/**
 * Update announcement
 */
async function updateAnnouncement(event, announcementId) {
    event.preventDefault();
    
    const form = $(event.target);
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.html();
    
    submitBtn.prop('disabled', true).html('Updating...');
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('published', $('#published').is(':checked'));
    
    // Add audio if new file is selected
    const audioInput = $('#audio')[0];
    if (audioInput.files.length > 0) {
        const file = audioInput.files[0];
        if (file.size > 5 * 1024 * 1024) {
            showToast('Audio file size must be less than 5MB', 'error');
            submitBtn.prop('disabled', false).html(originalText);
            return;
        }
        formData.append('audio', file);
    }
    
    try {
        const response = await apiRequest(`/announcements/${announcementId}`, {
            method: 'PUT',
            body: formData,
        });
        
        if (response.status === 200) {
            showToast('Announcement updated successfully!', 'success');
            setTimeout(() => {
                window.location.href = `announcement-detail.html?id=${announcementId}`;
            }, 1000);
        }
    } catch (error) {
        console.error('Failed to update announcement:', error);
        showToast(error.message || 'Failed to update announcement', 'error');
    } finally {
        submitBtn.prop('disabled', false).html(originalText);
    }
}

