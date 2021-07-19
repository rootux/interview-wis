import express, { Request, Response } from 'express';
import CommunityValidator from "../community/community.validator";
import { body } from 'express-validator';
import {PostService} from "./post.service";
import {Roles} from "../user/user.roles.enum";
import CommunityService from "../community/community.service";
import ValidationError from "../errors/validation.error";
const router = express.Router();

const BASE_URL = '/communities' // Posts are mapped under communities

router.get(`${BASE_URL}/:communityId/posts`, async (req: any, res: Response) => {
  const {communityId} = req.params
  await CommunityValidator(req)
  const {postService}:{postService:PostService} = req.app.locals.services
  let options = {includeAllStatus: false}
  if(req.auth.role == Roles.Moderator || req.auth.role == Roles.SuperModerator) {
    options = {includeAllStatus: true}
  }
  const posts = await postService.list(communityId, options)
  res.send(posts);
});

router.post(
  `${BASE_URL}/:communityId/posts`,
  body('body').isLength({min: 2}),
  body('title').isLength({min: 3}),
  async (req: any, res: Response) => {
    const {postService}:{postService:PostService} = req.app.locals.services
    const {communityService}:{communityService:CommunityService} = req.app.locals.services
    const {communityId} = req.params
    await CommunityValidator(req)
    const { userId } = req.auth
    let { title, summary, body } = req.body
    const isUserInCommunity = await communityService.isUserInCommunity(userId, communityId)
    if(!isUserInCommunity) { throw new ValidationError(communityId, 'User does not belong to this community')}
    const post = await postService.createPost(userId, communityId, title, body, summary)
    res.json(post)
});


export default router;
