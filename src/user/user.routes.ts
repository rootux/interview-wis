import express, { Request, Response } from 'express';
import UserService from "./user.service";
import {Auth} from "./auth/auth";
import {Roles} from "./user.roles.enum";
import { body, validationResult } from 'express-validator';
import countries from './user.countries.enum';

const router = express.Router();

const BASE_URL = '/users'

router.get(`${BASE_URL}/`, async (req: any, res: Response) => {
  const { userId }: Auth = req.auth!;
  const {userService}:{userService:UserService} = req.app.locals.services
  const user = await userService.find(userId);
  res.send(user);
});

router.post(`${BASE_URL}/`,
  body('name').isLength({min: 2}),
  body('email').isEmail().normalizeEmail(),
  body('image').isURL(),
  body('country').isIn(countries),

  async (req: Request, res: Response) => {
  const {name, email, image, country} = req.body;
  const {userService}:{userService:UserService} = req.app.locals.services
  const cleanedReq = {name, email, image, country, role: Roles.Normal}
  const user = await userService.create(cleanedReq);

  res.send(user)
}
)

//TODO: pagination
router.get(`${BASE_URL}/feed`, (req: any, res: Response) => {
  const { userId }: Auth = req.auth!;
  const {userService}:{userService:UserService} = req.app.locals.services
  const userFeed = userService.getFeed(userId!);
  res.send(userFeed);
})

export default router;
