import {Model, Optional, Sequelize} from "sequelize"
import {getFirstWords} from "../../utils/utils.array";

enum PostStatus {
  pending,
  approved
}

interface PostAttributes {
  id?: number
  title: string
  summary?: string
  body: string
  communityId: string
  length: number
  userId: string
  status: PostStatus
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

interface PostInstance extends Model<PostAttributes, PostCreationAttributes>,
    PostAttributes {
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
  }, {
    freezeTableName: true
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
