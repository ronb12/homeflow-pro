# HomeFlow Pro - Quick Start Guide

## 🚀 Get Running in 5 Minutes!

### Step 1: Install Dependencies (1 minute)
```bash
cd "/Users/ronellbradley/Desktop/HomeFlow Pro"
npm install
```

### Step 2: Create Firebase Project (2 minutes)
1. Go to https://console.firebase.google.com
2. Click "Add project" → Name it "homeflow-pro"
3. Click through and create project

### Step 3: Enable Services (1 minute)
1. Click **Authentication** → Get started → Enable **Email/Password**
2. Click **Firestore Database** → Create database → Start in production mode
3. Click **Hosting** → Get started

### Step 4: Get Config & Set Environment (1 minute)
1. Click ⚙️ (Settings) → Project settings
2. Scroll to "Your apps" → Click web icon `</>`
3. Copy the config values
4. Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 5: Run Development Server
```bash
npm run dev
```

Visit: http://localhost:5173

### Step 6: Create Test User
1. Click "Sign Up" in the app
2. Use: demo@homeflowpro.com / HomeFlow2025!

## ✅ You're Done!

Now test all 30 features by clicking through the sidebar.

---

## 📦 Optional: Deploy to Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init
# Select: Firestore, Hosting
# Firestore rules: firestore.rules
# Firestore indexes: firestore.indexes.json
# Public directory: dist
# Single-page app: Yes

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Build and deploy
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## 🆘 Need Help?

- **Full Setup**: See SETUP_GUIDE.md
- **Testing**: See TEST_USER_GUIDE.md
- **Deployment**: See DEPLOYMENT.md
- **Overview**: See PROJECT_SUMMARY.md

---

## 📋 What You Get

✅ **30 Features**: Fully functional home management  
✅ **Firebase Backend**: Database + Auth + Hosting  
✅ **GitHub Repo**: https://github.com/ronb12/homeflow-pro  
✅ **Documentation**: Complete guides included  
✅ **Test Account**: Ready to use demo  
✅ **Production Ready**: Deploy anytime  

**Built by Bradley Virtual Solutions, LLC** 🏠

