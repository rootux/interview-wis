import express, { Request, Response } from 'express';
import {UserService} from "./user.service";
const router = express.Router();

router.get('/', function(req: Request, res: Response) {

  res.send('respond with a resource');
});

//TODO: pagination
router.get('/feed', function(req: Request, res: Response) {
  const { userId }: Auth = req.auth!;
  const userFeed = UserService.getFeed(userId!);
  res.send(userFeed);
});

export default router;
