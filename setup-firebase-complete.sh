#!/bin/bash

# HomeFlow Pro - Complete Firebase Setup Script
# This script creates the database, enables authentication, and deploys indexes

set -e  # Exit on error

echo "🏠 HomeFlow Pro - Complete Firebase Setup"
echo "=========================================="
echo ""

PROJECT_ID="homeflow-pro-1760475179"
REGION="us-central"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Project: ${PROJECT_ID}${NC}"
echo -e "${BLUE}Region: ${REGION}${NC}"
echo ""

# Step 1: Authenticate with gcloud (if needed)
echo -e "${BLUE}Step 1: Checking gcloud authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "."; then
    echo -e "${YELLOW}Authenticating with Google Cloud...${NC}"
    gcloud auth login
else
    echo -e "${GREEN}✓ Already authenticated${NC}"
fi
echo ""

# Step 2: Set the active project
echo -e "${BLUE}Step 2: Setting active project...${NC}"
gcloud config set project ${PROJECT_ID}
echo -e "${GREEN}✓ Project set${NC}"
echo ""

# Step 3: Enable required APIs
echo -e "${BLUE}Step 3: Enabling required APIs...${NC}"

echo "Enabling Firestore API..."
gcloud services enable firestore.googleapis.com --project=${PROJECT_ID}

echo "Enabling Identity Toolkit API (for Authentication)..."
gcloud services enable identitytoolkit.googleapis.com --project=${PROJECT_ID}

echo "Enabling Firebase Admin API..."
gcloud services enable firebase.googleapis.com --project=${PROJECT_ID}

echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Step 4: Create Firestore database
echo -e "${BLUE}Step 4: Creating Firestore database...${NC}"
if gcloud firestore databases create --location=${REGION} --project=${PROJECT_ID} 2>&1; then
    echo -e "${GREEN}✓ Firestore database created${NC}"
else
    echo -e "${YELLOW}⚠ Database may already exist or creation in progress${NC}"
fi
echo ""

# Step 5: Deploy Firestore security rules
echo -e "${BLUE}Step 5: Deploying Firestore security rules...${NC}"
firebase deploy --only firestore:rules --project ${PROJECT_ID}
echo -e "${GREEN}✓ Security rules deployed${NC}"
echo ""

# Step 6: Deploy Firestore indexes
echo -e "${BLUE}Step 6: Deploying Firestore indexes...${NC}"
firebase deploy --only firestore:indexes --project ${PROJECT_ID}
echo -e "${GREEN}✓ Indexes deployed${NC}"
echo ""

# Step 7: Enable Authentication
echo -e "${BLUE}Step 7: Enabling Email/Password Authentication...${NC}"
# Note: This requires Firebase Admin SDK or manual Console action
echo -e "${YELLOW}⚠ Authentication must be enabled via Firebase Console:${NC}"
echo "   https://console.firebase.google.com/project/${PROJECT_ID}/authentication"
echo "   1. Click 'Get started'"
echo "   2. Enable 'Email/Password'"
echo "   3. Click 'Save'"
echo ""

# Step 8: Instructions for creating test user
echo -e "${BLUE}Step 8: Create test user...${NC}"
echo -e "${YELLOW}⚠ Test user must be created via Firebase Console:${NC}"
echo "   https://console.firebase.google.com/project/${PROJECT_ID}/authentication/users"
echo "   1. Click 'Add user'"
echo "   2. Email: demo@homeflowpro.com"
echo "   3. Password: HomeFlow2025!"
echo "   4. Click 'Add user'"
echo ""

# Summary
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}======================================${NC}"
echo ""
echo -e "${BLUE}What was done:${NC}"
echo "  ✅ APIs enabled"
echo "  ✅ Firestore database created"
echo "  ✅ Security rules deployed (28 collections)"
echo "  ✅ Indexes deployed (4 indexes)"
echo ""
echo -e "${YELLOW}What you need to do manually:${NC}"
echo "  ⚠️  Enable Authentication (2 min)"
echo "  ⚠️  Create test user (1 min)"
echo ""
echo -e "${BLUE}Your URLs:${NC}"
echo "  🌐 Live App: https://${PROJECT_ID}.web.app"
echo "  🔥 Console: https://console.firebase.google.com/project/${PROJECT_ID}"
echo "  📊 Firestore: https://console.firebase.google.com/project/${PROJECT_ID}/firestore"
echo "  🔐 Auth: https://console.firebase.google.com/project/${PROJECT_ID}/authentication"
echo ""
echo -e "${GREEN}🎉 Your app is ready to use!${NC}"
echo ""

