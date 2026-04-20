import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

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
    return <div>Loading...</div>
  }

  if (session) {
    return (
      <div>
        <p>Signed in</p>
        <p>Name: {session.user.name}</p>
        <p>Email: {session.user.email}</p>
        <p>ID: {session.user.id}</p>
        <button
          type="button"
          onClick={async () => {
            await authClient.signOut()
            void refetch()
          }}
        >
          Sign out
        </button>
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
      <div>
        <h2>Sign up</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setLoading(true)
            const { error } = await authClient.signUp.email({ name, email, password })
            if (error) setError(error.message ?? 'Sign up failed')
            setLoading(false)
          }}
        >
          <div>
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <button type="button" onClick={() => switchView('signin')}>
          Already have an account? Sign in
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-red-400">Sign in</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setLoading(true)
          const { error } = await authClient.signIn.email({ email, password })
          if (error) setError(error.message ?? 'Sign in failed')
          setLoading(false)
        }}
      >
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <button type="button" onClick={() => switchView('signup')}>
        No account? Sign up
      </button>
    </div>
  )
}
