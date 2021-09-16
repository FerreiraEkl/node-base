import { sequelize } from '@configs/sequelize.config'
import { User } from './models/user.schema'

class DataBase {
  constructor() {
    this.relationShipStart = this.relationShipStart.bind(this)
    this.reset = this.reset.bind(this)
    this.initialData = this.initialData.bind(this)

    sequelize.afterCreate(changes => {
      console.log('Database register created')
    })
  }

  public relationShipStart() {
    // INSERT HERE THE DATABASE ASSOCIATIONS
    // Model.belongsTo(OtherModel, { foreignKey: "otherModelId", as: "otherModel",onDelete: 'cascade' });
  }

  public reset() {
    // INSERT HERE THE DATABASE TABLE CREATIONS
    User.sync({ force: true }).then(() => { })
  }

  public initialData() {
    // INSERT HERE THE INITIAL DATABASE INFO
    //  Model.create({ ...})
  }
}

export default new DataBase()
