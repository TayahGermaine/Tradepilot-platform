import { Router } from 'express'
import authRoutes from './authRoutes.js'
import clientRoutes from './clientRoutes.js'
import brokerRoutes from './brokerRoutes.js'
import adminRoutes from './adminRoutes.js'
import aiRoutes from './aiRoutes.js'

const router = Router()

router.get('/', (req, res) => res.json({ name: 'TradePilot API', status: 'ok' }))

router.use('/auth', authRoutes)
router.use('/client', clientRoutes)
router.use('/broker', brokerRoutes)
router.use('/admin', adminRoutes)
router.use('/ai', aiRoutes)

export default router
