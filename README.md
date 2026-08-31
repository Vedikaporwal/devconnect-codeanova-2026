# DevConnect

DevConnect is a developer networking and portfolio platform designed to make technical work, taste, and context easier to discover.

## Day 1 status

Complete:

- Premium responsive landing page with working navigation, CTA anchors, mobile menu, profile preview interactions, and reduced-motion support
- React + Vite + TypeScript frontend in `artifacts/devconnect`
- Express + TypeScript API in `artifacts/api-server`
- `GET /api/health` with the Day 1 response contract
- Centralized error handling, environment configuration, and CORS using `CLIENT_URL`
- Shared `ApiResponse<T>` type in `lib/shared`
- PostgreSQL-only Prisma foundation in `prisma/schema.prisma` with no domain models yet
- OpenAPI contract and generated client/Zod libraries in `lib/api-spec`, `lib/api-client-react`, and `lib/api-zod`

Authentication, OAuth, profiles, projects, blogs, search, connections, uploads, notifications, and dashboards are intentionally not part of Day 1.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in the values you need. The landing page and health endpoint do not require authentication secrets.

3. Generate the Prisma client:

   ```bash
   pnpm prisma:generate
   ```

4. Start the web app and API using the configured workflows, or run:

   ```bash
   pnpm --filter @workspace/devconnect run dev
   pnpm --filter @workspace/api-server run dev
   ```

## Useful checks

```bash
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
```

The API is routed at `/api`, and the health response is available at `/api/health`.