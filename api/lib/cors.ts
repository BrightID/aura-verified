import { VercelRequest, VercelResponse } from '@vercel/node'

export default function withCors(next: CallableFunction) {
  return (req: VercelRequest, res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }

    return next(req, res)
  }
}
