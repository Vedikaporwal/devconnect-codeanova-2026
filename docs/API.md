# DevConnect API

Base path: `/api`. Unless marked public, endpoints require the HTTP-only `devconnect_auth` cookie. Responses use `{ success, data, message }`.

## Authentication

- `POST /auth/register` public. Body: `name`, `email`, `password`. Creates a session.
- `POST /auth/login` public. Body: `email`, `password`. Creates a session.
- `POST /auth/logout` authenticated. Clears the session cookie.
- `GET /auth/me` authenticated. Returns the current safe user.

## Users and Profile

- `GET /users/me` authenticated. Returns the current profile.
- `PUT /users/me` authenticated. Updates profile fields.
- `GET /users/discover?search=&skill=&location=` public. Returns safe developer projections.
- `GET /users/:id` public. Returns one safe public developer profile.

## Projects

- `GET /projects` authenticated. Lists the current user's projects.
- `GET /projects/:id` authenticated owner. Gets one project.
- `POST /projects` authenticated. Body: title, description, techStack, optional URLs.
- `PUT /projects/:id` authenticated owner. Updates project fields.
- `DELETE /projects/:id` authenticated owner. Deletes a project.

## Blogs

- `GET /blogs` public published posts plus the authenticated user's drafts.
- `GET /blogs/:id` public for published posts; owner-only for drafts.
- `POST /blogs` authenticated. Creates a server-owned post.
- `PUT /blogs/:id` authenticated owner. Updates a post.
- `DELETE /blogs/:id` authenticated owner. Deletes a post.

## Skills

- `GET /skills` public. Lists available skills.
- `GET /users/:userId/skills` public. Lists a user's skills.
- `POST /users/me/skills` authenticated. Body: `skillId`.
- `DELETE /users/me/skills/:skillId` authenticated. Removes the skill from the current profile.

## Connections

- `GET /connections` authenticated. Returns incoming, outgoing, accepted, and summary data.
- `POST /connections/:userId` authenticated. Sends a request.
- `PATCH /connections/:id/accept` authenticated receiver. Accepts a request.
- `PATCH /connections/:id/reject` authenticated receiver. Rejects a request.
- `DELETE /connections/:id` authenticated participant. Withdraws/removes a connection.

## Endorsements

- `GET /users/:userId/endorsements` public. Returns counts and safe endorsers.
- `POST /users/:userId/endorsements` authenticated. Body: `skillId`.
- `DELETE /users/:userId/endorsements/:skillId` authenticated endorser. Removes an endorsement.

## Notifications and Dashboard

- `GET /notifications` authenticated recipient. Returns the latest 50 notifications and unread count.
- `PATCH /notifications/:id/read` authenticated recipient. Marks one notification read.
- `PATCH /notifications/read-all` authenticated recipient. Marks all notifications read.
- `GET /dashboard` authenticated. Returns real stats, recent activity, suggestions, and recent published blogs.

## Health

- `GET /health` public.
- `GET /healthz` public.
