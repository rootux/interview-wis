import {ModelCtor} from "sequelize/types/lib/model";
import {UserInstance} from "../db/models/user.model";
import {Sequelize} from "sequelize";
import {UserCommunityInstance} from "../db/models/userCommunity.model";
import debug from "debug";
import ValidationError from "../errors/validation.error";

const logger = debug('wisdo:api');

export default class CommunityService {
  private models:{Community:any, User: ModelCtor<UserInstance>, UserCommunity:ModelCtor<UserCommunityInstance>}
  private sequelize: Sequelize;

  constructor(app:any) {
    this.models = app.locals.models
    this.sequelize = app.locals.db.sequelize
  }

  async list(): Promise<[any]> {
    return this.models.Community.findAll({order: ['id']})
  }

  async exists(communityId: number | string):Promise<boolean> {
    return await this.models.Community.findByPk(communityId)
  }

  async join(userId:number, communityId:number) {
    const userCommunityParams = {
      userId: userId,
      communityId: communityId
    }
    const UserCommunity = await this.models.UserCommunity.findOne({where: userCommunityParams})
    if(UserCommunity) { throw new ValidationError('communityId',"User already joined") }

    await this.sequelize.transaction(async (t) => {
      await this.models.UserCommunity.create(userCommunityParams, {transaction: t})
      await this.models.Community.update({
        memberCount: Sequelize.literal('member_count+1')
      }, {
        where: { id: communityId},
        transaction: t
      })
    });

    return {message: 'Success'}
  }

}
