import {Model, Optional, Sequelize} from "sequelize";

enum PostStatus {
  pending,
  approved
}

interface PostAttributes {
  id?: number;
  title: string;
  summary: string;
  body: string;
  communityId: string;
  length: number;
  userId: string;
  status: PostStatus;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

interface PostInstance extends Model<PostAttributes, PostCreationAttributes>,
    PostAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  const Post = sequelize.define<PostInstance>('Post', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    title: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    summary: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    communityId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Community',
        key: 'id'
      },
      allowNull: false
    },
    length: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'approved'],
      defaultValue: 'pending',
      allowNull: false
    }
  });

  // @ts-ignore
  Post.registerHooks = () => {
    Post.addHook('beforeUpdate', (post: any) => {
      // @ts-ignore
      post.length = post.previous.body.length;
    })
  }

  return Post;
};
