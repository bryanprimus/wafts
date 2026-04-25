# Intentional Safety Patterns

## Prefer vertical repo structure

Organize code by domain or product capability, following TkDodo's vertical codebase guidance: code that changes together should live together. https://tkdodo.eu/blog/the-vertical-codebase

Keep framework-owned entry points at `src/routes`, `src/router.tsx`, `src/routeTree.gen.ts`, and global Tailwind setup in `src/styles.css`.

Use domain folders for app code:

- `src/design-system` owns shadcn/ui components, design-system hooks, and design-system utilities.
- `src/db` owns database infrastructure and schema aggregation only. Use `postgres.ts` for the Drizzle Postgres client, `redis.ts` for the Redis client, and `schema.ts` to aggregate domain schemas.
- `src/auth` owns auth setup, auth schema, auth server functions, and auth client/query APIs.
- `src/errors` owns app-wide error taxonomy, TanStack Query error metadata, global query/mutation error side effects, and reusable route error UI.
- Future features should use folders like `src/posts`, with colocated schema, server functions, query options, mutation hooks, and UI.

Within app feature domains, use these baseline files when they match the responsibility:

- `functions.ts` is for TanStack Start server functions.
- `client.ts` is for the public client-side domain API, including TanStack Query `queryOptions` and mutation hooks. Best practice follows: https://tkdodo.eu/blog/the-query-options-api, https://tkdodo.eu/blog/creating-query-abstractions, https://tkdodo.eu/blog/mastering-mutations-in-react-query
- `schema.ts` is for domain-owned Drizzle schema.

Do not introduce alternative generic baseline filenames for app feature domains when `functions.ts`, `client.ts`, or `schema.ts` fits. Additional domain files are fine when they point to a specific domain or integration responsibility. For example, auth uses `auth-server.ts` for `betterAuth(...)` and `auth-client.ts` for `createAuthClient(...)`.

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

## Handle TanStack Query errors intentionally

Centralize Query and Mutation error side effects in `src/errors`. Do not put toast side effects in reusable domain query APIs or route components by default.

Keep `QueryClient` construction and non-error Query configuration in `src/router.tsx`, where app-level router/query wiring lives. `src/errors` may provide `QueryCache` and `MutationCache` factories for global error side effects, but it should not own unrelated QueryClient defaults.

Domain `client.ts` files should mark error behavior with TanStack Query `meta`:

- Use `meta: { errorToast: false }` for expected errors that are handled locally, especially form mutations like sign in or sign up.
- Use `meta: { errorToast: 'Human readable message' }` when a background query or mutation failure should show a global toast.
- Omit `errorToast` only when the shared fallback message is acceptable.

Blocking route data failures should flow through TanStack Router loaders and route/default `errorComponent`s. Background query failures should keep stale UI visible and may show one global toast only when cached data already exists. Redirects, not-found control flow, and server-rendered execution must not trigger browser toasts.
