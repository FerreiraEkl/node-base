import authController from '@controllers/auth.controller'
import { Router } from 'express'
import userRoutes from './api/user.routes'

const routes = Router()

routes.use('/user', authController.isLoggedIn, userRoutes)

export default routes
