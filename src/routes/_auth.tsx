import { useEffect } from 'react'
import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { getSession } from '@/auth/functions'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  useEffect(() => {
    router.clearCache()
  }, [router])

  return <Outlet />
}
