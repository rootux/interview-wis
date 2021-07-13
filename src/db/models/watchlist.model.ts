import {Model, Optional, Sequelize} from "sequelize";

interface WatchlistAttributes {
  id: number;
  word: string;
}

interface Watchlist extends Optional<WatchlistAttributes, 'id'> {}

interface WatchlistInstance extends Model<WatchlistAttributes, Watchlist>,
  WatchlistAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}
module.exports = (sequelize: Sequelize, DataTypes: any) => {
  return sequelize.define<WatchlistInstance>('Watchlist', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    word: {
      type: DataTypes.String,
    },
    }
  );
};
