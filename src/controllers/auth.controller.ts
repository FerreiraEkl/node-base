import { User } from '@schemas/user.schema'
import { NextFunction, Request, Response } from 'express'
import crypto from '@configs/crypto.config'
import jwt from '@configs/jwt.config'

class AuthController {
  public async login(req: Request, res: Response): Promise<Response> {
    let { login, password } = req.body

    login = (login as string).toLowerCase()

    return await User.findOne({
      where: { userLogin: login }
    }).then(async user => {
      if (!user) { return res.sendStatus(401) }

      if (!crypto.compare(password, user.userPassword)) { return res.sendStatus(401) }

      return await jwt.createToken(user).then(token => {
        console.log(`Authenticated (Local) -> ${user.userLogin} at ${(new Date()).toLocaleDateString('pt-Br')}`)
        return res.status(200).json(token)
      }).catch(err => {
        console.log(err)
        return res.sendStatus(500)
      })
    })
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    // usar aqui para fechar token no oauth quando disponnível
    return res.status(200).send()
  }

  // ACCESS CONTROLL ===========================================================================================
  public async isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) { return res.sendStatus(401) }

    return await jwt.verify(req.headers.authorization).then(async payload => {
      return await User.findOne({
        where: {
          userLogin: payload.sub
        }
      }).then(user => {
        if (!user) { return res.sendStatus(401) }

        req.user = user
        return next()
      })
    }).catch(err => {
      console.log(err)
      return res.sendStatus(401)
    })
  }

  // CONTROLE DE ACESSO POR PERFIL EXATO (PARA AÇÕES) ==========================================================
  public async isAdmin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    var user = <User>JSON.parse(JSON.stringify(req.user))

    if ((user.userProfile === 0)) { return next() }

    return res.sendStatus(401)
  }

  // RETORNO DE USUÁRIO AUTHENTICADO ============================================================================
  public async returnUser(req: Request, res: Response): Promise<Response> {
    var user = <User>JSON.parse(JSON.stringify(req.user))

    const UserToReturn = {
      id: user.id,
      userName: user.userName,
      userLogin: user.userLogin,
      userProfile: user.userProfile,
      userPhone: user.userPhone,
      userEmail: user.userEmail
    }

    return res.status(200).json(UserToReturn)
  }
}

export default new AuthController()
