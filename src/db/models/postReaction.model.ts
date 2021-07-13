import {Model, Optional, Sequelize} from "sequelize";

interface PostReactionAttributes {
  id: number;
  postId: string;
  userId: string;
  reactionType: number;
}

interface PostReactionCreationAttributes extends Optional<PostReactionAttributes, 'id'> {}

interface PostReactionInstance extends Model<PostReactionAttributes, PostReactionCreationAttributes>,
  PostReactionAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  return sequelize.define<PostReactionInstance>('PostReaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    reactionType: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    }
  }, {
    freezeTableName: true
  });
}
