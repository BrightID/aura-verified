import { and, eq } from 'drizzle-orm'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { z } from 'zod'
import { db } from '../../lib/db'
import { projectsTable, verificationPlansTable } from '../../lib/schema'

if (!initializeApp.length) {
  initializeApp()
}

const upgradeSchema = z.object({
  planId: z.number().int()
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1]
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { uid } = await getAuth().verifyIdToken(token)
    const { planId } = upgradeSchema.parse(await req.json())

    const [project, plan] = await Promise.all([
      db
        .select({ creatorId: projectsTable.creatorId })
        .from(projectsTable)
        .where(eq(projectsTable.id, Number(params.id)))
        .limit(1),
      db
        .select({ tokens: verificationPlansTable.tokens })
        .from(verificationPlansTable)
        .where(
          and(eq(verificationPlansTable.id, planId), eq(verificationPlansTable.isActive, true))
        )
        .limit(1)
    ])

    if (!project[0] || project[0].creatorId !== uid)
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    if (!plan[0]) return Response.json({ error: 'Plan not found' }, { status: 404 })

    await db
      .update(projectsTable)
      .set({
        selectedPlanId: planId,
        remainingtokens: plan[0].tokens,
        updatedAt: new Date()
      })
      .where(eq(projectsTable.id, Number(params.id)))

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
