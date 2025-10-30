# Privacy-First Analytics Dashboard

A production-ready, GDPR-compliant analytics platform with AI-powered insights built with Next.js 16, PostgreSQL, and OpenAI.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Core Analytics
- **Anonymous Event Tracking** - SHA-256 hashed visitor IDs, zero PII storage
- **Real-Time Dashboard** - Beautiful charts showing pageviews, visitors, and events
- **Date Range Filtering** - Last 24 hours, 7 days, 30 days, or 90 days
- **Multiple Event Types** - Track pageviews, clicks, and form submissions

### GDPR Compliance
- **Consent Banner** - Cookie consent with opt-in/opt-out tracking
- **Data Anonymization** - Visitor hashing prevents PII collection
- **Right to Erasure** - Admin interface for deleting user data
- **Transparency** - Clear privacy policy and data usage

### AI-Powered Insights
- **Natural Language Queries** - Ask questions about your analytics
- **RAG with pgvector** - Vector similarity search for relevant context
- **GPT-5 Integration** - Latest OpenAI model for intelligent responses
- **Fallback Handling** - Graceful degradation when embeddings unavailable

### Security & Auth
- **NextAuth Integration** - OAuth with Google & GitHub
- **Role-Based Access Control** - Admin and Viewer roles
- **Session Management** - Secure database sessions
- **Protected Routes** - Authentication required for sensitive pages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- OpenAI API key

### Installation

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd privacy-first-analytics
   npm install
   ```

2. **Set Up Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="http://localhost:5000"
   NEXTAUTH_SECRET="<generated-secret>"
   OPENAI_API_KEY="sk-..."
   GOOGLE_CLIENT_ID="<optional>"
   GOOGLE_CLIENT_SECRET="<optional>"
   GITHUB_CLIENT_ID="<optional>"
   GITHUB_CLIENT_SECRET="<optional>"
   ```

4. **Seed Test Data** (Optional)
   ```bash
   npm run db:seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── track/          # Event tracking endpoint
│   │   ├── events/         # Analytics data endpoint
│   │   ├── chat/           # AI chatbot endpoint
│   │   ├── consent/        # GDPR consent endpoint
│   │   ├── health/         # Health check
│   │   └── users/[id]/delete/ # Data deletion
│   ├── dashboard/          # Analytics dashboard page
│   ├── chat/               # AI chatbot page
│   ├── admin/              # Admin panel
│   ├── login/              # Sign-in page
│   └── page.tsx            # Landing page
├── components/
│   ├── ConsentBanner.tsx   # GDPR consent UI
│   ├── Navbar.tsx          # Navigation
│   └── Providers.tsx       # Session provider
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Database client
│   ├── openai.ts           # OpenAI client
│   ├── anonymize.ts        # Visitor hashing
│   └── embeddings.ts       # pgvector RAG
├── prisma/
│   └── schema.prisma       # Database schema
└── scripts/
    └── seed.ts             # Database seeding
```

## 🎯 Usage

### Track Events
```javascript
fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    page: 'https://example.com/page',
    type: 'pageview',
    title: 'Page Title',
    consentGiven: true,
    metadata: { source: 'organic' }
  })
});
```

### Query Analytics
```javascript
const response = await fetch('/api/events?startDate=2025-01-01&endDate=2025-01-31');
const { totalViews, uniqueVisitors, pageStats } = await response.json();
```

### AI Chatbot
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: 'What page had the most views this week?'
  })
});
const { answer, usedVectorSearch } = await response.json();
```

## 🗄️ Database Schema

### Core Tables
- **users** - Admin/viewer accounts with OAuth
- **accounts** - NextAuth account linking
- **sessions** - NextAuth session storage
- **pages** - Tracked URLs with titles
- **events** - Anonymized analytics events
- **event_embeddings** - Vector embeddings for AI search

### Key Features
- UUID primary keys for distributed safety
- Anonymized visitor hashing with SHA-256
- JSONB metadata for flexible event properties
- pgvector extension for similarity search
- Indexed queries for performance

## 🔒 Security & Privacy

### GDPR Compliance
✅ **Lawful Basis** - Consent (Art. 6(1)(a))  
✅ **Data Minimization** - Only essential tracking  
✅ **Purpose Limitation** - Analytics only  
✅ **Storage Limitation** - Configurable retention  
✅ **Right to Access** - Data export capability  
✅ **Right to Erasure** - Admin deletion interface  
✅ **Privacy by Design** - Anonymization by default  

### Security Measures
- SHA-256 visitor hashing (no IP storage)
- Encrypted sessions with httpOnly cookies
- Role-based access control (RBAC)
- SQL injection prevention (Prisma ORM)
- Rate limiting on public endpoints (Upstash Redis, 60 req/min per IP)
- Environment variable secrets

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed test data
```

### OAuth Setup

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:5000/api/auth/callback/google` as redirect URI
4. Add credentials to `.env`

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Add `http://localhost:5000/api/auth/callback/github` as callback URL
4. Add credentials to `.env`

## 📊 Tech Stack

- **Framework**: Next.js 15 (App Router, RSC, Server Actions)
- **Frontend**: React 19, Tailwind CSS, Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon) + pgvector
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **AI**: OpenAI GPT-5 + text-embedding-ada-002
- **Icons**: Lucide React, React Icons
- **Validation**: Zod

## 🚢 Deployment

### Environment Variables
Ensure all environment variables are set in your hosting platform:
- `DATABASE_URL`
- `NEXTAUTH_URL` (production URL)
- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`
- OAuth credentials (optional)

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run start
```

## 📝 API Documentation

### Public Endpoints
- `POST /api/track` - Log analytics event
- `POST /api/consent` - Record consent
- `GET /api/health` - Health check

### Protected Endpoints (Requires Auth)
- `GET /api/events` - Fetch analytics data
- `POST /api/chat` - AI insights query

### Admin Endpoints (Requires Admin Role)
- `DELETE /api/users/[id]/delete` - Delete user data

## 🎨 Screenshots

### Landing Page
Beautiful hero section with feature highlights

### Analytics Dashboard
Real-time charts and statistics

### AI Chat
Natural language analytics queries

### Admin Panel
GDPR compliance tools

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- OpenAI for GPT-5 and embeddings
- Neon for serverless PostgreSQL
- Vercel for hosting platform

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: your-email@example.com

---

**Built with ❤️ for privacy-conscious analytics**
