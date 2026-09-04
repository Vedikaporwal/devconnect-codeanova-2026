# DevConnect

DevConnect is a developer networking and portfolio platform for sharing technical work, writing, skills, and context.

## Features

- Email/password authentication with JWTs in HTTP-only cookies
- Profile editing, public profiles, skills, projects, and project links
- Blog drafts and publishing with owner authorization
- Developer discovery by search, skill, and location
- Connection requests and skill endorsements
- Persistent real-time notifications with Socket.io
- Dashboard stats, activity, developer suggestions, and recent published blogs
- Responsive React UI with mobile navigation

## Tech Stack

React 19, Vite, TypeScript, Wouter, TanStack React Query, Zustand, Express 5, Prisma, PostgreSQL, Socket.io, Zod, pnpm workspaces.

## Project Structure

- `artifacts/devconnect`: React/Vite frontend
- `artifacts/api-server`: Express API and Socket.io server
- `lib/shared`: shared TypeScript contracts
- `lib/db`: Prisma client package
- `prisma`: schema and migrations
- `docs`: API, architecture, and demo documentation

## Getting Started

```bash
pnpm install
pnpm prisma:generate
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/devconnect run dev
```

The API is mounted at `/api`. The server requires `PORT` and the frontend requires `PORT` and `BASE_PATH` through the configured workspace workflows.

## Environment Variables

Copy `.env.example` to `.env` and provide values for:

- `DATABASE_URL`: PostgreSQL/Neon connection string
- `JWT_SECRET` or `SESSION_SECRET`: signing secret
- `CLIENT_URL`: frontend origin used by CORS and Socket.io
- `SERVER_URL`: public API URL
- `VITE_API_URL`: frontend API base, normally `/api` locally or `https://<railway-domain>/api` in production
- `PORT`, `BASE_PATH`: supplied by the deployment/workflow environment

Never commit credentials.

## API and Database

See [docs/API.md](docs/API.md) for implemented endpoints and [docs/architecture.md](docs/architecture.md) for the system diagram. Prisma migrations are applied with `pnpm exec prisma migrate deploy` in production.

## Deployment

1. Create a Neon PostgreSQL database and set `DATABASE_URL`.
2. Deploy `artifacts/api-server` to Railway with `PORT`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, and `SERVER_URL`.
3. Run `pnpm prisma:generate` and `pnpm exec prisma migrate deploy` during the backend release process.
4. Deploy `artifacts/devconnect` to Vercel with `VITE_API_URL` set to the Railway `/api` URL.
5. Set `CLIENT_URL` on Railway to the exact Vercel origin and verify cookie and Socket.io behavior over HTTPS.

No live deployment URLs or credentials are included in this repository.

## Security

Passwords are hashed with bcrypt. Authentication uses signed JWTs in HTTP-only cookies. API services enforce ownership and recipient authorization, select public fields explicitly, validate input, and return structured errors.

## Author

Code-A-Nova internship project.
