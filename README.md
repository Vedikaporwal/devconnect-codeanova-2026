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
