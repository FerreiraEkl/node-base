import dotenv from 'dotenv'
import app from './app'
dotenv.config()

app.listen(process.env.CONF_PORT || 3000, () => {
  console.log(`App listen on port:${process.env.CONF_PORT || 3000}`)
})
