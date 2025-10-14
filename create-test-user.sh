#!/bin/bash

# Create test user for HomeFlow Pro
API_KEY="AIzaSyCniKVgVSbjYdg3QMlUASpDrEYXniBK1eA"

echo "🔐 Creating test user for HomeFlow Pro..."
echo ""

# Create user
RESPONSE=$(curl -s -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "demo@homeflowpro.com",
  "password": "HomeFlow2025!",
  "returnSecureToken": true
}')

if echo "$RESPONSE" | grep -q "email"; then
    echo "✅ Test user created successfully!"
    echo ""
    echo "Email: demo@homeflowpro.com"
    echo "Password: HomeFlow2025!"
    echo ""
    echo "🎉 You can now login at:"
    echo "https://homeflow-pro-1760475179.web.app"
else
    echo "ℹ️ User may already exist. Try logging in:"
    echo ""
    echo "Email: demo@homeflowpro.com"
    echo "Password: HomeFlow2025!"
    echo ""
    echo "URL: https://homeflow-pro-1760475179.web.app"
fi

