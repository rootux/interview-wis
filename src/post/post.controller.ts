import { Response } from 'express';
import CommunityValidator from "../community/community.validator";
import {PostService} from "./post.service";
import ValidationError from "../errors/validation.error";
import CommunityService from "../community/community.service";
import AuthError from "../errors/auth.error";

class PostController {
  static async list(req: any, res: Response) {
    const {communityId} = req.params
    const {communityValidator}: { communityValidator: CommunityValidator } = req.app.locals.validators
    await communityValidator.validate(req)
    const {postService}: { postService: PostService } = req.app.locals.services
    let options = {includeAllStatus: false}
    if (req.auth.isMod()) {
      options = {includeAllStatus: true}
    }
    const posts = await postService.list(communityId, options)
    res.send(posts);
  }

  static async createPost(req: any, res: Response) {
    const {postService}: { postService: PostService } = req.app.locals.services
    const {communityService}: { communityService: CommunityService } = req.app.locals.services
    const {communityId} = req.params
    const {communityValidator}: { communityValidator: CommunityValidator } = req.app.locals.validators
    await communityValidator.validate(req)
    const {userId} = req.auth
    let {title, summary, body} = req.body
    const isUserInCommunity = await communityService.isUserInCommunity(userId, communityId)
    if (!isUserInCommunity) {
      throw new ValidationError(communityId, 'User does not belong to this community')
    }
    const result = await postService.createPost({userId, communityId, title, body, summary})
    res.json(result)
  }

  static async find(req: any, res: Response) {
    const {communityId, postId} = req.params
    const {postService}: { postService: PostService } = req.app.locals.services
    let options = {includeAllStatus: false}
    if (req.auth.isMod()) {
      options = {includeAllStatus: true}
    }
    const post = await postService.find(communityId, postId, options)
    if (!post) {
      throw new ValidationError(postId, "Cant find post or no permission to view this post")
    }
    res.json(post)
  }

  static async approve(req: any, res: Response) {
    // TODO create a validator like body() for auth request
    if (!req.auth.isMod()) {
      throw new AuthError()
    }
    const {communityId, postId} = req.params
    const {postService}: { postService: PostService } = req.app.locals.services
    const post = await postService.approve(communityId, postId)
    res.json(post)
  }
}

export default PostController;
