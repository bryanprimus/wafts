import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { redisStorage } from '@better-auth/redis-storage'
import { db } from '@/db/postgres'
import { redis } from '@/db/redis'
import { env } from '@/env'

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
  secondaryStorage: redisStorage({
    client: redis,
  }),
  session: {
    storeSessionInDatabase: true,
    preserveSessionInDatabase: true,
  },
})
