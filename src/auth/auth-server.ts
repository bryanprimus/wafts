import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { redisStorage } from '@better-auth/redis-storage'
import { db } from '@/db/postgres'
import { redis } from '@/db/redis'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
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
