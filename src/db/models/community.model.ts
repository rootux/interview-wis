module.exports = (sequelize: any, DataTypes: any) => {
  const Community = sequelize.define('Community', {
      title: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      memberCount: {
        type: DataTypes.VIRTUAL,
        get() {
          return `TODO sql query for member count in related table`; // TODO
        },
      }

    }
  );
  return Community;
};
