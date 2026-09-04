# DevConnect

DevConnect is a developer networking and portfolio platform where developers can create professional profiles, showcase their projects, share technical blogs, discover other developers, build connections, and endorse each other's skills.

## Features

- User authentication and account management
- Developer profiles with bio, skills and portfolio
- Public developer profiles
- Project creation and management
- Developer discovery and search
- Technical blog creation and publishing
- Draft and published blog posts
- Connection requests and connection management
- Skill management
- Skill endorsements
- Developer dashboard
- Responsive UI for desktop, tablet and mobile

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- Zustand
- Wouter

**Backend**
- Node.js
- Express.js
- TypeScript
- Prisma ORM

**Database**
- PostgreSQL

Getting Started
Prerequisites
Node.js
pnpm
PostgreSQL
Installation

## Clone the repository:

git clone https://github.com/Vedikaporwal/devconnect-codeanova-2026.git
cd devconnect-codeanova-2026

## Install dependencies:

pnpm install

Create the required environment variables for the backend and database.

Example:

DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

Never commit real credentials or secret keys to GitHub.

## Start the development server:

pnpm dev
API

## The backend provides REST APIs for:

Authentication
User profiles
Projects
Developer discovery
Skills
Connections
Endorsements
Blog posts

Authentication is handled using JWT-based authentication with HTTP-only cookies.

## Database

The application uses PostgreSQL with Prisma ORM.

The main database entities include:

User
Project
BlogPost
Skill
UserSkill
Connection
Endorsement
Deployment

The planned production setup is:

Frontend: Vercel
Backend: Railway
Database: Neon PostgreSQL

Live links will be added here after deployment.

Security
Passwords are securely hashed
Authentication uses HTTP-only cookies
Protected API routes require authentication
User resources include ownership checks
Request validation is performed on API inputs
Duplicate connections and endorsements are prevented

## Author

Vedika Porwal

GitHub: https://github.com/Vedikaporwal

## License

This project was developed as part of the Code-A-Nova Full Stack Development Internship Program 2026.


This version is intentionally **simple and GitHub-looking** — no emojis, no unnecessary “Application Flow” explanations, no giant marketing-style sections, and no AI-sounding wording.

One important thing: **don't commit this yet**. We should first check your actual `package.json` files so the `pnpm dev`, environment variables, API details, and deployment instructions exactly match your project.

## Project Structure

```text
devconnect-codeanova-2026/
├── artifacts/
│   ├── api-server/       # Backend API
│   ├── devconnect/       # Frontend application
│   └── mockup-sandbox/
│
├── lib/
│   ├── db/               # Database configuration
│   ├── shared/           # Shared types and contracts
│   ├── api-spec/
│   ├── api-client-react/
│   └── api-zod/
│
├── package.json
└── pnpm-workspace.yaml

Getting Started
Prerequisites
Node.js
pnpm
PostgreSQL
Installation
