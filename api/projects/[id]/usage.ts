import { and, eq, sql } from 'drizzle-orm'
import { getAuth } from 'firebase-admin/auth'
import { db } from '../../lib/db'
import { projectsTable, verificationsTable } from '../../lib/schema'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get('authorization')?.split('Bearer ')[1]
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { uid } = await getAuth().verifyIdToken(token)
    const projectId = Number(params.id)

    // Check ownership
    const [project] = await db
      .select({ creatorId: projectsTable.creatorId })
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))

    if (!project || project.creatorId !== uid)
      return Response.json({ error: 'Forbidden' }, { status: 403 })

    // Daily verification count (last 90 days)
    const usage = await db
      .select({
        date: sql`DATE(${verificationsTable.verifiedAt})`.as('date'),
        verifications: sql<number>`COUNT(*)::int`
      })
      .from(verificationsTable)
      .where(
        and(
          eq(verificationsTable.projectId, projectId),
          sql`${verificationsTable.verifiedAt} >= CURRENT_DATE - INTERVAL '90 days'`
        )
      )
      .groupBy(sql`DATE(${verificationsTable.verifiedAt})`)
      .orderBy(sql`date`)

    const today = new Date()
    const dates = []
    for (
      let d = new Date(today);
      d >= new Date(today.setDate(today.getDate() - 89));
      d.setDate(d.getDate() - 1)
    ) {
      dates.push(new Date(d))
    }

    const filledData = dates.map((date) => {
      const iso = date.toISOString().split('T')[0]
      const found = usage.find((u) => u.date === iso)
      return {
        date: iso,
        verifications: found?.verifications || 0
      }
    })

    return Response.json({ data: filledData })
  } catch (error) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
