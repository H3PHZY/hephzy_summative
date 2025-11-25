// Events-related functions

/**
 * Load events list
 */
async function loadEvents(searchQuery = '') {
    const container = $('#events-list');
    showLoading(container);
    
    try {
        const response = await apiRequest('/events');
        if (response.status === 200 && response.data) {
            let events = response.data;
            
            // Filter by published (unless admin)
            if (!isAdmin()) {
                events = events.filter(e => e.published);
            }
            
            // Apply search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                events = events.filter(e => 
                    e.title.toLowerCase().includes(query) ||
                    (e.description && e.description.toLowerCase().includes(query)) ||
                    (e.location && e.location.toLowerCase().includes(query))
                );
            }
            
            if (events.length === 0) {
                container.html(`
                    <div class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                        <p class="mt-1 text-sm text-gray-500">${searchQuery ? 'Try a different search term.' : 'Check back later for upcoming events.'}</p>
                    </div>
                `);
                return;
            }
            
            let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
            events.forEach(event => {
                const imageUrl = event.metadata?.image_url || '';
                html += `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                        ${imageUrl ? `
                            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(event.title)}" class="w-full h-48 object-cover" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'200\\'%3E%3Crect fill=\\'%23e5e7eb\\' width=\\'400\\' height=\\'200\\'/%3E%3Ctext fill=\\'%239ca3af\\' font-family=\\'sans-serif\\' font-size=\\'18\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3ENo Image%3C/text%3E%3C/svg%3E'">
                        ` : `
                            <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        `}
                        <div class="p-6">
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">${escapeHtml(event.title)}</h3>
                            ${event.description ? `<p class="text-gray-600 text-sm mb-4 line-clamp-2">${escapeHtml(event.description.substring(0, 100))}${event.description.length > 100 ? '...' : ''}</p>` : ''}
                            <div class="space-y-2 mb-4">
                                ${event.location ? `
                                    <div class="flex items-center text-sm text-gray-600">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        ${escapeHtml(event.location)}
                                    </div>
                                ` : ''}
                                ${event.starts_at ? `
                                    <div class="flex items-center text-sm text-gray-600">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        ${formatDate(event.starts_at)}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="flex items-center justify-between">
                                <a href="event-detail.html?id=${event.id}" class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                    View Details →
                                </a>
                                ${!event.published ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Draft</span>' : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.html(html);
        }
    } catch (error) {
        console.error('Failed to load events:', error);
        container.html(`
            <div class="text-center py-12">
                <p class="text-red-500">Failed to load events. Please try again later.</p>
            </div>
        `);
    }
}

/**
 * Load event detail
 */
