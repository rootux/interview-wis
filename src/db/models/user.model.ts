import countries from '../../user/user.countries.enum'
import {Model, Optional, Sequelize} from "sequelize"
import RolesValues,{Roles} from "../../user/user.roles.enum"
import {Community} from "./community.model"

export interface User {
  id: number
  name: string
  email: string
  image: string
  country: number
  role: Roles
}

export interface UserWithCommunities extends User {
  communities: Community[]
}

export interface UserCreation extends Optional<User, 'id'> {}

export interface UserInstance
  extends Model<User, UserCreation>,
    User {
  createdAt?: Date
  updatedAt?: Date
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  const User:any = sequelize.define<UserInstance>('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      name: {
        type: DataTypes.STRING(300),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(254),
        set(val: string) {
          // @ts-ignore
          this.setDataValue('email', val.toLowerCase())
        },
        unique: true,
        validate: {
          isEmail: {
            msg: 'The email you entered is invalid or is already in our system.'
          },
          max: {
            args: [254],
            msg: 'Invalid email'
          }
        }
      },
      image: {
        type: DataTypes.STRING(2083),
      },
      country: {
        type: DataTypes.INTEGER,
        values: countries,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM,
        values: RolesValues,
        defaultValue: Roles.Normal,
        allowNull: false,
      }

    }, {
      tableName: "user",
      underscored: true,
      indexes: [{unique: true, fields: ['email']}],
    }
  )

  // @ts-ignore
  User.associate = (models: any) => {
    // Creates UserCommunities table
    User.belongsToMany(models.Community, {
      through: 'user_community',
      as: 'communities',
      foreignKey: 'userId',
      otherKey: 'communityId'
    })
  }

  User.registerHooks = () => {
    User.addHook('afterDestroy', (post:any, options:any) => {
      // TODO: This should be atomic
      // TODO: remove community count -1 from all of that user communities
    })

  }

  return User
}
