import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  getStats,
  getWithdrawals,
  decideWithdrawal,
  getSystemHealth,
  getUsers,
  getUserDetail,
  updateUserRole,
  getKycQueue,
  decideKyc,
} from '../controllers/adminController.js'

const router = Router()

router.use(requireAuth, requireRole('admin'))

router.get('/stats', getStats)

router.get('/withdrawals', getWithdrawals)
router.patch('/withdrawals/:ref', decideWithdrawal)

router.get('/health', getSystemHealth)

router.get('/users', getUsers)
router.get('/users/:userId', getUserDetail)
router.patch('/users/:userId', updateUserRole)

router.get('/kyc', getKycQueue)
router.patch('/kyc/:userId', decideKyc)

export default router
