#!/bin/bash

# Privacy-First Analytics Setup Script
# This script sets up the development environment idempotently

set -e

echo "🚀 Setting up Privacy-First Analytics..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual configuration values."
else
    echo "✅ .env file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Setting up database..."
npm run db:push

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

# Generate embeddings (optional)
echo "🤖 Generating embeddings..."
npm run tsx scripts/generate-embeddings.ts || echo "⚠️  Embedding generation failed, but setup continues..."

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To start the production server:"
echo "  npm start"
echo ""
echo "To view the application:"
echo "  Open http://localhost:5000 in your browser"