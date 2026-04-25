import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import * as z from 'zod'
import { getSession } from './functions'
import { authClient } from './auth-client'

export const authQueries = {
  all: () => ['auth'] as const,
  session: () =>
    queryOptions({
      queryKey: [...authQueries.all(), 'session'] as const,
      queryFn: getSession,
      meta: {
        errorToast: 'Could not refresh your session',
      },
    }),
}

export const signInSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignInInput = z.infer<typeof signInSchema>
type SignUpInput = z.infer<typeof signUpSchema>

async function signIn(value: SignInInput) {
  const { error } = await authClient.signIn.email({
    email: value.email.trim(),
    password: value.password,
  })

  if (error) {
    throw new Error(error.message || 'Sign in failed')
  }
}

async function signUp(value: SignUpInput) {
  const { error } = await authClient.signUp.email({
    name: value.name.trim(),
    email: value.email.trim(),
    password: value.password,
  })

  if (error) {
    throw new Error(error.message || 'Sign up failed')
  }
}

async function signOut() {
  const { error } = await authClient.signOut()

  if (error) {
    throw new Error(error.message || 'Sign out failed')
  }
}

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signIn,
    meta: {
      errorToast: false,
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: authQueries.session().queryKey,
      })
    },
  })
}

export function useSignUpMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signUp,
    meta: {
      errorToast: false,
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: authQueries.session().queryKey,
      })
    },
  })
}

export function useSignOutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    meta: {
      errorToast: 'Could not sign out',
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: authQueries.session().queryKey,
      })
    },
  })
}
