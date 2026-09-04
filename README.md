# DevConnect 🚀

Developer Networking & Portfolio Platform

## 📌 About
DevConnect is a full-stack developer networking platform where developers
can create profiles, showcase projects, write technical blogs, discover
other developers, connect with them, and endorse their skills.

## ✨ Features

- 🔐 User Registration & Login
- 👤 Developer Profiles
- 💼 Project Portfolio
- 🛠️ Skills Management
- 🔎 Developer Discovery
- 📝 Technical Blogs
- 🤝 Connection Requests
- ⭐ Skill Endorsements
- 📊 Developer Dashboard
- 📱 Responsive UI

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query
- Zustand

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma

### Database
- PostgreSQL
- Neon

### Deployment
- Vercel — Frontend
- Railway — Backend
- Neon — Database

## 🏗️ Architecture

[Architecture diagram here]

Frontend → Railway API → Neon PostgreSQL

## 📂 Project Structure

devconnect/
├── artifacts/
│   ├── devconnect/       # Frontend
│   └── api-server/       # Backend
├── lib/
│   ├── db/               # Prisma/database
│   ├── shared/           # Shared types
│   ├── api-spec/
│   ├── api-client-react/
│   └── api-zod/
└── package.json

## 🚀 Live Demo

Frontend: [your Vercel URL]

Backend API: [your Railway URL]

## 💻 Local Setup

git clone <GitHub repository URL>

cd devconnect-codeanova-2026

pnpm install

# Configure environment variables

# Run development server
...

## 🔑 Environment Variables

DATABASE_URL=...
JWT_SECRET=...
...

> Never commit actual secrets to GitHub.

## 📡 API

Authentication:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

Projects:
- GET /api/projects
- POST /api/projects
...

Connections:
- GET /api/connections
- POST /api/connections/:userId
- PATCH /api/connections/:id/accept
- PATCH /api/connections/:id/reject
- DELETE /api/connections/:id

Skills:
- GET /api/skills
- GET /api/users/:userId/skills
- POST /api/users/me/skills
- DELETE /api/users/me/skills/:skillId

Endorsements:
- GET /api/users/:userId/endorsements
- POST /api/users/:userId/endorsements
- DELETE /api/users/:userId/endorsements/:skillId

## 👩‍💻 Author

Vedika Porwal

## 📜 License

MIT
