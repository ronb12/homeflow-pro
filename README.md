# HomeFlow Pro

![HomeFlow Pro Logo](public/logo.svg)

**Comprehensive Home Management Dashboard**

A product of **Bradley Virtual Solutions, LLC**

## Overview

HomeFlow Pro is a complete home management solution with 30 powerful features to help you organize every aspect of your home life. Built with React, TypeScript, and Firebase.

## 🚀 Features (30 Total)

1. **Dashboard** - Analytics and overview
2. **Task Management** - Track todos with priorities
3. **Calendar & Events** - Schedule and manage events
4. **Shopping Lists** - Organized shopping management
5. **Budget Tracker** - Expense tracking and analytics
6. **Bill Reminders** - Never miss a payment
7. **Home Inventory** - Track household items
8. **Meal Planning** - Plan your meals
9. **Recipe Storage** - Store and organize recipes
10. **Family Members** - Manage family profiles
11. **Chore Assignment** - Distribute household tasks
12. **Document Storage** - Organize important documents
13. **Emergency Contacts** - Quick access to contacts
14. **Maintenance Schedule** - Track home maintenance
15. **Warranty Tracking** - Keep track of warranties
16. **Pet Management** - Care for your pets
17. **Plant Care** - Plant watering reminders
18. **Weather Widget** - Current weather info
19. **Notes/Memos** - Quick note-taking
20. **Vehicle Management** - Track vehicle maintenance
21. **Insurance Tracking** - Manage policies
22. **Password Manager** - Secure password storage
23. **Guest Management** - Track visitors
24. **Energy Tracking** - Monitor utility usage
25. **Smart Home Devices** - Manage IoT devices
26. **Package Tracking** - Track deliveries
27. **Subscription Management** - Track recurring subscriptions
28. **Goal Setting** - Set and track goals
29. **Notification Center** - Centralized notifications
30. **User Authentication** - Secure login system

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Firestore, Authentication)
- **Hosting**: Firebase Hosting
- **UI**: Custom CSS with modern design
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand

## 📦 Installation

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

## 🔐 Test Credentials

**Email**: demo@homeflowpro.com  
**Password**: HomeFlow2025!

You can use these credentials to test all features without creating a new account.

## 🔧 Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Enable **Cloud Firestore**
4. Enable **Firebase Hosting**
5. Copy your Firebase configuration
6. Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

7. Install Firebase CLI and initialize:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

8. Deploy Firestore rules and indexes:

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

9. Create the test user in Firebase Console or via the app

## 📱 Usage

1. Sign in with the test credentials or create a new account
2. Explore all 30 features via the sidebar navigation
3. Add, edit, and delete items in each section
4. View analytics and insights on the dashboard
5. Customize categories and preferences

## 🎨 Features Highlights

### Dashboard
- Real-time statistics
- Visual analytics with charts
- Quick overview of all modules

### Task Management
- Priority levels (Low, Medium, High)
- Due dates
- Completion tracking

### Budget Tracker
- Expense categorization
- Visual breakdowns
- Monthly summaries

### Calendar
- Visual month view
- Event color coding
- Location tracking

### Smart Integrations
- All data synced to Firebase
- Real-time updates
- Secure user isolation

## 🔒 Security

- Firebase Authentication for secure login
- Firestore security rules enforce user data isolation
- Password fields use proper input types
- All API keys stored in environment variables

## 🌐 Deployment

The application is configured for Firebase Hosting with automatic builds:

```bash
npm run build
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## 📄 License

Copyright © 2025 Bradley Virtual Solutions, LLC. All rights reserved.

## 🤝 Support

For support, feature requests, or bug reports, please contact Bradley Virtual Solutions, LLC.

---

**Built with ❤️ by Bradley Virtual Solutions, LLC**

