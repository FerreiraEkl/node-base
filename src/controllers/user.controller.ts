import { Request, Response } from 'express'

class UserController {
  // CRUD ===================================================================
  public async create(req: Request, res: Response): Promise<Response> {
    return res.sendStatus(200)
  }

  public async read(req: Request, res: Response): Promise<Response> {
    return res.sendStatus(200)
  }

  public async update(req: Request, res: Response): Promise<Response> {
    return res.sendStatus(200)
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    return res.sendStatus(200)
  }
}

export default new UserController()
