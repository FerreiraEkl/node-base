import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || ''),
    dialect: 'mysql',
    timezone: '-03:00',
    logging: false
  }
)

export { sequelize }
