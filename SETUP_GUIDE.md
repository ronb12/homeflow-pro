# HomeFlow Pro - Complete Setup Guide

## 🎯 Quick Start

This guide will help you set up HomeFlow Pro with Firebase and get the application running.

## 📋 Prerequisites

- Node.js 18+ and npm installed
- A Google account for Firebase
- GitHub account (already configured)

## 🔥 Firebase Setup (Step-by-Step)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `homeflow-pro` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" provider
4. Enable "Email/Password"
5. Click "Save"

### Step 3: Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose your preferred location
5. Click "Enable"

### Step 4: Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register app with nickname: "HomeFlow Pro Web"
6. Copy the `firebaseConfig` object

### Step 5: Configure Environment Variables

1. Create a file named `.env` in the project root
2. Add the following (replace with your actual values):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 6: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Step 7: Initialize Firebase in Project

```bash
cd "/Users/ronellbradley/Desktop/HomeFlow Pro"
firebase init
```

Select:
- ✅ Firestore
- ✅ Hosting

Configuration:
- Firestore Rules: `firestore.rules` (already exists)
- Firestore Indexes: `firestore.indexes.json` (already exists)
- Public directory: `dist`
- Single-page app: `Yes`
- Set up automatic builds: `No`

### Step 8: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Step 9: Enable Firebase Hosting

```bash
firebase init hosting
```

Follow prompts and then:

```bash
npm run build
firebase deploy --only hosting
```

## 👤 Test User Setup

### Option 1: Create Test User via Firebase Console

1. Go to Firebase Console > Authentication
2. Click "Users" tab
3. Click "Add user"
4. Enter:
   - Email: `demo@homeflowpro.com`
   - Password: `HomeFlow2025!`
5. Click "Add user"

### Option 2: Create Test User via Application

1. Run the application locally: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Click "Sign Up"
4. Enter:
   - Email: `demo@homeflowpro.com`
   - Password: `HomeFlow2025!`
5. Click "Sign Up"

## 📦 Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
npm run deploy
```

## 🧪 Testing All 30 Features

### Login
1. Navigate to the app
2. Use test credentials:
   - Email: `demo@homeflowpro.com`
   - Password: `HomeFlow2025!`
3. Or click "Load Test Credentials" button

### Feature Testing Checklist

#### ✅ Core Features (1-10)
- [ ] **Dashboard** - View analytics and statistics
- [ ] **Tasks** - Add a task with priority and due date
- [ ] **Calendar** - Add an event with date and time
- [ ] **Shopping** - Add items to shopping list
- [ ] **Budget** - Add an expense and view breakdown
- [ ] **Bills** - Add a bill with due date
- [ ] **Inventory** - Add a home inventory item
- [ ] **Meals** - Plan a meal for a specific date
- [ ] **Recipes** - Add a recipe with ingredients
- [ ] **Family** - Add a family member profile

#### ✅ Household Features (11-20)
- [ ] **Chores** - Assign a chore with frequency
- [ ] **Documents** - Add a document reference
- [ ] **Contacts** - Add an emergency contact
- [ ] **Maintenance** - Schedule home maintenance
- [ ] **Warranties** - Track a warranty
- [ ] **Pets** - Add a pet profile
- [ ] **Plants** - Add a plant with watering schedule
- [ ] **Weather** - View weather widget
- [ ] **Notes** - Create a quick note
- [ ] **Vehicles** - Add a vehicle with details

#### ✅ Advanced Features (21-30)
- [ ] **Insurance** - Track an insurance policy
- [ ] **Passwords** - Store a password (encrypted)
- [ ] **Guests** - Add a guest visit
- [ ] **Energy** - Log energy usage
- [ ] **Devices** - Add a smart device
- [ ] **Packages** - Track a delivery
- [ ] **Subscriptions** - Add a subscription
- [ ] **Goals** - Set a goal with progress
- [ ] **Notifications** - Create a notification

## 🔒 Security Notes

- Never commit `.env` file to Git (already in `.gitignore`)
- Test user password should be changed in production
- Firebase security rules are already configured
- All user data is isolated by `userId`

## 🚀 Deployment

### Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy
```

Your app will be available at:
`https://YOUR_PROJECT_ID.web.app`

### GitHub Repository

Already set up at: https://github.com/ronb12/homeflow-pro

To push updates:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 📊 Firebase Collections Structure

The following Firestore collections will be created automatically:

1. `tasks` - Task management data
2. `events` - Calendar events
3. `shopping` - Shopping list items
4. `expenses` - Budget tracking
5. `bills` - Bill reminders
6. `inventory` - Home inventory
7. `meals` - Meal plans
8. `recipes` - Recipe storage
9. `family` - Family members
10. `chores` - Chore assignments
11. `documents` - Document references
12. `contacts` - Emergency contacts
13. `maintenance` - Maintenance schedules
14. `warranties` - Warranty tracking
15. `pets` - Pet profiles
16. `plants` - Plant care
17. `notes` - Quick notes
18. `vehicles` - Vehicle management
19. `insurance` - Insurance policies
20. `passwords` - Password storage (encrypted)
21. `guests` - Guest management
22. `energy` - Energy tracking
23. `devices` - Smart devices
24. `packages` - Package tracking
25. `subscriptions` - Subscription management
26. `goals` - Goal tracking
27. `notifications` - Notification center
28. `users` - User profiles

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Issues
- Check `.env` file exists and has correct values
- Verify Firebase project is created
- Ensure Authentication and Firestore are enabled

### Authentication Issues
- Verify Email/Password provider is enabled in Firebase Console
- Check that test user exists in Authentication > Users

### Deployment Issues
```bash
# Re-initialize Firebase
firebase logout
firebase login
firebase init
```

## 📞 Support

For issues or questions:
- Check the README.md for basic information
- Review Firebase Console for errors
- Check browser console for client-side errors

## 🎉 Success!

Once setup is complete, you'll have:
- ✅ Full-stack home management application
- ✅ 30 working features
- ✅ Firebase backend
- ✅ Secure authentication
- ✅ GitHub repository
- ✅ Live hosted application
- ✅ Test user for demonstration

---

**Built by Bradley Virtual Solutions, LLC**

