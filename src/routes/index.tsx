import { createFileRoute } from '@tanstack/react-router'
import { noop, queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { getSession } from '@/lib/auth.functions'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import * as z from 'zod'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'

const sessionQueryOptions = () =>
  queryOptions({
    queryKey: ['session'],
    queryFn: async () => {
      const session = await getSession()
      return session
    },
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: {
    handler: ({ context }) => context.queryClient.fetchQuery(sessionQueryOptions()),
    staleReloadMode: 'blocking',
  },
})

type View = 'signin' | 'signup'

const signInSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

function Home() {
  const sessionQuery = useSuspenseQuery(sessionQueryOptions())
  const sessionData = sessionQuery.data

  const [view, setView] = useState<View>('signin')

  const signInMutation = useMutation({
    mutationFn: async (value: z.infer<typeof signInSchema>) => {
      const { error } = await authClient.signIn.email({
        email: value.email.trim(),
        password: value.password,
      })

      if (error) {
        throw new Error(error.message || 'Sign in failed')
      }
    },
    onError: (err) => {
      console.error('Oops!', { description: err.message })
    },
    onSuccess: () => {
      void sessionQuery.refetch()
    },
  })

  const signUpMutation = useMutation({
    mutationFn: async (value: z.infer<typeof signUpSchema>) => {
      const { error } = await authClient.signUp.email({
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
      })

      if (error) {
        throw new Error(error.message || 'Sign up failed')
      }
    },
    onError: (err) => {
      console.error('Oops!', { description: err.message })
    },
    onSuccess: () => {
      void sessionQuery.refetch()
    },
  })

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()

      if (error) {
        throw new Error(error.message || 'Sign out failed')
      }
    },
    onError: (err) => {
      console.error('Oops!', { description: err.message })
    },
    onSuccess: () => {
      void sessionQuery.refetch()
    },
  })

  const signInForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync(value).catch(noop)
    },
  })

  const signUpForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      await signUpMutation.mutateAsync(value).catch(noop)
    },
  })

  if (sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Signed in</h2>
          <div className="flex flex-col gap-1">
            <p>Name: {sessionData.user.name}</p>
            <p>Email: {sessionData.user.email}</p>
            <p>ID: {sessionData.user.id}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              signOutMutation.mutate()
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    )
  }

  const switchView = (v: View) => {
    setView(v)
    signInForm.reset()
    signUpForm.reset()
    signInMutation.reset()
    signUpMutation.reset()
  }

  if (view === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Sign up</h2>
          {signUpMutation.error && (
            <p className="text-sm text-destructive">{signUpMutation.error?.message}</p>
          )}
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              await signUpForm.handleSubmit()
            }}
          >
            <FieldGroup>
              <signUpForm.Field name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="name"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </signUpForm.Field>
              <signUpForm.Field name="email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="email"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </signUpForm.Field>
              <signUpForm.Field name="password">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="new-password"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </signUpForm.Field>
            </FieldGroup>

            <signUpForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Sign up'}
                  </Button>
                </Field>
              )}
            </signUpForm.Subscribe>
          </form>

          <Button type="button" variant="link" onClick={() => switchView('signin')}>
            Already have an account? Sign in
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Sign in</h2>
        {signInMutation.error && (
          <p className="text-sm text-destructive">{signInMutation.error.message}</p>
        )}
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault()
            e.stopPropagation()
            await signInForm.handleSubmit()
          }}
        >
          <FieldGroup>
            <signInForm.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="email"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </signInForm.Field>
            <signInForm.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="current-password"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </signInForm.Field>
          </FieldGroup>

          <signInForm.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </Field>
            )}
          </signInForm.Subscribe>
        </form>
        <Button type="button" variant="link" onClick={() => switchView('signup')}>
          No account? Sign up
        </Button>
      </div>
    </div>
  )
}
