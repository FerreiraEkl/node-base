import { Router } from 'express'
import userController from '@controllers/user.controller'
import authController from '@controllers/auth.controller'

const userRoutes = Router()

// CRUD ======================================================================
userRoutes.post('/', userController.create)

userRoutes.get('/:id', userController.read)

userRoutes.put('/:id', userController.update)

userRoutes.delete('/:id', authController.isAdmin, userController.delete)

export default userRoutes
