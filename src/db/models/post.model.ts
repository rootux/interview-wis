import {Model, Optional, Sequelize} from "sequelize"
import {getFirstWords} from "../../utils/utils.array"
import {PostStatus} from "./postStatus.enum"
import _ from "lodash";
import ValidationError from "../../errors/validation.error";

export interface Post {
  id: number
  title: string
  summary: string
  body: string
  communityId: number
  length: number
  likes: number
  userId: number
  status: PostStatus
}

type OPTIONAL_CREATION_PARAMS = 'id' | 'summary' | 'length' | 'likes' | 'status'
export interface PostCreation extends Optional<Post, OPTIONAL_CREATION_PARAMS> {}

export interface PostInstance extends Model<Post, PostCreation>,
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
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isLessThen150Words(value:string){
          const wordCount = value.split(' ').length
          if(wordCount > 150) {
              throw new ValidationError('summary',`Summary cant be more then 150 words (${wordCount})`)
          }
        }
      }
    },
    body: {
      set(value:string){
        // @ts-ignore
        this.setDataValue('body', value)
        // @ts-ignore
        this.setDataValue('length', value?.length | 0)
      },
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
    },
    likes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    tableName: "post",
    underscored: true,
  })

  const addMissingData = (post:any) => {
    if (!post.dataValues.summary) {
      post.dataValues.summary = getFirstWords(post.dataValues.body, 100)
    }
  }

  Post.registerHooks = () => {
    Post.addHook('beforeValidate', (post:any, options:any) => {
      // If we are not updating the body - for example if we update the post status - skip this
      if (!options.fields.includes("body")) return
      addMissingData(post)
    })
    // Bulk create doesn't emit the individual beforeValidate hook
    Post.addHook('beforeBulkCreate', (posts:any[], options:any) => {
      if (!options.fields.includes("body")) return
      for (const post of posts) {
        addMissingData(post)
      }
    })
  }

  Post.pick = (post:Post) => {
    const properties = ['title','summary','body','communityId','length','userId','status','likes']
    return _.pick(post, ...properties)
  }

  return Post
}
