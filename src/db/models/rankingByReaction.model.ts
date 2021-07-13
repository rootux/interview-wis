import countries from '../../user/user.countries.enum';

module.exports = (sequelize: any, DataTypes: any) => {
  const RankByReaction = sequelize.define('RankByReaction', {
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Community',
          key: 'id'
        },
        allowNull: false
      },
      ranking: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      country: {
        type: DataTypes.ENUM,
        values: countries,
        allowNull: false
      }
    }
  );
 return RankByReaction;
}
