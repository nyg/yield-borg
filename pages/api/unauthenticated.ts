import type { NextApiRequest, NextApiResponse } from 'next'

import type { MessageResponse } from '@/types/api'

export default function unauthenticated(_req: NextApiRequest, res: NextApiResponse<MessageResponse>) {
   res.status(401).json({ message: 'Authentication required!' })
}
