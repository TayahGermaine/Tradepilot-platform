import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { stats, tools, run, actions, signals, sentiment, newsDigest } from '../controllers/aiController.js'

const router = Router()

// The AI Console page (/ai) has no role gate in the frontend, so any
// authenticated user (client, broker, or admin) can use it.
router.use(requireAuth)

router.get('/stats', stats)
router.get('/tools', tools)
router.post('/run', run)
router.get('/actions', actions)
router.get('/signals', signals)
router.get('/sentiment', sentiment)
router.get('/news-digest', newsDigest)

export default router
