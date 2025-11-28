import { VercelRequest, VercelResponse } from '@vercel/node'
import { eq } from 'drizzle-orm'
import { getAuth } from 'firebase-admin/auth'
import withCors from '../lib/cors'
import { db } from '../lib/db'
import setupFirebaseApp from '../lib/firebase'
import { projectsTable } from '../lib/schema'

setupFirebaseApp()

async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers['authorization']?.split('Bearer ')[1]

  if (!token) return res.status(401).json({ error: 'Unauthorized' })

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

    return res.send({ projects })
  } catch (error) {
    console.log(error)
    return res.status(401).send({ error: 'Invalid token' })
  }
}

export default withCors(handler)
