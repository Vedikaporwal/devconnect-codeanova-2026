# DevConnect

DevConnect is a developer networking and portfolio platform that makes technical work and context easier to discover.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/devconnect run dev` — run the public landing page
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm prisma:generate` — generate the Prisma client from the foundation schema
- Required env: `DATABASE_URL` for Prisma; `CLIENT_URL` for API CORS

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React 19 + Vite + Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Prisma
- Validation: Zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

 - `artifacts/devconnect` — public React/Vite landing page and visual theme
 - `artifacts/api-server` — Express API, health route, controllers, services, and middleware
 - `lib/shared` — shared `ApiResponse<T>` contract
 - `lib/api-spec/openapi.yaml` — source of truth for the API contract
 - `prisma/schema.prisma` — PostgreSQL Prisma foundation; domain models are intentionally deferred

## Architecture decisions

- Day 1 uses the existing pnpm workspace's `artifacts/` and `lib/` conventions rather than adding parallel top-level client/server packages.
- The public experience is intentionally preview-only; product capabilities are not implemented until later days.
- `/api/health` returns the shared `ApiResponse<T>` envelope and `/api/healthz` remains as a compatibility alias for the scaffold.

## Product

The current product surface is a single public landing page introducing DevConnect, previewing developer profiles and team discovery, and guiding visitors toward future profile creation. Day 1 has no account or persistence flows.

## User preferences

Day 1 scope is intentionally limited to the foundation and landing page; do not add authentication or later-day product features without a new request.

## Gotchas

- Run API codegen after changing `lib/api-spec/openapi.yaml`.
- Artifact workflows provide `PORT` and `BASE_PATH`; do not run the Vite app through a root-level dev command.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
