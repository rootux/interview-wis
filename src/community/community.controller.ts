import express, { Request, Response } from 'express';
import CommunityService from "./community.service";
import CommunityValidator from "./community.validator";
const router = express.Router();

const BASE_URL = '/communities';

class CommunityController {
  static async list(req: any, res: Response) {
    const {communityService}: { communityService: CommunityService } = req.app.locals.services
    const communities = await communityService.list()
    res.send(communities);
  }

  static async join(req: any, res: Response) {
    const communityId = req.params.communityId;
    const {communityValidator}:{communityValidator:CommunityValidator} = req.app.locals.validators
    await communityValidator.validate(req)
    const {communityService}:{communityService:CommunityService} = req.app.locals.services
    const { userId } = req.auth
    const result = await communityService.join(userId, communityId)
    res.send(result)
  }
}


export default CommunityController;
