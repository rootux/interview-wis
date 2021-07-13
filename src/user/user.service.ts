import db from '../db/models/db.models'
import {UserAttributes} from "../db/models/user.model"
import {Op} from "sequelize"
import roles from '../user/user.roles.enum'

export default class UserService {
  static create(userAttributes: UserAttributes) {
    const { name, email, image, country } = userAttributes
    return db.User.create({
      name, email, image, country
    })
  }

  static createWithRole(userAttributes: UserAttributes) {
    const { name, email, image, country, role } = userAttributes
    return db.User.create({
      name, email, image, country, role
    })
  }
  static getFeed(userId: string) {
    return `Feed for ${userId}`
  }

  static getModeratorsAndSuperModerators() {
    return db.User.findAll({
      where: {
        roles: {
          [Op.in]: roles
        }
      }
    })
  }

}
