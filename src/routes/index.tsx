import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { getSession } from '@/lib/auth.functions'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import z from 'zod'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

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
  email: z.email(),
  password: z.string().min(6),
})

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
})

function Home() {
  const sessionQuery = useSuspenseQuery(sessionQueryOptions())
  const sessionData = sessionQuery.data

  const [view, setView] = useState<View>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      console.error('Oops!', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      })
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
      console.error('Oops!', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      })
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
      console.error('Oops!', {
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      })
    },
    onSuccess: () => {
      void sessionQuery.refetch()
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
    setEmail('')
    setPassword('')
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
              signUpMutation.mutate({ email, password, name })
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={signUpMutation.isPending}>
              {signUpMutation.isPending ? 'Creating account...' : 'Sign up'}
            </Button>
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
            signInMutation.mutate({ email, password })
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={signInMutation.isPending}>
            {signInMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <Button type="button" variant="link" onClick={() => switchView('signup')}>
          No account? Sign up
        </Button>
      </div>
    </div>
  )
}
