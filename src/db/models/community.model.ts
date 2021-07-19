import {Sequelize, Model, Optional} from "sequelize";

export interface Community {
  id: number;
  title: string;
  image: string;
  memberCount: number;
}

type OPTIONAL_CREATION_PARAMS = 'id' | 'memberCount'
export interface CommunityCreation extends Optional<Community, OPTIONAL_CREATION_PARAMS> {}

export interface CommunityInstance
  extends Model<Community, CommunityCreation>,
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
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      }
    }, {
      tableName: "community",
      underscored: true,
    }
  );
};
