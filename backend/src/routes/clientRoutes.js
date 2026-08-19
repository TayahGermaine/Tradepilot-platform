import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import {
  getProfile,
  getPortfolio,
  getPositions,
  getWallet,
  getHoldings,
  getTransactions,
  getOrders,
  placeOrder,
  cancelOrder,
  requestDeposit,
  requestWithdrawal,
  getClientAiSignals,
  getClientTools,
  runClientAiTool,
  getKycStatus,
  submitKyc,
} from '../controllers/clientController.js'

const router = Router()

router.use(requireAuth, requireRole('client'))

router.get('/profile', getProfile)
router.get('/portfolio', getPortfolio)
router.get('/positions', getPositions)
router.get('/wallet', getWallet)
router.get('/holdings', getHoldings)
router.get('/transactions', getTransactions)

router.get('/orders', getOrders)
router.post('/orders', placeOrder)
router.delete('/orders/:orderId', cancelOrder)

router.post('/wallet/deposit', requestDeposit)
router.post('/wallet/withdraw', requestWithdrawal)

router.get('/ai/signals', getClientAiSignals)
router.get('/ai/tools', getClientTools)
router.post('/ai/run', runClientAiTool)

router.get('/kyc', getKycStatus)
router.post('/kyc', submitKyc)

export default router
