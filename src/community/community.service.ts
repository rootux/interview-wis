import {ModelCtor} from "sequelize/types/lib/model";
import {UserInstance} from "../db/models/user.model";
import {Sequelize} from "sequelize";

export default class CommunityService {
  private models:{Community:any, User: ModelCtor<UserInstance>}
  private Sequelize: Sequelize;

  constructor(app:any) {
    this.models = app.locals.models
    this.Sequelize = app.locals.db.sequelize
  }

  async list(): Promise<[any]> {
    // TODO: sequential scan - probably better to keep community.members_count
    const [results] = await this.Sequelize.query(
      `SELECT community.*, COUNT(*) members_count FROM community JOIN
      user_community on user_community.community_id=community.id
      GROUP BY community.id`)
    // @ts-ignore
    return results
  }

  async join(userId:number, communityId:number) {
    const user = await this.models.User.findByPk(userId)
    const community = await this.models.Community.findByPk(communityId)
    // @ts-ignore
    return user.addCommunity(community)
  }

}
