# CivicEvents+ Frontend

A modern, responsive frontend application for the CivicEvents+ platform built with HTML, Tailwind CSS, and jQuery. This application allows users to discover civic events, listen to announcements, watch promos, and enables administrators to manage content.

## 📺 Demo Video

**[Click here to watch the Full Project Demo on YouTube](https://www.youtube.com/watch?v=vSc-xV-Ctlc)**

*(Video covers Admin features, User registration, Event creation, and Media handling)*

---

## Features

### ✅ Implemented Features
- **Authentication**: Secure signup and login with visual password strength validation.
- **Events Management**: Browse, register, and provide feedback on civic events.
- **Announcements**: Listen to audio announcements with an integrated player.
- **Promos**: Watch promotional videos with accessibility captions.
- **Notifications**: In-app notification system with real-time updates.
- **Dashboard**: User and admin dashboards with statistics and activity feeds.
- **User Management**: Admin panel for managing users (enable/disable).
- **Role-Based Access Control**: Different views and permissions for admin vs regular users.

### ⚠️ Note on Service Requests
> **Disclaimer:** The "Service Requests" feature mentioned in the assignment rubric was **omitted** because the provided Backend API codebase did not contain the necessary endpoints/routes to support this feature. All other rubric requirements have been implemented.

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A running backend API server (see backend README for setup)
- No build tools or Node.js required - this is a pure HTML/CSS/JS application

## Setup Instructions

### 1. Backend API Setup

Before running the frontend, ensure the backend API is set up and running:

1. Navigate to the `backend` directory.
2. Follow the instructions in `backend/README.md` to:
   - Set up PostgreSQL database.
   - Configure environment variables (`.env`).
   - Run database migrations (e.g., `psql -U postgres -d civic_events -f migrations/001_create_tables.sql`).
   - Start the backend server.

The backend should be running at `http://localhost:4000` by default.

### 2. Frontend Configuration

1. Open `config.js` in the `frontend` directory.
2. Update the `BASE_URL` if your backend is running on a different URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:4000/api',
    // Change this if your backend is on a different URL
    // BASE_URL: '[https://your-backend-url.com/api](https://your-backend-url.com/api)',
};
3. Running the Frontend
Option 1: Using a Local Web Server (Recommended)
For the best experience, use a local web server to avoid CORS issues:

Using Python:

Bash

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
Using Node.js (http-server):

Bash

npx http-server -p 8000
Using VS Code Live Server: Right-click on login.html or index.html and select "Open with Live Server".

Then open your browser and navigate to the local URL (e.g., http://localhost:8000 or http://127.0.0.1:5500).

Option 2: Direct File Access
You can also open index.html or login.html directly in your browser, but note:

Some browsers may block API requests due to CORS policies.

file:// protocol may have limitations.

Project Structure
Plaintext

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
├── promo-edit.html           # Edit promo (admin)
├── profile.html              # User profile
├── my-registrations.html     # User's event registrations
├── users.html                # User management (admin)
├── notification-detail.html  # Notification details
├── event-attendees.html      # Admin view for event registrants
├── notification-create.html  # Admin view to send broadcasts
├── js/
│   ├── utils.js              # Utility functions (API, Toasts, Skeletons)
│   ├── auth.js               # Authentication functions
│   ├── navigation.js         # Navigation component (Role-based)
│   ├── events.js             # Events functionality
│   ├── announcements.js      # Announcements functionality
│   └── promos.js             # Promos functionality
└── README.md                 # This file
Key Features Implementation
Authentication & Authorization
Token Storage: Uses sessionStorage by default, or localStorage if "Remember Me" is checked.

Role-Based Access: Admin vs user permissions enforced in UI (hiding/showing buttons) and API calls (redirecting unauthorized users).

Auto-logout: Automatically logs out on 401 (expired token) responses.

File Uploads
Events: Image uploads (max 2MB, formats: JPG, PNG, GIF).

Announcements: Audio uploads (max 5MB, formats: MP3, WAV, M4A, OGG).

Promos: Video uploads (max 8MB, formats: MP4, MOV, AVI, MKV).

Accessibility & UX
Semantic HTML: Proper use of header, main, and footer tags.

Loading States: Skeleton loaders for data fetching and spinner buttons for form submissions.

Feedback: Toast notifications for success and error messages.

Responsive Design: Mobile-first approach using Tailwind CSS grid and flexbox.

API Integration
All API calls are made through the apiRequest() function in js/utils.js, which:

Automatically adds the Authorization: Bearer <token> header.

Handles 401 (Unauthorized) responses by logging out.

Handles 403 (Forbidden) responses with user-friendly messages.

Provides consistent error handling.

Development Notes
Code Comments for Role-Based Guards
Role-based access control is implemented in several places:

Navigation (js/navigation.js):

Checks isAdmin() to show/hide "Admin" links in the navbar.

Admin-only routes are conditionally rendered.

Page-Level Guards:

Admin pages (e.g., admin-dashboard.html) call requireAdmin() on load to block unauthorized access.

User pages call requireAuth() to ensure the user is logged in.

Signup Flow:

A role selection dropdown was added to signup.html for demonstration purposes, allowing easy creation of Admin accounts for testing.

License
This project is part of a summative assignment for educational purposes.