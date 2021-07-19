import {User} from "../db/models/user.model"
import {Op} from "sequelize"
import {Roles} from './user.roles.enum'

export default class UserService {
  private models: { User: any }

  constructor(models: any) {
    this.models = models
  }

  find(userId: any) {
    return this.models.User.findByPk(userId, {include: 'communities'})
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
