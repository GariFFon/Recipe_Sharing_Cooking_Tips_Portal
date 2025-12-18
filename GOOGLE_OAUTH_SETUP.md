# Google OAuth Setup Complete! 🎉

Your Recipe Sharing Portal now has Google OAuth authentication integrated!

## ✅ What Has Been Configured

### Backend Changes:
1. **Installed Dependencies:**
   - `passport` - Authentication middleware
   - `passport-google-oauth20` - Google OAuth 2.0 strategy
   - `express-session` - Session management

2. **Environment Variables (.env):**
   - GOOGLE_CLIENT_ID: `your-google-client-id.apps.googleusercontent.com`
   - GOOGLE_CLIENT_SECRET: `your-google-client-secret`

3. **User Model Updated:**
   - Added `googleId` field for Google users
   - Password is now optional for Google OAuth users

4. **New Auth Routes:**
   - `GET /api/auth/google` - Initiates Google OAuth flow
   - `GET /api/auth/google/callback` - Handles Google OAuth callback

5. **Server Configuration:**
   - Initialized Passport middleware in server.js

### Frontend Changes:
1. **Installed Dependency:**
   - `@react-oauth/google` - React Google OAuth library

2. **New Components:**
   - `AuthCallback.jsx` - Handles OAuth callback and redirects

3. **Updated Pages:**
   - **Login.jsx** - Added "Continue with Google" button
   - **Signup.jsx** - Added "Continue with Google" button

4. **Updated Routing:**
   - Added `/auth/callback` route in App.jsx

5. **Enhanced Styling:**
   - Added Google button styles to Login.css
   - Added divider with "OR" text

## 🚀 How to Use

### Starting the Application:

1. **Start MongoDB** (if not already running):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or start manually
   mongod --dbpath /path/to/your/data/directory
   ```

2. **Start Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   Server runs on: http://localhost:5001

3. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on: http://localhost:5173

### Testing Google Login:

1. Navigate to http://localhost:5173/login
2. Click "Continue with Google" button
3. Select your Google account
4. Authorize the application
5. You'll be redirected back and logged in automatically!

## 📝 Important Notes

### Google OAuth Consent Screen:
Your OAuth client is currently in **test mode**, which means:
- ✅ Only users you add to the test users list can log in
- ❌ Other users will see a "403: access_denied" error
- ⚠️ Starting June 2025, you won't be able to view/download the client secret from the dialog

**To add test users:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: APIs & Services → OAuth consent screen
3. Scroll to "Test users" section
4. Click "ADD USERS" and add email addresses

**To make it public (for production):**
1. Complete the OAuth consent screen configuration
2. Add privacy policy and terms of service URLs
3. Submit for verification (Google review process)

### Authorized Redirect URIs:
Make sure these URIs are added to your Google OAuth client:
- Development: `http://localhost:5001/api/auth/google/callback`
- Production: Update with your production domain

## 🔧 Configuration Details

### Backend Callback URL:
```javascript
callbackURL: 'http://localhost:5001/api/auth/google/callback'
```

### Frontend Redirect URLs:
- Success: `http://localhost:5173/auth/callback?token=...&user=...`
- Failure: `http://localhost:5173/login`

## 🎨 User Experience Flow

1. User clicks "Continue with Google"
2. Redirected to Google's login page
3. User selects Google account
4. Google redirects to `/api/auth/google/callback`
5. Backend creates/finds user and generates JWT token
6. Redirects to frontend `/auth/callback` with token
7. Frontend stores token and user data
8. User is logged in and redirected to home page

## 🔐 Security Features

- JWT tokens with 7-day expiration
- Passwords hashed with bcrypt (for regular signups)
- Google ID stored securely for OAuth users
- Session-less authentication (stateless JWT)
- Unique email constraint (no duplicate accounts)

## 🐛 Troubleshooting

### "403: access_denied" Error:
- Add your email to test users in Google Cloud Console
- Make sure the email you're using is in the test users list

### Redirect Loop:
- Check that all URLs match exactly (no trailing slashes)
- Verify backend and frontend are running on correct ports

### "User already exists" Error:
- If you previously signed up with email/password, the Google account will be linked automatically
- Check MongoDB to verify user accounts

## 📚 Next Steps

1. **Add More OAuth Providers:**
   - Facebook Login
   - GitHub Login
   - Twitter Login

2. **Enhance Security:**
   - Add email verification
   - Implement password reset
   - Add two-factor authentication

3. **Production Deployment:**
   - Update redirect URIs with production domain
   - Set up environment variables in hosting platform
   - Complete Google OAuth verification
   - Add privacy policy and terms of service

## 🎯 Testing Checklist

- [ ] Click "Continue with Google" on login page
- [ ] Verify Google popup/redirect appears
- [ ] Check if user is redirected back after authorization
- [ ] Confirm JWT token is stored in localStorage
- [ ] Verify user data appears in navigation
- [ ] Test logout functionality
- [ ] Try signing in again with same Google account
- [ ] Check if new user is created in MongoDB

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for error messages
3. Verify MongoDB is running
4. Ensure all environment variables are set correctly
5. Make sure you're added as a test user in Google Cloud Console

Happy coding! 🚀
