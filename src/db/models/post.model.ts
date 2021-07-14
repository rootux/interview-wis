import {Model, Optional, Sequelize} from "sequelize"
import {getFirstWords} from "../../utils/utils.array";
import {PostStatus} from "./postStatus.enum";

export interface Post {
  id?: number
  title: string
  summary?: string
  body: string
  communityId: string
  length?: number
  userId: string
  status: PostStatus
}

interface PostCreationAttributes extends Optional<Post, 'id'> {}

export interface PostInstance extends Model<Post, PostCreationAttributes>,
    Post {
  createdAt?: Date
  updatedAt?: Date
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  const Post:any = sequelize.define<PostInstance>('Post', {
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
      type: DataTypes.TEXT,
      allowNull: false
    },
    communityId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'community',
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
        model: 'user',
        key: 'id'
      },
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: [PostStatus.pending, PostStatus.approved],
      defaultValue: PostStatus.pending,
      allowNull: false
    }
  }, {
    tableName: "post",
    underscored: true,
  })


  Post.registerHooks = () => {
    Post.addHook('beforeValidate', (post:any) => {
      post.dataValues.length = post.dataValues.body.length
      if(!post.dataValues.summary) {
        post.dataValues.summary = getFirstWords(post.dataValues.body, 100)
      }
    })
  }

  return Post
}
