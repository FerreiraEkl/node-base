import Express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import Database from './schemas/database.schema'
import routes from './routes/api/user.routes'

class App {
    public express: Express.Application;

    constructor () {
      this.express = Express()
      this.middlewares()
      this.database()
      this.routes()
      this.exceptionHandler()
    }

    private middlewares (): void {
      this.express.use(cors({
        origin: [process.env.MAIN_URL || '']
      }))

      this.express.use(Express.json())
      this.express.use(Express.urlencoded({ extended: false }))
    }

    private database (): void {
      Database.relationShipStart()
      // Database.reset();
    }

    private routes (): void {
      // CHAMADAS DE API
      this.express.use('/api', routes)

      // ARQUIVOS STATICOS DO FRONTEND
      this.express.use(Express.static(path.resolve(__dirname, 'public')))

      // CHAMADAS DO ANGULAR
      this.express.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
      })
    }

    private exceptionHandler () {
      this.express.use(async (err: Error, req: Request, res: Response, next: any) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(err)
          return res.status(500).json(JSON.parse(JSON.stringify(err)))
        }
        // CONSTRUIR HTML DE RESPOSTA PARA O SERVER
        return res.status(500).json({ error: 'Internal server error' })
      })
    }
}

export default new App().express
