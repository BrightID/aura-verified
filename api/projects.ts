import { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from './lib/db.js'
import { projectsTable } from './lib/schema.js'
import { eq } from 'drizzle-orm'
import withCors from './lib/cors.js'

const handler = async (req: VercelRequest, res: VercelResponse) => {
  const projects = await db.select().from(projectsTable).where(eq(projectsTable.isActive, true))

  res.send(projects)
}

export default withCors(handler)
