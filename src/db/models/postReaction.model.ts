import { DataTypes } from 'sequelize';
import sequelize from '../db/sequelize';
import Post from './post.model';
import User from './user.model';

const PostReaction = sequelize.define('PostReaction', {
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    reactionType: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    }
  }
);
export default Post;
