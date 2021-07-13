
module.exports = (sequelize: any, DataTypes: any) => {
const Post = sequelize.define('Post', {
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
  }
);

Post.addHook('beforeUpdate', (post: any) => {
  // @ts-ignore
  post.length = post.previous.body.length;
})

return Post;
};
