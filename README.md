# 🛡️ Login Auth Backend

A robust authentication API built with **Node.js**, **Express**, and **PostgreSQL**. It provides secure user management flows including OAuth, JWT authentication, and email services.

## 🚀 Live API
[https://loginauthbackend-production.up.railway.app](https://loginauthbackend-production.up.railway.app)

## ✨ Features
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Google OAuth 2.0**: Integrated Passport.js strategy for Google login.
- **Secure Sessions**: Express-session configuration with secure, HTTP-only cookies.
- **Database ORM**: **Prisma** with **PostgreSQL** (NeonDB).
- **Email Service**: Reliable email delivery using **Resend** (for password resets).
- **Security**: CORS protection, BCrypt password hashing, and Environment variable management.

## 🛠️ Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Neon)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Passport.js](https://www.passportjs.org/), [JsonWebToken](https://github.com/auth0/node-jsonwebtoken)
- **Email**: [Resend](https://resend.com/)
- **Deployment**: [Railway](https://railway.app/)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   JWT_SECRET="your_jwt_secret"
   SESSION_SECRET="your_session_secret"
   FRONTEND_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   RESEND_API_KEY="re_123456789"
   EMAIL_FROM="onboarding@resend.dev"
   ```

4. **Run Database Migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/me` - Get current user profile (Protected)

### Password Recovery
- `POST /api/auth/forgot-password` - Request password reset email
- `POST /api/auth/reset-password` - Reset password with token

## 🚢 Deployment
This project is optimized for deployment on **Railway**.
1. Push your code to GitHub.
2. Create time a new project on Railway from the repo.
3. Add all Environment Variables in the Railway dashboard.
4. Railway will automatically detect the build settings (Build Command: `npx prisma generate`).

**Note on Resend:** Ensure you verify your domain in Resend dashboard for production email delivery.
