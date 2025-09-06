# Cumorah - Secure Credentials Manager

**Cumorah** is a modern, secure credentials management application built with Next.js that allows team members to safely store and manage sensitive information with end-to-end encryption.

> ⚠️ **Private Repository** - This project is restricted to authorized team members only.

## 🚀 Features

- **🔐 Secure Authentication** - Google OAuth integration with NextAuth.js
- **🛡️ End-to-End Encryption** - AES-GCM encryption for sensitive data
- **📱 Modern UI** - Built with HeroUI components and Tailwind CSS
- **🌙 Dark Mode Support** - Theme switching with next-themes
- **📊 Database Management** - PostgreSQL with Drizzle ORM
- **⚡ Performance** - Optimized with Turbopack in development
- **🎨 Beautiful Design** - Responsive design with Framer Motion animations

## 🛠️ Tech Stack

- **Framework**: Next.js 15.0.4 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Neon
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js with Google Provider
- **UI Library**: HeroUI (Next-generation UI components)
- **Styling**: Tailwind CSS
- **Encryption**: Node.js Crypto (AES-GCM)
- **State Management**: React Context
- **Development**: Turbopack, ESLint, Prettier

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL database** (Neon recommended)
- **Google OAuth credentials**
- **Environment variables** configured

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Encryption
CMRH_ENCRYPTION_SECRET="your_encryption_secret_key"
```

## 🚀 Getting Started

1. **Clone the repository** (team members only):
   ```bash
   git clone [repository-url]
   cd cmrh-next-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   ```bash
   npm run drizzle-kit:generate
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── credentials/       # Credentials management pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable UI components
├── config/               # Configuration files
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication configuration
│   ├── db/              # Database schema and queries
│   ├── services/        # Business logic services
│   └── util/            # Utility functions (encryption, cache)
├── public/              # Static assets
├── styles/              # Global styles
└── types/               # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint and fix issues
- `npm run drizzle-kit:generate` - Generate database migrations

## 🔒 Security Features

### Encryption
- **Algorithm**: AES-256-GCM with scrypt key derivation
- **Data Encrypted**: Passwords, notes, and sensitive fields
- **Storage**: Encrypted data stored in PostgreSQL
- **Key Management**: Server-side encryption key with environment variables

### Authentication
- **Provider**: Google OAuth 2.0
- **Session Management**: JWT tokens with 24-hour expiration
- **Authorization**: User-specific data access controls

### Database Security
- **ORM**: Drizzle ORM with prepared statements
- **Relations**: Foreign key constraints with cascade delete
- **Indexing**: Optimized queries with proper indexing

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `name` - User display name
- `provider_account_id` - OAuth provider ID
- `createdAt` / `updatedAt` - Timestamps

### Credentials Table
- `id` - Primary key
- `url` - Website/service URL
- `name` - Credential name/label
- `username` - Login username
- `alternative_username` - Optional alternative username
- `password` - Encrypted password
- `note` - Encrypted notes
- `userId` - Foreign key to users table
- Encryption fields: `*_iv`, `*_authTag`

## 🤝 Contributing

This is a private project for team members only. To contribute:

1. Create a feature branch from `main`
2. Make your changes following the established code style
3. Run tests and linting: `npm run lint`
4. Submit a pull request for review

## 📝 Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Configured with Next.js and TypeScript rules
- **Prettier** - Code formatting
- **Naming**: camelCase for variables, PascalCase for components

## 🚨 Important Notes

- **Never commit** `.env.local` files
- **Always encrypt** sensitive data before database storage
- **Test encryption/decryption** functions thoroughly
- **Review security** implications of any changes

## 📧 Team Contact

For questions or issues, contact the development team through internal channels.

---

**Made with ❤️ by the Cumorah Team**