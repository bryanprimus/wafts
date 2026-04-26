import { asc, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { ensureSession } from '@/auth/functions'
import { db } from '@/db/postgres'
import { createPostSchema } from './client'
import { posts } from './schema'
import { generateId } from 'better-auth'

export const listPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await ensureSession()

  return db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      userId: posts.userId,
    })
    .from(posts)
    .where(eq(posts.userId, session.user.id))
    .orderBy(asc(posts.title), asc(posts.id))
})

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator(createPostSchema)
  .handler(async ({ data }) => {
    const session = await ensureSession()

    const [post] = await db
      .insert(posts)
      .values({
        id: generateId(),
        title: data.title,
        description: data.description,
        userId: session.user.id,
      })
      .returning({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        userId: posts.userId,
      })

    return post
  })
