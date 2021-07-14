import countries from '../../user/user.countries.enum';
import {Model, Optional, Sequelize} from "sequelize";

interface RankByReactionAttributes {
  id: number;
  postId: string;
  ranking: number;
  country: string;
}

interface RankByReactionCreationAttributes extends Optional<RankByReactionAttributes, 'id'> {}

interface RankByReactionInstance extends Model<RankByReactionAttributes, RankByReactionCreationAttributes>,
  RankByReactionAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  return sequelize.define<RankByReactionInstance>('RankByReaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    postId: {
       type: DataTypes.INTEGER,
       references: {
         model: 'community',
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
   }, {
    tableName: "ranking_by_reaction",
    underscored: true,
  }
 );
}
