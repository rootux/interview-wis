import countries from '../../user/user.countries.enum';
import Community from "./community.model";

module.exports = (sequelize: any, DataTypes: any) => {
  const User = sequelize.define('User', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        set(val: string) {
          User.setDataValue('email', val.toLowerCase())
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
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.ENUM,
        values: countries,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM,
        values: ['moderator', 'super moderator']
      }

    }, {
      indexes: [{fields: ['email']}]
    }
  );

  // Creates UserCommunities table
  User.belongsToMany(Community, {
    through: 'UserCommunity',
    as: 'communities',
    foreignKey: 'userId',
    otherKey: 'communityId'
  });

  return User;
};
