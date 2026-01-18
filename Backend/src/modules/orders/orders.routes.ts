import { Router } from 'express'
import ordersController from './orders.controller'
import { authenticate } from '../../middlewares/auth.middleware'

const router = Router()

// All order routes require authentication
router.post('/place', authenticate, ordersController.place.bind(ordersController))
router.get('/my', authenticate, ordersController.my.bind(ordersController))
router.post('/cancel', authenticate, ordersController.cancel.bind(ordersController))

export default router
