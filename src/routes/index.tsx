import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/')({
  component: Home,
})

type View = 'signin' | 'signup'

function Home() {
  const { data: session, isPending, refetch } = authClient.useSession()

  const [view, setView] = useState<View>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Signed in</h2>
          <div className="flex flex-col gap-1">
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            <p>ID: {session.user.id}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              await authClient.signOut()
              void refetch()
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
    setError(null)
    setName('')
    setEmail('')
    setPassword('')
  }

  if (view === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Sign up</h2>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form
            className="flex flex-col gap-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setError(null)
              setLoading(true)
              const { error } = await authClient.signUp.email({ name, email, password })
              if (error) setError(error.message ?? 'Sign up failed')
              setLoading(false)
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
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
        {error && <p className="text-sm text-destructive">{error}</p>}
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setLoading(true)
            const { error } = await authClient.signIn.email({ email, password })
            if (error) setError(error.message ?? 'Sign in failed')
            setLoading(false)
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <Button type="button" variant="link" onClick={() => switchView('signup')}>
          No account? Sign up
        </Button>
      </div>
    </div>
  )
}
