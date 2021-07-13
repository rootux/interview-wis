import express, { Request, Response } from 'express';
import UserService from "./user.service";
import {Auth} from "./auth/auth";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('respond with a resource');
});

router.post('/', async (req: Request, res: Response) => {
  // TODO: add error handling for all req exceptions to return 400
  if(req.body === 'TODO MISSING DATA') {
    return res.status(400).send(`Missing UserAttributes`); // TODO: add some auto validator based on typescript interface
  }
  const user = await UserService.create(req.body);
  res.send(user)
}
)

//TODO: pagination
router.get('/feed', (req: any, res: Response) => {
  const { userId }: Auth = req.auth!;
  const userFeed = UserService.getFeed(userId!);
  res.send(userFeed);
})

export default router;
