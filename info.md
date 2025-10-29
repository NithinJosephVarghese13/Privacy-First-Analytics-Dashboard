# Privacy-First Analytics Dashboard

## Overview
A production-ready full-stack analytics platform built with Next.js 15, PostgreSQL, and OpenAI integration. Demonstrates GDPR compliance, privacy-by-design principles, and AI-powered insights.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL (Neon) with pgvector extension
- **Auth**: NextAuth.js with OAuth (Google, GitHub)
- **AI**: OpenAI GPT-5 with RAG (Retrieval Augmented Generation)
- **Charts**: Recharts
- **Icons**: Lucide React, React Icons

## Features Implemented

### ✅ Core Features
1. **User Authentication** - NextAuth with OAuth providers
2. **Anonymous Event Tracking** - SHA-256 hashed visitor IDs, no PII storage
3. **GDPR Consent Management** - Cookie banner with opt-in consent
4. **Analytics Dashboard** - Real-time charts showing pageviews, visitors, events
5. **AI Insights Chatbot** - Natural language queries with GPT-5
6. **Data Deletion** - Admin interface for GDPR "right to erasure"
7. **Role-Based Access Control** - Admin vs Viewer roles

### 📊 Pages
- `/` - Landing page with feature overview
- `/login` - OAuth sign-in page
- `/dashboard` - Analytics dashboard with charts and stats
- `/chat` - AI chatbot for querying analytics data
- `/admin` - Admin panel for GDPR compliance and data management

### 🔌 API Endpoints
- `POST /api/track` - Log analytics events (public, rate-limited)
- `GET /api/events` - Fetch aggregated analytics (requires auth)
- `POST /api/chat` - AI insights query with RAG (requires auth)
- `POST /api/consent` - Record GDPR consent (public)
- `DELETE /api/users/[id]/delete` - GDPR data erasure (admin only)
- `GET /api/health` - Health check endpoint

## Database Schema
- **users** - Admin/viewer accounts with OAuth data
- **accounts** - NextAuth account linking
- **sessions** - NextAuth session storage
- **pages** - Tracked URLs with titles
- **events** - Anonymized analytics events (pageviews, clicks, etc.)
- **event_embeddings** - Vector embeddings for AI search (pgvector)

## Environment Variables
Required secrets:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - App URL (http://localhost:5000)
- `NEXTAUTH_SECRET` - Session encryption key
- `OPENAI_API_KEY` - OpenAI API key for AI chatbot
- `GOOGLE_CLIENT_ID` - Google OAuth (optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth (optional)
- `GITHUB_CLIENT_ID` - GitHub OAuth (optional)
- `GITHUB_CLIENT_SECRET` - GitHub OAuth (optional)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your OPENAI_API_KEY and OAuth credentials

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5000

## GDPR Compliance
- ✅ Consent-based tracking (cookie banner)
- ✅ No PII collection (anonymized visitor hashes)
- ✅ Right to access (data export capability)
- ✅ Right to erasure (data deletion endpoint)
- ✅ Data minimization (only essential tracking)
- ✅ Purpose limitation (analytics only)
- ✅ Storage limitation (manual cleanup available)

## Privacy by Design
- Visitor identification uses SHA-256 hash of IP + User Agent
- No cookies except session cookies (after consent)
- Events only tracked after explicit consent
- All data stored in EU-hosted database (Neon)

## Project Structure
```
├── app/
│   ├── (auth)/login/        # Login page
│   ├── dashboard/           # Analytics dashboard
│   ├── chat/                # AI chatbot
│   ├── admin/               # Admin panel
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ConsentBanner.tsx    # GDPR consent UI
│   ├── Navbar.tsx           # Navigation
│   └── Providers.tsx        # Session provider
├── lib/
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # NextAuth config
│   ├── openai.ts            # OpenAI integration
│   └── anonymize.ts         # Visitor anonymization
├── prisma/
│   └── schema.prisma        # Database schema
└── types/
    └── next-auth.d.ts       # TypeScript definitions
```

## Recent Changes
- 2025-10-28: Initial project setup and core features implementation

## User Preferences
- Using Next.js 15 App Router architecture
- Tailwind CSS for styling
- TypeScript for type safety
- Prisma ORM for database interactions

## Known Issues
- OAuth providers need to be configured with client IDs/secrets
- Admin role needs to be manually assigned in database
- pgvector embeddings generation script not yet implemented

## Next Steps
- Configure OAuth providers
- Implement automated embedding generation
- Add comprehensive testing
- Set up CI/CD pipeline
- Add internationalization (EN + NB)
