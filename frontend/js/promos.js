// Promos-related functions

/**
 * Load promos list
 */
async function loadPromos() {
    const container = $('#promos-list');
    showLoading(container);
    
    try {
        const response = await apiRequest('/promos');
        if (response.status === 200 && response.data) {
            let promos = response.data.promos || response.data;
            
            // Filter by published (unless admin)
            if (!isAdmin()) {
                promos = promos.filter(p => p.published);
            }
            
            if (promos.length === 0) {
                container.html(`
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No promos found</h3>
                        <p class="mt-1 text-sm text-gray-500">Check back later for new promos.</p>
                    </div>
                `);
                return;
            }
            
            let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
            promos.forEach(promo => {
                html += `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                        <div class="aspect-video bg-gray-200 flex items-center justify-center">
                            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="p-6">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="text-xl font-semibold text-gray-800 flex-1">${escapeHtml(promo.title)}</h3>
                                ${!promo.published ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2">Draft</span>' : ''}
                            </div>
                            ${promo.description ? `<p class="text-gray-600 text-sm mb-4 line-clamp-2">${escapeHtml(promo.description.substring(0, 100))}${promo.description.length > 100 ? '...' : ''}</p>` : ''}
                            <div class="flex items-center justify-between">
                                <a href="promo-detail.html?id=${promo.id}" class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                    Watch →
                                </a>
                                ${isAdmin() ? `
                                    <div class="flex space-x-2">
                                        <a href="promo-edit.html?id=${promo.id}" class="text-gray-600 hover:text-gray-800">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </a>
                                        <button onclick="deletePromo('${promo.id}')" class="text-red-600 hover:text-red-800">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.html(html);
        }
    } catch (error) {
        console.error('Failed to load promos:', error);
        container.html(`
            <div class="text-center py-12">
                <p class="text-red-500">Failed to load promos. Please try again later.</p>
            </div>
        `);
    }
}

/**
 * Load promo detail
 */
async function loadPromoDetail(promoId) {
    const container = $('#promo-detail');
    showLoading(container);
    
    try {
        const response = await apiRequest(`/promos/${promoId}`);
        if (response.status === 200 && response.data) {
            const promo = response.data;
            const isAdminUser = isAdmin();
            
            let html = `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="p-8">
                        <div class="flex items-start justify-between mb-6">
                            <div class="flex-1">
                                <h1 class="text-3xl font-bold text-gray-900 mb-2">${escapeHtml(promo.title)}</h1>
                                ${!promo.published ? '<span class="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">Draft</span>' : ''}
                            </div>
                            ${isAdminUser ? `
                                <div class="flex space-x-2">
                                    <a href="promo-edit.html?id=${promo.id}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Edit
                                    </a>
                                    <button onclick="deletePromo('${promo.id}')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        Delete
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${promo.description ? `<p class="text-gray-700 mb-6 leading-relaxed">${escapeHtml(promo.description)}</p>` : ''}
                        
                        <!-- Video Player -->
                        <div class="mb-8">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Video</h2>
                            <div class="bg-gray-900 rounded-lg overflow-hidden">
                                <video controls class="w-full" aria-label="Promo video">
                                    <source src="${escapeHtml(promo.video_url)}" type="video/mp4">
                                    <source src="${escapeHtml(promo.video_url)}" type="video/mov">
                                    <source src="${escapeHtml(promo.video_url)}" type="video/avi">
                                    <source src="${escapeHtml(promo.video_url)}" type="video/mkv">
                                    Your browser does not support the video element.
                                </video>
                                ${promo.caption_text ? `
                                    <track kind="captions" src="data:text/vtt;base64,${btoa('WEBVTT\n\n1\n00:00:00.000 --> 00:00:10.000\n' + escapeHtml(promo.caption_text))}" srclang="en" label="English" default>
                                ` : ''}
                            </div>
                            ${promo.caption_text ? `
                                <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h3 class="font-semibold text-gray-800 mb-2">Captions</h3>
                                    <p class="text-gray-700">${escapeHtml(promo.caption_text)}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            container.html(html);
        }
    } catch (error) {
        console.error('Failed to load promo:', error);
        container.html(`
            <div class="text-center py-12">
                <p class="text-red-500">Failed to load promo. Please try again later.</p>
                <a href="promos.html" class="mt-4 inline-block text-blue-600 hover:text-blue-700">Back to Promos</a>
            </div>
        `);
    }
}

/**
 * Delete promo (admin only)
 */
async function deletePromo(promoId) {
    if (!confirm('Are you sure you want to delete this promo? This action cannot be undone.')) return;
    
    try {
        const response = await apiRequest(`/promos/${promoId}`, {
            method: 'DELETE',
        });
        
        if (response.status === 200) {
            showToast('Promo deleted successfully', 'success');
            setTimeout(() => {
                window.location.href = 'promos.html';
            }, 1000);
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete promo', 'error');
    }
}

/**
 * Create promo
 */
async function createPromo(event) {
    event.preventDefault();
    
    const form = $(event.target);
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.html();
    
    submitBtn.prop('disabled', true).html('Creating...');
    
    // Validate file
    const videoInput = $('#video')[0];
    if (videoInput.files.length === 0) {
        showToast('Video file is required', 'error');
        submitBtn.prop('disabled', false).html(originalText);
        return;
    }
    
    const file = videoInput.files[0];
    if (file.size > 8 * 1024 * 1024) {
        showToast('Video file size must be less than 8MB', 'error');
        submitBtn.prop('disabled', false).html(originalText);
        return;
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('description', $('#description').val());
    formData.append('caption_text', $('#caption_text').val());
    formData.append('video', file);
    
    try {
        const response = await apiRequest('/promos', {
            method: 'POST',
            body: formData,
        });
        
        if (response.status === 201) {
            showToast('Promo created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'promos.html';
            }, 1000);
        }
    } catch (error) {
        console.error('Failed to create promo:', error);
        showToast(error.message || 'Failed to create promo', 'error');
    } finally {
        submitBtn.prop('disabled', false).html(originalText);
    }
}

/**
 * Update promo
 */
async function updatePromo(event, promoId) {
    event.preventDefault();
    
    const form = $(event.target);
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.html();
    
    submitBtn.prop('disabled', true).html('Updating...');
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('description', $('#description').val());
    formData.append('caption_text', $('#caption_text').val());
    
    // Add video if new file is selected
    const videoInput = $('#video')[0];
    if (videoInput.files.length > 0) {
        const file = videoInput.files[0];
        if (file.size > 8 * 1024 * 1024) {
            showToast('Video file size must be less than 8MB', 'error');
            submitBtn.prop('disabled', false).html(originalText);
            return;
        }
        formData.append('video', file);
    }
    
    try {
        const response = await apiRequest(`/promos/${promoId}`, {
            method: 'PUT',
            body: formData,
        });
        
        if (response.status === 200) {
            showToast('Promo updated successfully!', 'success');
            setTimeout(() => {
                window.location.href = `promo-detail.html?id=${promoId}`;
            }, 1000);
        }
    } catch (error) {
        console.error('Failed to update promo:', error);
        showToast(error.message || 'Failed to update promo', 'error');
    } finally {
        submitBtn.prop('disabled', false).html(originalText);
    }
}

