import { Request, Response } from 'express'
import UserService from "./user.service"
import {Auth} from "./auth/auth"
import {Roles} from "./user.roles.enum"
import FeedService from "./feed/feed.service"
import config from "../config/config"

class UserController {
  static async find(req:any, res:Response) {
    const { userId }: Auth = req.auth!
    const {userService}:{userService:UserService} = req.app.locals.services
    const user = await userService.find(userId)
    res.send(user)
  }

  static async create (req: Request, res: Response) {
    const {name, email, image, country} = req.body
    const {userService}: { userService: UserService } = req.app.locals.services
    const user = await userService.create({name, email, image, country, role: Roles.Normal})
    res.send(user)
  }

  static async getFeed (req: any, res: Response) {
    const {userId} = req.auth!
    const {limit = config.DEFAULT_FEED_ITEMS, page = 0} = req.query
    const offset = parseInt(page, 10) * limit
    const limitSanitized = parseInt(limit, 10)
    const {feedService}: { feedService: FeedService } = req.app.locals.services
    const userFeed = await feedService.getFeed(userId, limitSanitized, offset)
    res.send(userFeed)
  }
}

export default UserController
