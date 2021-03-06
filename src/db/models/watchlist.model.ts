import {Model, Optional, Sequelize} from "sequelize";

interface WatchlistAttributes {
  id: number;
  word: string;
}

interface Watchlist extends Optional<WatchlistAttributes, 'id'> {}

export interface WatchlistInstance extends Model<WatchlistAttributes, Watchlist>,
  WatchlistAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}
module.exports = (sequelize: Sequelize, DataTypes: any) => {
  return sequelize.define<WatchlistInstance>('Watchlist', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    word: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    }, {
      tableName: "watchlist",
      underscored: true,
    }
  );
};
