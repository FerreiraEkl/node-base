import { sequelize } from '@configs/sequelize.config'
import { IUser } from '@interfaces/user.interface'
import { Association, DataTypes, Model } from 'sequelize'

class User extends Model<IUser> implements IUser {
  // PRIMARY KEYS ====================
  public id!: number;

  // STANDART ATRIBUTES ==============
  public userName!: string;
  public userLogin!: string;
  public userPassword!: string;
  public userEmail!: string;
  public userPhone?: string;
  public userProfile!: number;

  // FOREING KEYS ====================

  // DATATIMES =======================
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // ASSOCIATIONS ====================
  public static associations: {
  };
}

User.init(
  {
    userLogin: {
      type: new DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    userName: {
      type: new DataTypes.STRING(200),
      allowNull: false
    },
    userProfile: {
      type: new DataTypes.INTEGER(),
      allowNull: false
    },
    userEmail: {
      type: new DataTypes.STRING(),
      allowNull: true
    },
    userPhone: {
      type: new DataTypes.STRING(),
      allowNull: true
    },
    userPassword: {
      type: new DataTypes.STRING(),
      allowNull: true
    }
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true,
    freezeTableName: true
  }
)

export { User }
