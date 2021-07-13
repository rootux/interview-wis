module.exports = (sequelize: any, DataTypes: any) => {

  const Watchlist = sequelize.define('Watchlist', {
      words: {
        type: DataTypes.JSONB,
      },
    }
  );
  return Watchlist;
};
