import { Router } from 'express'
import userController from '@controllers/user.controller'
import authController from '@controllers/auth.controller'

const userRoutes = Router()

// CRUD ======================================================================
userRoutes.post('/', authController.isLoggedIn, userController.create)

userRoutes.get('/:id', authController.isLoggedIn, userController.read)

userRoutes.put('/:id', authController.isLoggedIn, userController.update)

userRoutes.delete('/:id', authController.isLoggedIn, authController.isAdmin, userController.delete)

export default userRoutes
