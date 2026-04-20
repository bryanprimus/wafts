This repository follows the [TanStack Start - Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch) guide.

Refer to this [1st](https://github.com/bryanprimus/wafts/tree/27331f70ea8468ce2c2d89ccf728dd5779de7da4) commit for the exact code based on that guide.

Note that we will be using [Bun](https://bun.com/) and [Docker](https://www.docker.com/) throughout this repo. So kindly [Install Bun](https://bun.com/docs/installation) and [Install Docker Desktop](https://docs.docker.com/get-docker/) if you haven't.

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

4. Start Docker Containers for Postgres and Redis

```bash
docker compose up -d
```

5. Push Database Schema

```bash
bun run db:push
```

6. Run the Development Server

```bash
bun dev
```

## License

[MIT](./LICENSE) © [bryanprimus](https://github.com/bryanprimus)
