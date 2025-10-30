#!/bin/bash

# Privacy-First Analytics Demo Script
# This script runs a demo flow to showcase the analytics platform

set -e

echo "🎭 Starting Privacy-First Analytics Demo..."

# Check if the application is running
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "❌ Application is not running. Please start it first with 'npm run dev' or 'npm start'."
    exit 1
fi

echo "✅ Application is running."

# Generate some demo events
echo "📊 Generating demo events..."

# Simulate page views
curl -X POST http://localhost:5000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "pageview",
    "pageUrl": "/",
    "pageTitle": "Home Page",
    "visitorHash": "demo_visitor_1",
    "consentGiven": true
  }' > /dev/null

curl -X POST http://localhost:5000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "pageview",
    "pageUrl": "/dashboard",
    "pageTitle": "Analytics Dashboard",
    "visitorHash": "demo_visitor_1",
    "consentGiven": true
  }' > /dev/null

curl -X POST http://localhost:5000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "pageview",
    "pageUrl": "/about",
    "pageTitle": "About Us",
    "visitorHash": "demo_visitor_2",
    "consentGiven": true
  }' > /dev/null

# Simulate clicks
curl -X POST http://localhost:5000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "click",
    "pageUrl": "/",
    "pageTitle": "Home Page",
    "element": "button.cta",
    "visitorHash": "demo_visitor_1",
    "consentGiven": true
  }' > /dev/null

curl -X POST http://localhost:5000/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "click",
    "pageUrl": "/dashboard",
    "pageTitle": "Analytics Dashboard",
    "element": "select.date-range",
    "visitorHash": "demo_visitor_1",
    "consentGiven": true
  }' > /dev/null

echo "✅ Demo events generated."

# Wait a moment for processing
sleep 2

# Show analytics data (this will require authentication in real usage)
echo "📈 Demo analytics data:"
echo "Note: In a real scenario, you'd need to authenticate to access /api/events"
echo "For demo purposes, here are the generated events:"

echo ""
echo "Generated Events:"
echo "- Page view: Home Page (/) by demo_visitor_1"
echo "- Page view: Analytics Dashboard (/dashboard) by demo_visitor_1"
echo "- Page view: About Us (/about) by demo_visitor_2"
echo "- Click: CTA button on Home Page by demo_visitor_1"
echo "- Click: Date range selector on Dashboard by demo_visitor_1"

echo ""
echo "🎯 Demo complete!"
echo ""
echo "To view the dashboard:"
echo "  1. Open http://localhost:5000 in your browser"
echo "  2. Sign up or log in"
echo "  3. Navigate to /dashboard to see analytics"
echo ""
echo "To view API documentation:"
echo "  Open openapi.json or integrate with Swagger UI"
echo ""
echo "To run load tests:"
echo "  npx k6 run k6/load-test.js"