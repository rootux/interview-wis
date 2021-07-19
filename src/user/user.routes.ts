import express, { Request, Response } from 'express'
import UserService from "./user.service"
import {Auth} from "./auth/auth"
import {Roles} from "./user.roles.enum"
import {body, query, validationResult} from 'express-validator'
import countries from './user.countries.enum'
import FeedService from "./feed/feed.service"
import config from "../config/config"
import validator from "../routes/validator.middleware"

const router = express.Router()

const BASE_URL = '/users'

router.get(`${BASE_URL}/`, async (req: any, res: Response) => {
  const { userId }: Auth = req.auth!
  const {userService}:{userService:UserService} = req.app.locals.services
  const user = await userService.find(userId)
  res.send(user)
})

router.post(`${BASE_URL}/`,
  body('name').isLength({min: 2}),
  body('email').isEmail().normalizeEmail(),
  body('image').isURL(),
  body('country').isIn(countries),
  validator,

  async (req: Request, res: Response) => {
    const {name, email, image, country} = req.body
    const {userService}:{userService:UserService} = req.app.locals.services
    const cleanedReq = {name, email, image, country, role: Roles.Normal}
    const user = await userService.create(cleanedReq)
    res.send(user)
  })

router.get(`${BASE_URL}/feed`,
  [query('limit').isInt({min:0, max:1000}),
  query('page').isInt({min:0, max:100000}),
  validator],

  async (req: any, res: Response) => {
    const { userId } = req.auth!
    const { limit=config.DEFAULT_FEED_ITEMS, page=0 } = req.query
    const offset = parseInt(page, 10) * limit
    const limitSanitized = parseInt(limit, 10)
    const {feedService}:{feedService:FeedService} = req.app.locals.services
    const userFeed = await feedService.getFeed(userId, limitSanitized, offset)
    res.send(userFeed)
  })

export default router
