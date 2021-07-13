import {Sequelize, Model, Optional} from "sequelize";

interface CommunityAttributes {
  id: number;
  title: string;
  image: string;
  memberCount: number;
}

interface CommunityCreationAttributes extends Optional<CommunityAttributes, 'id'> {}

interface CommunityInstance
  extends Model<CommunityAttributes, CommunityCreationAttributes>,
    CommunityAttributes {
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
        type: DataTypes.STRING,
        allowNull: false
      },
      memberCount: {
        type: DataTypes.VIRTUAL,
        get() {
          return `TODO sql query for member count in related table`; // TODO
        },
      }

    }, {
      freezeTableName: true
    }
  );
};
