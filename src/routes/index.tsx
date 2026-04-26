import { useState } from 'react'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { getSession } from '@/auth/functions'
import { signOut } from '@/auth/client'
import { Button } from '@/design-system/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/design-system/ui/field'
import { Input } from '@/design-system/ui/input'
import { Separator } from '@/design-system/ui/separator'
import { Textarea } from '@/design-system/ui/textarea'
import { getErrorMessage } from '@/errors/client'
import { createPostSchema } from '@/posts/client'
import { createPost, listPosts } from '@/posts/functions'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: '/sign-in' })
    }

    return { user: session.user }
  },
  loader: () => listPosts(),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const createPostFn = useServerFn(createPost)
  const posts = Route.useLoaderData()
  const { user } = Route.useRouteContext()

  const [createError, setCreateError] = useState<string | null>(null)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    validators: {
      onChange: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      setCreateError(null)

      try {
        await createPostFn({ data: value })
        form.reset()
        await router.invalidate()
      } catch (error) {
        setCreateError(getErrorMessage(error))
      }
    },
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
        <header className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">Signed in</p>
            <h1 className="truncate text-xl font-semibold">{user.name}</h1>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-3">
              <span>{user.email}</span>
              <span className="truncate">ID: {user.id}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                setSignOutError(null)

                try {
                  await signOut()
                  await router.invalidate()
                } catch (error) {
                  setSignOutError(getErrorMessage(error))
                }
              }}
            >
              Sign out
            </Button>
            {signOutError && <p className="text-sm text-destructive">{signOutError}</p>}
          </div>
        </header>

        <section className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-normal">Posts</h2>
          <p className="text-sm text-muted-foreground">Drafts, notes, and updates from the app.</p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
          <form
            className="flex h-fit flex-col gap-5 rounded-lg border bg-card p-4 text-card-foreground"
            onSubmit={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              await form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-medium">Create post</h2>
              <p className="text-sm text-muted-foreground">Posting as {user.email}</p>
            </div>

            {createError && <p className="text-sm text-destructive">{createError}</p>}

            <FieldGroup>
              <form.Field name="title">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="description">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create post'}
                  </Button>
                </Field>
              )}
            </form.Subscribe>
          </form>

          <section className="flex min-w-0 flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-medium">All posts</h2>
              <span className="text-sm text-muted-foreground">{posts.length} total</span>
            </div>
            <Separator />

            {posts.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No posts yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <h3 className="truncate text-base font-medium">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">User ID: {post.userId}</p>
                    </div>
                    <p className="text-sm leading-6">{post.description}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
