import express, { Request, Response, NextFunction } from 'express';
import CommunityService from "./community.service";
const router = express.Router();

const BASE_URL = '/communities';

router.get(`${BASE_URL}/`, async (req: Request, res: Response) => {
  const {communityService}:{communityService:CommunityService} = req.app.locals.services

  const communities:[any] = await communityService.list()
  res.send(communities);
});

export default router;