async function loadEventDetail(eventId) {
    const container = $('#event-detail');
    showLoading(container);
    
    try {
        const response = await apiRequest(`/events/${eventId}`);
        if (response.status === 200 && response.data) {
            const event = response.data;
            const imageUrl = event.metadata?.image_url || '';
            const isAdminUser = isAdmin();
            
            let html = `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    ${imageUrl ? `
                        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(event.title)}" class="w-full h-96 object-cover" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'800\\' height=\\'400\\'%3E%3Crect fill=\\'%23e5e7eb\\' width=\\'800\\' height=\\'400\\'/%3E%3Ctext fill=\\'%239ca3af\\' font-family=\\'sans-serif\\' font-size=\\'24\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3ENo Image%3C/text%3E%3C/svg%3E'">
                    ` : ''}
                    <div class="p-8">
                        <div class="flex items-start justify-between mb-6">
                            <div class="flex-1">
                                <h1 class="text-3xl font-bold text-gray-900 mb-2">${escapeHtml(event.title)}</h1>
                                ${!event.published ? '<span class="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">Draft</span>' : ''}
                            </div>
                            ${isAdminUser ? `
                                <div class="flex space-x-2">
                                    <a href="event-edit.html?id=${event.id}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Edit
                                    </a>
                                    <button onclick="deleteEvent('${event.id}')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                        Delete
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${event.description ? `<p class="text-gray-700 mb-6 leading-relaxed">${escapeHtml(event.description)}</p>` : ''}
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            ${event.location ? `
                                <div class="flex items-start">
                                    <svg class="w-6 h-6 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    <div>
                                        <h3 class="font-semibold text-gray-800 mb-1">Location</h3>
                                        <p class="text-gray-600">${escapeHtml(event.location)}</p>
                                    </div>
                                </div>
                            ` : ''}
                            ${event.starts_at ? `
                                <div class="flex items-start">
                                    <svg class="w-6 h-6 text-gray-400 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <div>
                                        <h3 class="font-semibold text-gray-800 mb-1">Date & Time</h3>
                                        <p class="text-gray-600">${formatDate(event.starts_at)}${event.ends_at ? ` - ${formatDate(event.ends_at)}` : ''}</p>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${!isAdminUser ? `
                            <div class="mb-8">
                                <button id="register-btn" onclick="toggleEventRegistration('${event.id}')" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                                    Register for Event
                                </button>
                            </div>
                        ` : `
                            <div class="mb-8">
                                <a href="event-attendees.html?event_id=${event.id}" class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                                    View Attendees
                                </a>
                            </div>
                        `}
                    </div>
                </div>
                
                <!-- Feedback Section -->
                <div class="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Feedback</h2>
                    <div id="feedback-section">
                        ${showSkeleton(2)}
                    </div>
                </div>
            `;
            
            container.html(html);
            
            // Check registration status
            if (!isAdminUser) {
                checkRegistrationStatus(eventId);
            }
            
            // Load feedback
            loadEventFeedback(eventId);
        }
    } catch (error) {
        console.error('Failed to load event:', error);
        container.html(`
            <div class="text-center py-12">
                <p class="text-red-500">Failed to load event. Please try again later.</p>
                <a href="events.html" class="mt-4 inline-block text-blue-600 hover:text-blue-700">Back to Events</a>
            </div>
        `);
    }
}

/**
 * Check if user is registered for event
 */
async function checkRegistrationStatus(eventId) {
    try {
        const response = await apiRequest('/event-registrations/my-registrations');
        if (response.status === 200 && response.data) {
            const isRegistered = response.data.some(reg => reg.event_id === eventId && reg.status === 'registered');
            const btn = $('#register-btn');
            
            if (isRegistered) {
                btn.text('Cancel Registration').removeClass('bg-blue-600 hover:bg-blue-700').addClass('bg-red-600 hover:bg-red-700');
                btn.attr('onclick', `cancelEventRegistration('${eventId}')`);
            }
        }
    } catch (error) {
        console.error('Failed to check registration status:', error);
    }
}

/**
 * Toggle event registration
 */
async function toggleEventRegistration(eventId) {
    try {
        const response = await apiRequest('/event-registrations/register', {
            method: 'POST',
            body: JSON.stringify({ event_id: eventId }),
        });
        
        if (response.status === 201) {
            showToast('Successfully registered for event!', 'success');
            checkRegistrationStatus(eventId);
        }
    } catch (error) {
        showToast(error.message || 'Failed to register for event', 'error');
    }
}

/**
 * Cancel event registration
 */
async function cancelEventRegistration(eventId) {
    if (!confirm('Are you sure you want to cancel your registration?')) return;
    
    try {
        const response = await apiRequest('/event-registrations/cancel', {
            method: 'POST',
            body: JSON.stringify({ event_id: eventId }),
        });
        
        if (response.status === 200) {
            showToast('Registration cancelled successfully', 'success');
            checkRegistrationStatus(eventId);
        }
    } catch (error) {
        showToast(error.message || 'Failed to cancel registration', 'error');
    }
}

/**
 * Load event feedback
 */
