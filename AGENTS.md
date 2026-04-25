# Intentional Safety Patterns

## Prefer vertical repo structure

Organize code by domain or product capability, following TkDodo's vertical codebase guidance: code that changes together should live together. https://tkdodo.eu/blog/the-vertical-codebase

Keep framework-owned entry points at `src/routes`, `src/router.tsx`, `src/routeTree.gen.ts`, and global Tailwind setup in `src/styles.css`.

Use domain folders for app code:

- `src/design-system` owns shadcn/ui components, design-system hooks, and design-system utilities.
- `src/db` owns database infrastructure and schema aggregation only. Use `postgres.ts` for the Drizzle Postgres client, `redis.ts` for the Redis client, and `schema.ts` to aggregate domain schemas.
- `src/auth` owns auth setup, auth schema, auth server functions, and auth client/query APIs.
- Future features should use folders like `src/posts`, with colocated schema, server functions, query options, mutation hooks, and UI.

Within a domain:

- `functions.ts` is for TanStack Start server functions.
- `client.ts` is for the public client-side domain API, including TanStack Query `queryOptions` and mutation hooks. Best practice follows: https://tkdodo.eu/blog/the-query-options-api, https://tkdodo.eu/blog/creating-query-abstractions, https://tkdodo.eu/blog/mastering-mutations-in-react-query
- `schema.ts` is for domain-owned Drizzle schema.

Do not create new generic folders other than those listed above. If a domain has integration-specific setup that does not fit the shared baseline, name it explicitly for that domain or integration. For example, auth uses `auth-server.ts` for `betterAuth(...)` and `auth-client.ts` for `createAuthClient(...)`.

## Use namespace imports for Zod

Use `import * as z from 'zod'` for Zod imports.

`import z from 'zod'`, `import { z } from 'zod'`, and `import * as z from 'zod'` are effectively equivalent for current Zod usage and do not have a meaningful performance difference. Prefer the namespace import to keep the codebase consistent and avoid mixed import styles.

## Ignore `mutateAsync` errors in form submissions with `noop`

When submitting a `@tanstack/react-form` form, use `mutateAsync` and `await` it so `form.state.isSubmitting` stays accurate.

If the mutation error is already handled elsewhere, intentionally ignore the rejected promise with `noop` from `@tanstack/react-query`. This prevents unhandled promise rejection warnings while making the ignored error explicit.

Source: https://tkdodo.eu/blog/mastering-mutations-in-react-query#mutate-or-mutateasync

Example:

```tsx
const signUpForm = useForm({
  onSubmit: async ({ value }) => {
    await signUpMutation.mutateAsync(value).catch(noop)
  },
})
```
