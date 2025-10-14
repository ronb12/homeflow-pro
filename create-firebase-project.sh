#!/bin/bash

# HomeFlow Pro - Firebase Project Setup Script
# This script automates Firebase project creation and configuration

echo "🏠 HomeFlow Pro - Firebase Setup"
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_ID="homeflow-pro-${RANDOM}"
PROJECT_NAME="HomeFlow Pro"
REGION="us-central"

echo -e "${BLUE}📋 Project Configuration:${NC}"
echo "Project ID: $PROJECT_ID"
echo "Project Name: $PROJECT_NAME"
echo "Region: $REGION"
echo ""

# Step 1: Check if Firebase CLI is installed
echo -e "${BLUE}🔧 Step 1: Checking Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Firebase CLI not found. Installing...${NC}"
    npm install -g firebase-tools
else
    echo -e "${GREEN}✓ Firebase CLI is installed${NC}"
fi
echo ""

# Step 2: Login to Firebase
echo -e "${BLUE}🔐 Step 2: Firebase Login${NC}"
echo "Please complete the login in your browser..."
firebase login
echo ""

# Step 3: Create Firebase project
echo -e "${BLUE}🚀 Step 3: Creating Firebase Project...${NC}"
echo "Note: You'll need to create the project manually at:"
echo "https://console.firebase.google.com"
echo ""
echo "Use these settings:"
echo "  - Project Name: $PROJECT_NAME"
echo "  - Project ID: $PROJECT_ID (or your choice)"
echo ""
read -p "Press Enter after creating the project in Firebase Console..."
echo ""

# Step 4: Select the project
echo -e "${BLUE}📂 Step 4: Selecting Project...${NC}"
firebase use --add
echo ""

# Step 5: Initialize Firebase
echo -e "${BLUE}🔧 Step 5: Initializing Firebase...${NC}"
firebase init firestore hosting --project $PROJECT_ID
echo ""

# Step 6: Deploy Firestore rules
echo -e "${BLUE}🔒 Step 6: Deploying Firestore Security Rules...${NC}"
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
echo ""

# Step 7: Get Firebase config
echo -e "${BLUE}📝 Step 7: Getting Firebase Configuration...${NC}"
echo "Go to Firebase Console > Project Settings > Your Apps > Web"
echo "Copy your Firebase configuration and create .env file"
echo ""

# Step 8: Create .env template
echo -e "${BLUE}📄 Step 8: Creating .env template...${NC}"
cat > .env << 'EOF'
# Replace these with your actual Firebase configuration values
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF

echo -e "${GREEN}✓ .env template created${NC}"
echo -e "${YELLOW}⚠️  Edit .env file with your actual Firebase credentials!${NC}"
echo ""

# Step 9: Install dependencies
echo -e "${BLUE}📦 Step 9: Installing Dependencies...${NC}"
npm install
echo ""

# Step 10: Build the app
echo -e "${BLUE}🏗️  Step 10: Building Application...${NC}"
npm run build
echo ""

# Step 11: Deploy to Firebase Hosting
echo -e "${BLUE}🚀 Step 11: Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting
echo ""

# Final success message
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📱 Your App URLs:${NC}"
echo "Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo "Live App: https://$PROJECT_ID.web.app"
echo "Alt URL: https://$PROJECT_ID.firebaseapp.com"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "1. Enable Authentication (Email/Password) in Firebase Console"
echo "2. Create test user: demo@homeflowpro.com / HomeFlow2025!"
echo "3. Update .env with your actual Firebase credentials"
echo "4. Visit your live app URL"
echo ""
echo -e "${GREEN}🎉 HomeFlow Pro is ready!${NC}"

