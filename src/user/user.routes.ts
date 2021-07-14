import express, { Request, Response } from 'express';
import UserService from "./user.service";
import {Auth} from "./auth/auth";
import {Roles} from "./user.roles.enum";
const router = express.Router();

const BASE_URL = '/users'

router.get(`${BASE_URL}/`, (req: Request, res: Response) => {
  res.send('respond with a resource');
});

router.post(`${BASE_URL}/`, async (req: Request, res: Response) => {
  // TODO: add error handling for all req exceptions to return 400
  if(req.body === 'TODO MISSING DATA') {
    return res.status(400).send(`Missing UserAttributes`); // TODO: add some auto validator based on typescript interface
  }
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
