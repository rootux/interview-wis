import {User, UserCreation, UserInstance} from "../db/models/user.model"
import {Op} from "sequelize"
import {Roles} from './user.roles.enum'
import {ModelCtor} from "sequelize/types/lib/model";

export default class UserService {
  private models: { User: ModelCtor<UserInstance> }

  constructor(models: any) {
    this.models = models
  }

  find(userId: any) {
    return this.models.User.findByPk(userId, {include: 'communities'})
  }

  create(user: UserCreation) {
    const { name, email, image, country, role }:UserCreation = user
    return this.models.User.create({
      name, email, image, country, role
    })
  }

  getFeed(userId: string) {
    return `Feed for ${userId}`
  }

  getModsAndSuperMods():Promise<User[]> {
    return this.models.User.findAll({
      where: {
        role: {
          [Op.in]: [Roles.Moderator, Roles.SuperModerator]
        }
      }
    })
  }

}
