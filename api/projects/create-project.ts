import { VercelRequest, VercelResponse } from '@vercel/node'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import z from 'zod'
import withCors from '../lib/cors'
import { db } from '../lib/db'
import { projectsTable } from '../lib/schema'

if (!initializeApp.length) {
  initializeApp()
}

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  requirementLevel: z.number().int().positive(),
  image: z.url().optional(),
  landingMarkdown: z.string().optional(),
  logoUrl: z.url().optional(),
  isActive: z.boolean().optional().default(true),
  websiteUrl: z.url().optional(),
  brightIdAppId: z.string().max(500).optional(),
  deadline: z.coerce.date().optional()
})

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { uid } = await getAuth().verifyIdToken(token)
    const body = createProjectSchema.parse(req.body)

    await db.insert(projectsTable).values({
      ...body,
      creatorId: uid,
      remainingtokens: 1000
    })

    res.status(201).json({ success: true })
  } catch (error) {
    res.status(400).json({ error: (error as Error).message || 'Invalid request' })
  }
}

export default withCors(handler)
