# Intentional Safety Patterns

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
