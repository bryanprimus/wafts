# Wafts (Web app from the start)

Wafts is a Bun first TanStack Start template for building authenticated full-stack React apps with a vertical codebase structure.

This repository follows the [TanStack Start - Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) guide for initialization.

Refer to this [1st](https://github.com/bryanprimus/wafts/tree/27331f70ea8468ce2c2d89ccf728dd5779de7da4) commit for the exact code based on that guide.

Note that we will be using [Bun](https://bun.com/) throughout this repo. So kindly [Install Bun](https://bun.com/docs/installation) if you haven't. PostgreSQL and Redis are also required, and you can run them using your preferred method (local, Docker, or managed service).

## What's Included

- [TanStack Start](https://tanstack.com/start/latest) with React 19 and a Bun first development workflow.
- [Better Auth](https://www.better-auth.com/) setup for authentication.
- Drizzle ORM with PostgreSQL.
- Redis via `ioredis`.
- An example authenticated app flow and feature domain that you can adapt or replace.
- shadcn/ui-style design-system primitives in `src/design-system`.
- Tailwind CSS v4, animation utilities, theme initialization, and toast support.
- Reusable route error UI in `src/errors`.
- Bun based scripts, Oxlint, Oxfmt, Simple Git Hooks, and Nano Staged for local formatting and linting.

## Project Structure

```txt
src/
  auth/            Better Auth server/client setup, auth schema, and auth server functions
  db/              Drizzle Postgres client, Redis client, and schema aggregation
  design-system/   shadcn/ui components, design-system utilities, and UI primitives
  errors/          reusable app error helpers and route error UI
  posts/           example feature domain with schema, client validation, and server functions
  routes/          TanStack Router/Start route files and Better Auth API catch-all route
  env.ts           validated runtime environment schema
  router.tsx       router factory and default route error/not-found components
  styles.css       Tailwind, shadcn theme tokens, fonts, and global styles
```

## Available Scripts

- `bun dev` starts the Vite/TanStack Start dev server on port 3000.
- `bun run build` creates a production build.
- `bun run start` previews the built app with Vite.
- `bun run db:push` pushes the Drizzle schema to PostgreSQL.
- `bun run db:studio` opens Drizzle Studio.
- `bun run auth:generate` regenerates the Better Auth schema into `src/auth/schema.ts`.
- `bun run lint` and `bun run fmt:check` check code quality and formatting.

## Project Conventions

This repo includes an [AGENTS.md](./AGENTS.md) file for coding agents that documents project conventions, including repo structure, import style, and form submission patterns. Until we have proper human facing docs, you can refer to that file first before making code changes or contributing.

## Getting Started

1. Clone this repo

```bash
bunx gitpick bryanprimus/wafts
```

2. Install Dependencies

```bash
bun i
```

3. Setup Environment Variables

```bash
cp .env.example .env.local
```

> **Note:** Open `.env.local` and configure your `DATABASE_URL` and `REDIS_URL`. This template assumes you have PostgreSQL and Redis running locally or hosted elsewhere.
> Also replace `BETTER_AUTH_SECRET` with a unique secret of at least 32 characters and keep `BETTER_AUTH_URL` aligned with the app URL, such as `http://localhost:3000` in development.
>
> Runtime environment variables are validated in `src/env.ts`. Add new variables there and keep `.env.example` updated when the app needs more configuration.

<details>
<summary><b>Optional: Quick Setup with Docker</b></summary>

If you don't have Postgres and Redis installed locally, you can choose one of the two methods below to run them via Docker:

### Option A: Using Docker Compose

Create a `compose.yaml` file in the root of your project with the following content:

```yaml
services:
  postgres:
    image: postgres:18.3-alpine3.23
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: wafts_password
      POSTGRES_DB: wafts
      PGDATA: /var/lib/postgresql/data
    volumes:
      - pgdata:/var/lib/postgresql

  redis:
    image: redis:8.6.2-alpine
    ports:
      - '6379:6379'

volumes:
  pgdata:
```

Then, run the containers:

```bash
docker compose up -d
```

### Option B: Using Imperative Commands

If you prefer not to create a `compose.yaml` file, you can start the containers directly from your terminal:

for postgres:

```bash
docker run -d --name wafts-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=wafts_password -e POSTGRES_DB=wafts -e PGDATA=/var/lib/postgresql/data -p 5432:5432 -v pgdata:/var/lib/postgresql postgres:18.3-alpine3.23
```

and then for redis:

```bash
docker run -d --name wafts-redis -p 6379:6379 redis:8.6.2-alpine
```

To stop and remove these containers later:

```bash
docker rm -f wafts-postgres wafts-redis
```

If you also want to completely wipe the Postgres database data, remove the volume:

```bash
docker volume rm pgdata
```

> **Note for both options:**
> You can freely customize the ports, username, database name, and password based on your needs. Just ensure that the `DATABASE_URL` and `REDIS_URL` in your `.env.local` accurately reflect your final choices!
>
> **Example:** If you change the Postgres port to `5438` and the password to `my_secret_pass` in your `compose.yaml` or `docker run` command, your `.env.local` should be updated to align:
> `DATABASE_URL=postgresql://postgres:my_secret_pass@localhost:5438/wafts`

</details>

4. Push Database Schema

```bash
bun run db:push
```

5. Run the Development Server

```bash
bun dev
```

## License

[MIT](./LICENSE) © [bryanprimus](https://github.com/bryanprimus)
