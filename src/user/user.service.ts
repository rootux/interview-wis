import {User, UserInstance} from "../db/models/user.model"
import {Op} from "sequelize"
import {Roles} from './user.roles.enum'
import {ModelCtor} from "sequelize/types/lib/model";

export default class UserService {
  private models:any

  constructor(models:any) {
    this.models = models
  }

  create(user: User) {
    const { name, email, image, country, role }:User = user
    return this.models.User.create({
      name, email, image, country, role
    })
  }

  getFeed(userId: string) {
    return `Feed for ${userId}`
  }

  getModsAndSuperMods():[User] {
    return this.models.User.findAll({
      where: {
        roles: {
          [Op.in]: [Roles.Moderator, Roles.SuperModerator]
        }
      }
    })
  }

}
