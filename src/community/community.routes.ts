import express, { Request, Response } from 'express';
import CommunityService from "./community.service";
import ValidationError from "../errors/validation.error";
const router = express.Router();

const BASE_URL = '/communities';

router.get(`${BASE_URL}/`, async (req: Request, res: Response) => {
  const {communityService}:{communityService:CommunityService} = req.app.locals.services

  const communities:[any] = await communityService.list()
  res.send(communities);
});

router.post(`${BASE_URL}/:communityId/join`, async (req: any, res: Response) => {
  const communityId = req.params.communityId;
  if(isNaN(parseInt(communityId))) {
    throw new ValidationError('communityId')
  }
  const {communityService}:{communityService:CommunityService} = req.app.locals.services
  const { userId } = req.auth
  const result = await communityService.join(userId, communityId)
  res.send(result)
})

export default router;
