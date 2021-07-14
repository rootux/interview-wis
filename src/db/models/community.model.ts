import {Sequelize, Model, Optional} from "sequelize";

export interface Community {
  id?: number;
  title: string;
  image: string;
  memberCount?: number;
}

interface CommunityCreationAttributes extends Optional<Community, 'id'> {}

export interface CommunityInstance
  extends Model<Community, CommunityCreationAttributes>,
    Community {
  createdAt?: Date;
  updatedAt?: Date;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  return sequelize.define<CommunityInstance>('Community', {
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
      image: {
        type: DataTypes.STRING(2083),
        allowNull: false
      },
      memberCount: {
        type: DataTypes.VIRTUAL,
        async get() {
          const communityId = this.getDataValue('id')
          const [results] = await sequelize.query(`
          SELECT COUNT(community_id) FROM user_community where community_id=${communityId}
          `);
          // @ts-ignore
          return results[0]['count'];
        },
      }

    }, {
      tableName: "community",
      underscored: true,
    }
  );
};