async function loadEventFeedback(eventId) {
    const container = $('#feedback-section');
    
    try {
        const response = await apiRequest(`/event-feedback/event/${eventId}`);
        if (response.status === 200 && response.data) {
            const feedbacks = response.data;
            
            // Calculate average rating
            const avgRating = feedbacks.length > 0
                ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                : 0;
            
            let html = `
                <div class="mb-6">
                    <div class="flex items-center space-x-4 mb-4">
                        <div>
                            <span class="text-3xl font-bold text-gray-900">${avgRating}</span>
                            <span class="text-gray-600">/ 5.0</span>
                        </div>
                        <div>
                            <div class="flex items-center">
                                ${[1, 2, 3, 4, 5].map(i => `
                                    <svg class="w-6 h-6 ${i <= avgRating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                `).join('')}
                            </div>
                            <p class="text-sm text-gray-600">${feedbacks.length} review${feedbacks.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Feedback form
            html += `
                <div class="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Leave Feedback</h3>
                    <form id="feedback-form" onsubmit="submitFeedback(event, '${eventId}')">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div class="flex space-x-2" id="rating-stars">
                                ${[1, 2, 3, 4, 5].map(i => `
                                    <button type="button" class="star-btn text-3xl text-gray-300 hover:text-yellow-400 focus:outline-none" data-rating="${i}">★</button>
                                `).join('')}
                            </div>
                            <input type="hidden" name="rating" id="rating-input" required>
                        </div>
                        <div class="mb-4">
                            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea id="comment" name="comment" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Share your experience..."></textarea>
                        </div>
                        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Submit Feedback
                        </button>
                    </form>
                </div>
            `;
            
            // Existing feedbacks
            if (feedbacks.length > 0) {
                html += '<div class="space-y-4"><h3 class="text-lg font-semibold text-gray-800 mb-4">Reviews</h3>';
                feedbacks.forEach(feedback => {
                    html += `
                        <div class="p-4 border border-gray-200 rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center space-x-2">
                                    <div class="flex">
                                        ${[1, 2, 3, 4, 5].map(i => `
                                            <svg class="w-4 h-4 ${i <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        `).join('')}
                                    </div>
                                    <span class="font-medium text-gray-800">${escapeHtml(feedback.full_name || 'Anonymous')}</span>
                                </div>
                                <span class="text-sm text-gray-500">${formatDate(feedback.created_at)}</span>
                            </div>
                            ${feedback.comment ? `<p class="text-gray-700">${escapeHtml(feedback.comment)}</p>` : ''}
                        </div>
                    `;
                });
                html += '</div>';
            } else {
                html += '<p class="text-gray-500 text-center py-4">No feedback yet. Be the first to review!</p>';
            }
            
            container.html(html);
            
            // Setup star rating
            setupStarRating();
        }
    } catch (error) {
        console.error('Failed to load feedback:', error);
        container.html('<p class="text-red-500">Failed to load feedback</p>');
    }
}

/**
 * Setup star rating interaction
 */
function setupStarRating() {
    $('.star-btn').on('click', function() {
        const rating = $(this).data('rating');
        $('#rating-input').val(rating);
        
        $('.star-btn').each(function() {
            const starRating = $(this).data('rating');
            if (starRating <= rating) {
                $(this).removeClass('text-gray-300').addClass('text-yellow-400');
            } else {
                $(this).removeClass('text-yellow-400').addClass('text-gray-300');
            }
        });
    });
}

/**
 * Submit feedback
 */
async function submitFeedback(event, eventId) {
    event.preventDefault();
    
    const form = $(event.target);
    const rating = $('#rating-input').val();
    const comment = $('#comment').val();
    
    if (!rating) {
        showToast('Please select a rating', 'error');
        return;
    }
    
    try {
        const response = await apiRequest('/event-feedback', {
            method: 'POST',
            body: JSON.stringify({
                event_id: eventId,
                rating: parseInt(rating),
                comment: comment || null,
            }),
        });
        
        if (response.status === 201) {
            showToast('Feedback submitted successfully!', 'success');
            form[0].reset();
            $('.star-btn').removeClass('text-yellow-400').addClass('text-gray-300');
            $('#rating-input').val('');
            loadEventFeedback(eventId);
        }
    } catch (error) {
        showToast(error.message || 'Failed to submit feedback', 'error');
    }
}

/**
 * Delete event (admin only)
 */
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    
    try {
        const response = await apiRequest(`/events/${eventId}`, {
            method: 'DELETE',
        });
        
        if (response.status === 200) {
            showToast('Event deleted successfully', 'success');
            setTimeout(() => {
                window.location.href = 'events.html';
            }, 1000);
        }
    } catch (error) {
        showToast(error.message || 'Failed to delete event', 'error');
    }
}

