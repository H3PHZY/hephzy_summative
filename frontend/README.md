# CivicEvents+ Frontend

A modern, responsive frontend application for the CivicEvents+ platform built with HTML, Tailwind CSS, and jQuery.

## Features

- **Authentication**: Secure signup and login with password strength validation
- **Events Management**: Browse, register, and provide feedback on civic events
- **Announcements**: Listen to audio announcements
- **Promos**: Watch promotional videos with captions
- **Notifications**: In-app notification system with real-time updates
- **Dashboard**: User and admin dashboards with statistics
- **User Management**: Admin panel for managing users
- **Role-Based Access Control**: Different views and permissions for admin vs regular users

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A running backend API server (see backend README for setup)
- No build tools or Node.js required - this is a pure HTML/CSS/JS application

## Setup Instructions

### 1. Backend API Setup

Before running the frontend, ensure the backend API is set up and running:

1. Navigate to the `backend` directory
2. Follow the instructions in `backend/README.md` to:
   - Set up PostgreSQL database
   - Configure environment variables
   - Run database migrations
   - Start the backend server

The backend should be running at `http://localhost:4000` by default.

### 2. Frontend Configuration

1. Open `config.js` in the frontend directory
2. Update the `BASE_URL` if your backend is running on a different URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:4000/api',
    // Change this if your backend is on a different URL
    // BASE_URL: 'https://your-backend-url.com/api',
};
```

### 3. Running the Frontend

#### Option 1: Using a Local Web Server (Recommended)

For the best experience, use a local web server to avoid CORS issues:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

#### Option 2: Direct File Access

You can also open `index.html` or `login.html` directly in your browser, but note:
- Some browsers may block API requests due to CORS policies
- File:// protocol may have limitations

### 4. Accessing the Application

1. Open your browser and navigate to the frontend URL (e.g., `http://localhost:8000`)
2. You'll be redirected to the login page
3. Create a new account or use existing credentials
4. After login, you'll be redirected to the dashboard

## Project Structure

```
frontend/
├── config.js                 # API configuration
├── login.html                # Login page
├── signup.html               # Signup page
├── dashboard.html            # User dashboard
├── admin-dashboard.html      # Admin dashboard
├── events.html               # Events list
├── event-detail.html         # Event details
├── event-create.html         # Create event (admin)
├── event-edit.html           # Edit event (admin)
├── announcements.html        # Announcements list
├── announcement-detail.html  # Announcement details
├── announcement-create.html  # Create announcement (admin)
├── announcement-edit.html    # Edit announcement (admin)
├── promos.html               # Promos list
├── promo-detail.html         # Promo details
├── promo-create.html         # Create promo (admin)
├── promo-edit.html            # Edit promo (admin)
├── profile.html              # User profile
├── my-registrations.html     # User's event registrations
├── users.html                # User management (admin)
├── notification-detail.html  # Notification details
├── js/
│   ├── utils.js              # Utility functions
│   ├── auth.js               # Authentication functions
│   ├── navigation.js         # Navigation component
│   ├── events.js             # Events functionality
│   ├── announcements.js      # Announcements functionality
│   └── promos.js              # Promos functionality
└── README.md                 # This file
```

## Key Features Implementation

### Authentication & Authorization

- **Token Storage**: Uses `sessionStorage` by default, or `localStorage` if "Remember Me" is checked
- **Role-Based Access**: Admin vs user permissions enforced in UI and API calls
- **Auto-logout**: Automatically logs out on 401 (expired token) responses

### File Uploads

- **Events**: Image uploads (max 2MB, formats: JPG, PNG, GIF)
- **Announcements**: Audio uploads (max 5MB, formats: MP3, WAV, M4A, OGG)
- **Promos**: Video uploads (max 8MB, formats: MP4, MOV, AVI, MKV)

### Responsive Design

- Mobile-first approach using Tailwind CSS
- Responsive grid layouts for all pages
- Mobile-friendly navigation menu

### Accessibility

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader friendly

## API Integration

All API calls are made through the `apiRequest()` function in `js/utils.js`, which:
- Automatically adds the Authorization header with JWT token
- Handles 401 (Unauthorized) responses by logging out
- Handles 403 (Forbidden) responses with user-friendly messages
- Provides consistent error handling

## Role-Based Access Control

### Admin Features
- Create, edit, and delete events
- Create, edit, and delete announcements
- Create, edit, and delete promos
- Manage users (enable/disable)
- View admin dashboard with statistics
- Delete notifications

### User Features
- View published events, announcements, and promos
- Register for events
- Submit event feedback
- View personal dashboard
- Manage profile
- View notifications

## Environment Variables

No environment variables are required for the frontend. All configuration is in `config.js`.

## Troubleshooting

### CORS Errors

If you encounter CORS errors:
1. Ensure the backend is running and accessible
2. Check that the `BASE_URL` in `config.js` matches your backend URL
3. Use a local web server instead of opening files directly

### API Connection Issues

1. Verify the backend server is running
2. Check the browser console for error messages
3. Verify the API base URL in `config.js`
4. Check network tab in browser DevTools for failed requests

### Authentication Issues

1. Clear browser storage (localStorage and sessionStorage)
2. Try logging in again
3. Check that the JWT_SECRET in backend matches (if you've changed it)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Notes

- Passwords are validated client-side but must meet backend requirements
- JWT tokens are stored in browser storage (sessionStorage/localStorage)
- All API requests include authentication headers
- Role-based access is enforced on both frontend (UX) and backend (security)

## Development Notes

### Code Comments for Role-Based Guards

Role-based access control is implemented in several places:

1. **Navigation (`js/navigation.js`)**: 
   - Lines check `isAdmin()` to show/hide admin links
   - Admin-only routes are conditionally rendered

2. **Page-Level Guards**:
   - Each admin page calls `requireAdmin()` on load
   - User pages call `requireAuth()` to ensure authentication

3. **API Request Guards**:
   - `apiRequest()` function in `js/utils.js` handles 401/403 responses
   - Automatically redirects unauthorized users

4. **UI Conditionals**:
   - Create/Edit/Delete buttons only show for admins
   - Admin dashboard link only appears for admin users

## Demo Instructions

To demonstrate the application:

1. **Admin Actions**:
   - Create events with images
   - Create announcements with audio
   - Create promos with videos and captions
   - Manage users (enable/disable)
   - View admin dashboard statistics

2. **User Actions**:
   - Browse events and register
   - Submit feedback on events
   - Listen to announcements
   - Watch promos
   - View personal dashboard
   - Manage profile

3. **Backend Setup**:
   - Show database connection
   - Show API endpoints working
   - Demonstrate file uploads

## License

This project is part of a summative assignment for educational purposes.

## Support

For issues or questions, refer to the backend README or contact your instructor.
