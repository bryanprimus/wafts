import { useRouter } from '@tanstack/react-router'
import { Button } from '@/design-system/ui/button'
import { getErrorMessage } from './client'

export function DefaultErrorComponent({ error }: { error: Error }) {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-destructive">Something went wrong</p>
          <h1 className="text-2xl font-semibold">We could not load this screen.</h1>
          <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
        </div>
        <Button
          type="button"
          className="w-fit"
          onClick={() => {
            void router.invalidate()
          }}
        >
          Retry
        </Button>
      </div>
    </main>
  )
}
