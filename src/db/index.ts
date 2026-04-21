import { drizzle } from 'drizzle-orm/node-postgres'
import Redis from 'ioredis'
import * as schema from '@/db/schema'

export const db = drizzle(process.env.DATABASE_URL!, { schema })

export const redis = new Redis(process.env.REDIS_URL!)
