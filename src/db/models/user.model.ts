import countries from '../../user/user.countries.enum';
import {Model, Optional, Sequelize} from "sequelize";
import RolesValues,{Roles} from "../../user/user.roles.enum";

export interface User {
  id?: number;
  name: string;
  email: string;
  image: string;
  country: string;
  role?: Roles
}

interface UserCreationAttributes extends Optional<User, 'id'> {}

export interface UserInstance
  extends Model<User, UserCreationAttributes>,
    User {
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  const User = sequelize.define<UserInstance>('User', {
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
          this.setDataValue('email', val.toLowerCase());
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
        type: DataTypes.ENUM,
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
      indexes: [{unique: true, fields: ['email']}],
      freezeTableName: true
    }
  );

  // @ts-ignore
  User.associate = (models: any) => {
    // Creates UserCommunities table
    User.belongsToMany(models.Community, {
      through: 'UserCommunity',
      as: 'communities',
      foreignKey: 'userId',
      otherKey: 'communityId'
    });
  }

  return User;
};
