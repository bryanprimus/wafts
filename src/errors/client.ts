import { MutationCache, QueryCache } from '@tanstack/react-query'
import { isNotFound, isRedirect } from '@tanstack/react-router'
import { toast } from 'sonner'

interface ErrorHandlingMeta extends Record<string, unknown> {
  errorToast?: false | string
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: ErrorHandlingMeta
    mutationMeta: ErrorHandlingMeta
  }
}

function isControlFlowError(error: unknown) {
  return isRedirect(error) || isNotFound(error)
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong'
}

function showGlobalErrorToast(
  error: unknown,
  meta: ErrorHandlingMeta | undefined,
  fallback: string,
) {
  if (typeof window === 'undefined' || isControlFlowError(error) || meta?.errorToast === false) {
    return
  }

  const title = typeof meta?.errorToast === 'string' ? meta.errorToast : fallback
  const description = getErrorMessage(error)

  toast.error(title, {
    description: description === title ? undefined : description,
  })
}

export function createQueryErrorCache() {
  return new QueryCache({
    onError: (error, query) => {
      if (query.state.data === undefined) {
        return
      }

      showGlobalErrorToast(error, query.meta, 'Could not refresh data')
    },
  })
}

export function createMutationErrorCache() {
  return new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      showGlobalErrorToast(error, mutation.meta, 'Action failed')
    },
  })
}
