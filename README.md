# 🎬 Movie Ranking System

A modern web application for ranking movies and TV series built with **Next.js 15**, **TypeScript**, **Prisma ORM**, **NextAuth.js**, and **PostgreSQL**.

## ✨ Features

- **🔐 Google Authentication** - Sign in with your Google account
- **📊 Top 10 Ranking** - View the most voted movies and series
- **🎯 Voting System** - Vote for your favorite titles (one vote per user per title)
- **📈 Interactive Dashboard** - Analytics with charts and statistics
- **👤 User Profiles** - View your voting history and statistics
- **📱 Responsive Design** - Works great on all devices
- **🔍 Browse Titles** - Paginated list of all movies and series

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Charts**: Recharts
- **Icons**: Lucide React
- **Container**: Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Google OAuth credentials

### 1. Clone the repository

```bash
git clone <repository-url>
cd faculdade
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/movie_ranking?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Start the database

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database on port 5432
- Adminer (database admin) on port 8080

### 5. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js routes
│   │   ├── dashboard/     # Dashboard data
│   │   ├── titles/        # Title-related APIs
│   │   ├── users/         # User-related APIs
│   │   └── votes/         # Voting APIs
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── profile/          # User profile page
│   ├── titles/           # Titles listing and details
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (Top 10)
├── components/            # Reusable React components
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── generated/            # Generated Prisma client
prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding script
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                # Start development server

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run database migrations
npm run db:seed           # Seed database with sample data
npm run db:reset          # Reset database (⚠️ deletes all data)
npm run db:studio         # Open Prisma Studio

# Production
npm run build             # Build for production
npm run start             # Start production server

# Linting
npm run lint              # Run ESLint
```

## 🎯 API Endpoints

### Authentication

- `GET/POST /api/auth/*` - NextAuth.js authentication routes

### Titles

- `GET /api/titles` - Get paginated list of titles
- `GET /api/titles/[id]` - Get title details with votes

### Votes

- `POST /api/votes` - Cast a vote for a title
- `GET /api/votes/top` - Get top 10 most voted titles

### Dashboard

- `GET /api/dashboard` - Get dashboard statistics and charts data

### Users

- `GET /api/users/[id]/votes` - Get user's voting history

## 🗄️ Database Schema

### User

- Basic user information from Google OAuth
- Tracks user votes and sessions

### Title

- Movie/series information (name, description, genre, image)
- Connected to votes for ranking

### Vote

- Links users to titles they voted for
- Ensures one vote per user per title
- Tracks voting timestamp

## 📊 Dashboard Features

1. **Statistics Cards**: Total titles, votes, and users
2. **Top 10 Bar Chart**: Most voted titles visualization
3. **Votes Evolution**: Line chart showing voting trends over time
4. **Genre Distribution**: Pie chart of votes by genre

## 🔒 Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. On approval, NextAuth creates user session
4. User can now vote and access protected pages
5. Session persists across browser sessions

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure Docker containers are running: `docker-compose ps`
- Check database logs: `docker-compose logs postgres`
- Verify DATABASE_URL in `.env` matches docker-compose settings

### Google OAuth Issues

- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Check authorized redirect URIs in Google Cloud Console
- Ensure NEXTAUTH_URL matches your development URL

### Migration Issues

```bash
# Reset database and start fresh
npm run db:reset
npm run db:seed
```

## 🚀 Deployment

### Environment Variables for Production

- Set secure NEXTAUTH_SECRET
- Update NEXTAUTH_URL to production domain
- Configure production database URL
- Set up Google OAuth for production domain

### Recommended Platforms

- **Vercel** (for Next.js app)
- **Railway/Supabase** (for PostgreSQL)
- **Docker** (for containerized deployment)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

If you encounter any issues or have questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
