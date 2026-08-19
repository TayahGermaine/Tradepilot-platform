import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  getProfile,
  getStats,
  getClientBook,
  getClientDetail,
  getRequests,
  decideRequest,
  getMarginAlerts,
} from '../controllers/brokerController.js'

const router = Router()

router.use(requireAuth, requireRole('broker'))

router.get('/profile', getProfile)
router.get('/stats', getStats)
router.get('/clients', getClientBook)
router.get('/clients/:clientId', getClientDetail)
router.get('/requests', getRequests)
router.patch('/requests/:requestId', decideRequest)
router.get('/alerts', getMarginAlerts)

export default router
