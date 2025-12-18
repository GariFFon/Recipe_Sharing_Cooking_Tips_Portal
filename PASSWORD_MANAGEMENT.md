# Password Management Feature

This feature allows users who logged in with Google OAuth to set a password and enables all users to change their passwords.

## Features

### 1. Set Password (for Google OAuth users)
- **Who**: Users who logged in with Google and don't have a password yet
- **Where**: Profile page → "🔐 Set Password" button
- **What**: Allows Google users to create a password so they can login with both Google OAuth AND email/password

### 2. Change Password (for all users)
- **Who**: Users who already have a password (registered via email or set a password after Google login)
- **Where**: Profile page → "🔒 Change Password" button
- **What**: Allows users to update their existing password

## Backend API Endpoints

### Check Password Status
```
GET /api/auth/password-status
Headers: Authorization: Bearer <token>
Response: {
  hasPassword: boolean,
  hasGoogleAuth: boolean
}
```

### Set Password (First-time password creation)
```
POST /api/auth/set-password
Headers: Authorization: Bearer <token>
Body: {
  password: string (min 6 chars, must contain 1 number)
}
```

**Validation:**
- Only works if user doesn't have a password
- Password must be at least 6 characters
- Password must contain at least one number

### Change Password (Update existing password)
```
POST /api/auth/change-password
Headers: Authorization: Bearer <token>
Body: {
  currentPassword: string,
  newPassword: string (min 6 chars, must contain 1 number)
}
```

**Validation:**
- Only works if user already has a password
- Current password must be correct
- New password must be different from current password
- New password must be at least 6 characters
- New password must contain at least one number

## User Flow

### For Google OAuth Users (Setting Password)
1. User logs in with Google
2. Goes to Profile page
3. Clicks "🔐 Set Password" button
4. Modal opens with fields:
   - New Password
   - Confirm Password
5. Submits form
6. Password is saved (hashed with bcrypt)
7. User can now login with BOTH:
   - Google OAuth
   - Email + Password

### For All Users (Changing Password)
1. User goes to Profile page
2. Clicks "🔒 Change Password" button
3. Modal opens with fields:
   - Current Password
   - New Password
   - Confirm Password
4. Submits form
5. If current password is correct, new password is saved

## Security Features

- Passwords are hashed using bcrypt before storing
- Minimum password requirements enforced (6 chars + 1 number)
- Current password verification required for password changes
- Protected endpoints require JWT authentication
- Passwords never returned in API responses

## UI/UX Features

- Conditional button text based on password status
- Real-time validation with error messages
- Success messages after successful operations
- Loading states during API calls
- Modal automatically closes after success
- Responsive design for mobile devices

## Technical Details

### Database Schema (User Model)
```javascript
{
  name: String,
  email: String (unique),
  password: String (optional if googleId exists),
  googleId: String (optional, unique),
  createdAt: Date
}
```

### Password Hashing
- Uses bcrypt with salt rounds: 10
- Hash occurs in pre-save middleware
- Only hashes if password field is modified

### Password Comparison
- Uses bcrypt.compare()
- Returns false if password field is null/undefined
- Constant-time comparison for security
