import { User } from '@schemas/user.schema'
import { NextFunction, Request, Response } from 'express'
import crypto from '@configs/crypto.config'
import jwt from '@configs/jwt.config'

class AuthController {
  // PASSWORD RECOVER =========================================================================================
  /*   public async recoverPassword(req: Request, res: Response) {
           return await User.findOne({
               where: {
                   userEmail: req.body.email
               }
           }).then(user => {

               if (!user)
                   return res.status(200).send();

               // USUÁRIOS INTERNOS DEVEM RECUPERAR ATRAVÉZ DA REDE WEG ============
               if (user.userIsInternalUser) {
                   emailService.notify({
                       user: user,
                       subject: "Password recover",
                       texts: [
                           "A password change request has been made for your account.",
                           "If you didn't request the change, ignore this email.",
                           "If you want to change your password please access the link below.",
                           "https://mail.weg.net/owa/auth/changepassword.aspx"
                       ]
                   });

                   return res.status(200).send();
               }

               // USUÁRIOS EXTERNOS DEVEM RECUPERAR DIRETAMENTE ====================
               crypto.createHexHash().then(async hash => {

                   // 24HRS DE VALIDADE
                   let now = new Date();
                   now.setDate(now.getDate() + 1);

                   await MailConfimation.create({
                       hash: hash,
                       maxValidate: now,
                       userId: user.id
                   }).then(() => {
                       emailService.notify({
                           user: user,
                           subject: "Password recover",
                           texts: [
                               "A password change request has been made for your account.",
                               "If you didn't request the change, ignore this email.",
                               "If you want to change your password click on the button below."
                           ],
                           linkLabel: "Change password.",
                           link: `/recover/${hash}`
                       });
                   });

                   return res.status(200).send();
               });
           }).catch(err => {
               console.log(err);

               res.sendStatus(500);
           });
       }

       public async setNewPassword(req: Request, res: Response): Promise<Response> {

           let { password, passwordConfirm, hash } = req.body;

           if (!hash)
               return res.sendStatus(400);

           if (!password || !passwordConfirm)
               return res.sendStatus(400);

           if (password != passwordConfirm)
               return res.sendStatus(400);

           return await MailConfimation.findOne({
               where: {
                   hash: hash
               }
           }).then(async confirmation => {

               if (!confirmation)
                   return res.sendStatus(404);

               return await User.update(
                   {
                       userPassword: crypto.encriptPassword(password)
                   },
                   {
                       where: {
                           id: confirmation.userId
                       }
                   }
               ).then(async affectedRows => {

                   if (affectedRows[0] === 0)
                       return res.sendStatus(404);

                   return await MailConfimation.destroy({
                       where: {
                           userId: confirmation.userId
                       }
                   }).then(() => {
                       return res.status(200).send();
                   });
               })
           }).catch(err => {
               console.log(err);
               res.sendStatus(500);
           });
       }

       public async checkRecover(req: Request, res: Response): Promise<Response> {
           return await MailConfimation.findOne({
               where: {
                   hash: req.params.hash
               }
           }).then(async confirmation => {
               if (!confirmation)
                   return res.sendStatus(401);

               return res.status(200).send();
           }).catch(err => {
               console.log(err);
               res.sendStatus(500);
           });
       }
   */
  // ACCESS REQUEST ===========================================================================================

  public async login(req: Request, res: Response): Promise<Response> {
    let { login, password } = req.body

    login = login.replace('@weg.net', '')
    login = (login as string).toLowerCase()

    return await User.findByPk(login).then(async user => {
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
