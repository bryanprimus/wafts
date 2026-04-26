import { createFileRoute } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/design-system/ui/button'
import { useState } from 'react'
import { Input } from '@/design-system/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/design-system/ui/field'
import { getSession } from '@/auth/functions'
import { signIn, signInSchema, signOut, signUp, signUpSchema } from '@/auth/client'
import { getErrorMessage } from '@/errors/client'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: {
    handler: () => getSession(),
    staleReloadMode: 'blocking',
  },
})

type View = 'signin' | 'signup'

function RouteComponent() {
  const router = useRouter()
  const sessionData = Route.useLoaderData()
  const sessionUser = sessionData?.user

  const [view, setView] = useState<View>('signin')
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const signInForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      setSignInError(null)

      try {
        await signIn(value)
        await router.invalidate()
      } catch (error) {
        setSignInError(getErrorMessage(error))
      }
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
      setSignUpError(null)

      try {
        await signUp(value)
        await router.invalidate()
      } catch (error) {
        setSignUpError(getErrorMessage(error))
      }
    },
  })

  if (sessionUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Signed in</h2>
          <div className="flex flex-col gap-1">
            <p>Name: {sessionUser?.name}</p>
            <p>Email: {sessionUser?.email}</p>
            <p>ID: {sessionUser?.id}</p>
          </div>
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
      </div>
    )
  }

  const switchView = (v: View) => {
    setView(v)
    signInForm.reset()
    signUpForm.reset()
    setSignInError(null)
    setSignUpError(null)
  }

  if (view === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Sign up</h2>
          {signUpError && <p className="text-sm text-destructive">{signUpError}</p>}
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
        {signInError && <p className="text-sm text-destructive">{signInError}</p>}
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
