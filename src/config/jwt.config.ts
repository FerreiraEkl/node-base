/* eslint-disable prefer-promise-reject-errors */
import JsonWebToken from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

interface JWTpayload {
  sub: number | string,
  iat: number | undefined,
  exp?: number | undefined
}

class JWT {
  private pathToKey = path.join(__dirname, '..', '..', process.env.JWT_KEY || '');
  private pubKey = fs.readFileSync(this.pathToKey, 'utf-8');

  async createToken(user: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = user.id
      const expiresIn = 24 * 60 * 60 * 1000 // HOUR * MIN * SEC * MILISEC
      const payload: JWTpayload = {
        sub: id,
        iat: Date.now()
      }

      JsonWebToken.sign(payload, this.pubKey, {
        expiresIn: expiresIn,
        algorithm: 'RS256'
      }, function (err, token) {
        if (err) { return reject(err) }

        return resolve(`Bearer ${token}`)
      })
    })
  }

  async verify(token: string): Promise<JWTpayload> {
    token = token.replace('Bearer ', '')

    return new Promise((resolve, reject) => {
      JsonWebToken.verify(token, this.pubKey, { algorithms: ['RS256'] }, function (err, payload) {
        if (err) { return reject('JWT Error: ' + err.message) }

        if (!payload || !payload.sub || !payload.exp) { return reject('JWT Error: ' + 'Invalid payload') }

        const now = Date.now()

        if (now > payload.exp) { return reject('JWT Error: ' + 'Expired token') }

        return resolve({
          sub: payload.sub,
          iat: payload.iat,
          exp: payload.exp
        })
      })
    })
  }
}

export default new JWT()
