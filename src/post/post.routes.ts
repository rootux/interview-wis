import express, { Response } from 'express';
import CommunityValidator from "../community/community.validator";
import {body, validationResult} from 'express-validator';
import {PostService} from "./post.service";
import CommunityService from "../community/community.service";
import ValidationError from "../errors/validation.error";
import AuthError from "../errors/auth.error";
import validator from "../routes/validator.middleware";
const router = express.Router();

const BASE_URL = '/communities' // Posts are mapped under communities

router.get(`${BASE_URL}/:communityId/posts`, async (req: any, res: Response) => {
  const {communityId} = req.params
  await CommunityValidator(req)
  const {postService}:{postService:PostService} = req.app.locals.services
  let options = {includeAllStatus: false}
  if(req.auth.isMod()) {
    options = {includeAllStatus: true}
  }
  const posts = await postService.list(communityId, options)
  res.send(posts);
});

router.post(
  `${BASE_URL}/:communityId/posts`,
  body('body').isLength({min: 2}),
  body('title').isLength({min: 3}),
  validator,
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

router.get(
  `${BASE_URL}/:communityId/posts/:postId`,
  async (req: any, res: Response) => {
    const {communityId, postId} = req.params
    const {postService}:{postService:PostService} = req.app.locals.services
    let options = {includeAllStatus: false}
    if(req.auth.isMod()) {
      options = {includeAllStatus: true}
    }
    const post = await postService.find(communityId, postId, options)
    if(!post) {
      throw new ValidationError(postId, "Cant find post or no permission to view this post")
    }
    res.json(post)
  })

router.post(
  `${BASE_URL}/:communityId/posts/:postId/approve`,
  async (req: any, res: Response) => {
    // TODO create a validator like body() for auth request
    if(!req.auth.isMod()) {
      throw new AuthError()
    }
    const {communityId, postId} = req.params
    const {postService}:{postService:PostService} = req.app.locals.services
    const post = await postService.approve(communityId, postId)
    res.json(post)
  })


export default router;
