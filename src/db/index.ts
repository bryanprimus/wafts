import { drizzle } from 'drizzle-orm/node-postgres'
import Redis from 'ioredis'
import * as schema from '@/db/schema'

export const db = drizzle(process.env.DATABASE_URL!, { schema })

export const redis = new Redis({
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!),
})
