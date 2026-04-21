This repository follows the [TanStack Start - Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) guide.

Refer to this [1st](https://github.com/bryanprimus/wafts/tree/27331f70ea8468ce2c2d89ccf728dd5779de7da4) commit for the exact code based on that guide.

Note that we will be using [Bun](https://bun.com/) throughout this repo. So kindly [Install Bun](https://bun.com/docs/installation) if you haven't. PostgreSQL and Redis are also required, and you can run them using your preferred method (local, Docker, or managed service).

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
    volumes:
      - pgdata:/var/lib/postgresql/data

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
docker run -d --name wafts-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=wafts_password -e POSTGRES_DB=wafts -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:18.3-alpine3.23
```

and then for redis:

```bash
docker run -d --name wafts-redis -p 6379:6379 redis:8.6.2-alpine
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
