import type { ErrorComponentProps } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { Button } from '@/design-system/ui/button'
import { getErrorMessage } from './client'

export function DefaultErrorComponent({ error, reset, info }: ErrorComponentProps) {
  const router = useRouter()
  const showDeveloperDetails = import.meta.env.DEV
  const errorStack = error instanceof Error ? error.stack : undefined
  const componentStack = info?.componentStack

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-destructive">Something went wrong</p>
          <h1 className="text-2xl font-semibold">We could not load this screen.</h1>
          <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
          <p className="text-sm text-muted-foreground">
            Try again. If the problem continues, contact support.
          </p>
        </div>
        {showDeveloperDetails && (errorStack || componentStack) && (
          <details className="rounded-md border bg-muted/30 p-3 text-sm">
            <summary className="cursor-pointer font-medium">Developer details</summary>
            <div className="mt-3 flex flex-col gap-3">
              {errorStack && (
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-background p-3 text-muted-foreground">
                  {errorStack}
                </pre>
              )}
              {componentStack && (
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-background p-3 text-muted-foreground">
                  {componentStack}
                </pre>
              )}
            </div>
          </details>
        )}
        <Button
          type="button"
          className="w-fit"
          onClick={() => {
            void router.invalidate()
            reset()
          }}
        >
          Retry
        </Button>
      </div>
    </main>
  )
}
