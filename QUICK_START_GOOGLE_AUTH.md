# Quick Start Guide - Google OAuth

## 🎯 Your Credentials
- **Client ID:** `your-google-client-id.apps.googleusercontent.com`
- **Client Secret:** `your-google-client-secret`
- **Status:** ✅ Configured in `.env` file

## ⚡ Quick Commands

### Start Everything:
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Access URLs:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001
- **Login Page:** http://localhost:5173/login

## ⚠️ Important: Add Test Users

Your OAuth is in **test mode**. Add users here:
👉 https://console.cloud.google.com/apis/credentials/consent

Only emails you add can log in with Google!

## 🔍 Test the Flow:

1. Go to http://localhost:5173/login
2. Click "Continue with Google"
3. Select your Google account
4. ✅ You should be logged in!

## 📱 Files Modified:

**Backend:**
- ✅ `.env` - Credentials added
- ✅ `routes/auth.js` - Google OAuth routes added
- ✅ `models/User.js` - Added googleId field
- ✅ `server.js` - Initialized Passport

**Frontend:**
- ✅ `pages/Login.jsx` - Google button added
- ✅ `pages/Signup.jsx` - Google button added
- ✅ `pages/AuthCallback.jsx` - New callback handler
- ✅ `App.jsx` - New route added
- ✅ `Login.css` - Google button styles

## 🎨 What Users See:

```
┌─────────────────────────┐
│   Welcome Back          │
│   Login to your account │
├─────────────────────────┤
│   Email: [________]     │
│   Password: [________]  │
│   [Login Button]        │
│                         │
│   ────── OR ──────      │
│                         │
│   [🔵 Continue with     │
│      Google]            │
└─────────────────────────┘
```

## 🐛 Troubleshooting:

**Error: "403: access_denied"**
→ Add your email to test users in Google Console

**Can't see Google button?**
→ Check if frontend npm packages installed
→ Run: `cd frontend && npm install`

**Backend error on Google callback?**
→ Check MongoDB is running
→ Verify .env credentials match Google Console

## 🚀 Ready to Deploy?

Before going to production:
1. Get your app verified by Google
2. Update redirect URIs with production domain
3. Move from test mode to production
4. Add privacy policy URL
5. Add terms of service URL

---
💡 Need help? Check `GOOGLE_OAUTH_SETUP.md` for detailed documentation!
