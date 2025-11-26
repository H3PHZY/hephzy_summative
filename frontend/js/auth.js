/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const form = $(event.target);
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.html();
    
    // Disable submit button
    submitBtn.prop('disabled', true).html('Logging in...');
    
    // Clear previous errors
    form.find('.error-message').remove();
    form.find('.border-red-500').removeClass('border-red-500');
    
    const email = form.find('[name="email"]').val();
    const password = form.find('[name="password"]').val();
    const rememberMe = form.find('[name="rememberMe"]').is(':checked');
    
    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (response.status === 200 && response.data) {
            const { token, user } = response.data;
            saveAuth(token, user, rememberMe);
            showToast('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed. Please check your credentials.', 'error');
        form.find('[name="email"]').addClass('border-red-500');
        form.find('[name="password"]').addClass('border-red-500');
    } finally {
        submitBtn.prop('disabled', false).html(originalText);
    }
}

/**
 * Handle signup form submission
 */
async function handleSignup(event) {
    event.preventDefault();
    
    const form = $(event.target);
    const submitBtn = form.find('button[type="submit"]');
    const originalText = submitBtn.html();
    
    // Disable submit button
    submitBtn.prop('disabled', true).html('Creating account...');
    
    // Clear previous errors
    form.find('.error-message').remove();
    form.find('.border-red-500').removeClass('border-red-500');
    
    const full_name = form.find('[name="full_name"]').val();
    const email = form.find('[name="email"]').val();
    const password = form.find('[name="password"]').val();
    const confirm_password = form.find('[name="confirm_password"]').val();
    
    // --- NEW: Capture the Role from the dropdown ---
    const role = form.find('[name="role"]').val(); 
    
    // Client-side validation
    if (password !== confirm_password) {
        showToast('Passwords do not match.', 'error');
        form.find('[name="confirm_password"]').addClass('border-red-500');
        submitBtn.prop('disabled', false).html(originalText);
        return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        showToast('Password does not meet requirements.', 'error');
        form.find('[name="password"]').addClass('border-red-500');
        submitBtn.prop('disabled', false).html(originalText);
        return;
    }
    
    try {
        const response = await apiRequest('/auth/signup', {
            method: 'POST',
            // --- NEW: Send the 'role' in the JSON body ---
            body: JSON.stringify({ full_name, email, password, role }),
        });
        
        if (response.status === 201) {
            showToast('Account created successfully! Please login.', 'success');
            
            // Redirect to login after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Signup error:', error);
        const errorMessage = error.message || 'Signup failed. Please try again.';
        showToast(errorMessage, 'error');
        
        // Highlight email field if it's a duplicate
        if (errorMessage.includes('Email') || errorMessage.includes('email')) {
            form.find('[name="email"]').addClass('border-red-500');
        }
    } finally {
        submitBtn.prop('disabled', false).html(originalText);
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    clearAuth();
    showToast('Logged out successfully.', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

/**
 * Update password strength meter
 */
function updatePasswordStrength(password) {
    const validation = validatePassword(password);
    const meter = $('#password-strength-meter');
    const checks = $('#password-checks');
    
    if (!password) {
        meter.hide();
        checks.hide();
        return;
    }
    
    meter.show();
    checks.show();
    
    const strength = validation.isValid ? 'strong' : 
                     password.length >= 6 ? 'medium' : 'weak';
    
    meter.removeClass('weak medium strong').addClass(strength);
    
    // Update checkmarks
    checks.html(`
        <div class="text-xs space-y-1 mt-2">
            <div class="flex items-center ${validation.checks.minLength ? 'text-green-600' : 'text-gray-400'}">
                <span>${validation.checks.minLength ? '✓' : '○'}</span>
                <span class="ml-2">At least 8 characters</span>
            </div>
            <div class="flex items-center ${validation.checks.hasUpperCase ? 'text-green-600' : 'text-gray-400'}">
                <span>${validation.checks.hasUpperCase ? '✓' : '○'}</span>
                <span class="ml-2">One uppercase letter</span>
            </div>
            <div class="flex items-center ${validation.checks.hasLowerCase ? 'text-green-600' : 'text-gray-400'}">
                <span>${validation.checks.hasLowerCase ? '✓' : '○'}</span>
                <span class="ml-2">One lowercase letter</span>
            </div>
            <div class="flex items-center ${validation.checks.hasNumber ? 'text-green-600' : 'text-gray-400'}">
                <span>${validation.checks.hasNumber ? '✓' : '○'}</span>
                <span class="ml-2">One number</span>
            </div>
            <div class="flex items-center ${validation.checks.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}">
                <span>${validation.checks.hasSpecialChar ? '✓' : '○'}</span>
                <span class="ml-2">One special character</span>
            </div>
        </div>
    `);
}
