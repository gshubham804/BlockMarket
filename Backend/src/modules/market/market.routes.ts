import { Router } from 'express'
import marketController from './market.controller'

const router = Router()

// Public routes - no authentication required
router.get('/wholeblock', marketController.getWholeBlock.bind(marketController))
router.get('/preconf', marketController.getPreconf.bind(marketController))
router.get('/trades', marketController.getTrades.bind(marketController))

export default router
