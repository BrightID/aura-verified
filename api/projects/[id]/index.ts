import { eq } from 'drizzle-orm'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { z } from 'zod'
import { db } from '../../lib/db'
import { projectsTable } from '../../lib/schema'

if (!initializeApp.length) {
  initializeApp()
}

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(255).optional(),
  requirementLevel: z.number().int().positive().optional(),
  image: z.url().optional().nullable(),
  landingMarkdown: z.string().optional().nullable(),
  logoUrl: z.url().optional().nullable(),
  isActive: z.boolean().default(true),
  websiteUrl: z.url().optional().nullable(),
  remainingtokens: z.number().int().min(0).optional(),
  brightIdAppId: z.string().max(500).optional().nullable(),
  deadline: z.coerce.date().optional().nullable()
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1]
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { uid } = await getAuth().verifyIdToken(token)
    const body = updateSchema.parse(await req.json())

    const project = await db
      .select({ creatorId: projectsTable.creatorId })
      .from(projectsTable)
      .where(eq(projectsTable.id, Number(params.id)))
      .limit(1)

    if (!project[0] || project[0].creatorId !== uid)
      return Response.json({ error: 'Forbidden' }, { status: 403 })

    await db
      .update(projectsTable)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(projectsTable.id, Number(params.id)))

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
