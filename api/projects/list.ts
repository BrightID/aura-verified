import { eq } from 'drizzle-orm'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { db } from '../lib/db'
import { projectsTable } from '../lib/schema'

initializeApp()

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1]
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { uid } = await getAuth().verifyIdToken(token)

    const projects = await db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        description: projectsTable.description,
        requirementLevel: projectsTable.requirementLevel,
        isActive: projectsTable.isActive,
        image: projectsTable.image,
        logoUrl: projectsTable.logoUrl,
        websiteUrl: projectsTable.websiteUrl,
        remainingtokens: projectsTable.remainingtokens,
        selectedPlanId: projectsTable.selectedPlanId,
        deadline: projectsTable.deadline,
        createdAt: projectsTable.createdAt
      })
      .from(projectsTable)
      .where(eq(projectsTable.creatorId, uid))
      .orderBy(projectsTable.createdAt)

    return Response.json({ projects })
  } catch (error) {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }
}
