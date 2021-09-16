/* eslint-disable prefer-promise-reject-errors */
import crypto from 'crypto'

class Crypto {
  private algorithm = process.env.CRYPTO_ALG || 'aes-256-ctr';
  private ENCRYPTION_KEY = process.env.CRYPTO_KEY || 'suachave';
  private IV_LENGTH = parseInt(process.env.CRYPTO_LEN || '16');

  public encriptPassword(password: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv)
    let encrypted = cipher.update(password)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
  }

  public compare(password: string, hash: string): boolean {
    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv)
    let encrypted = cipher.update(password)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    const encriptedFull = iv.toString('hex') + ':' + encrypted.toString('hex')

    if (encriptedFull === hash) {
      return true
    }

    return false
  }

  public async createHexHash(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(6, (err, hash) => {
        if (err) { return reject(err) }

        if (!hash) { return reject('error') }

        return resolve(hash.toString('hex'))
      })
    })
  }
}

export default new Crypto()
