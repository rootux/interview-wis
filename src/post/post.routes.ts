import express, { Request, Response } from 'express';
import CommunityValidator from "../community/community.validator";
import ValidationError from "../errors/validation.error";
const router = express.Router();

const BASE_URL = '/communities' // Posts are mapped under communities

router.get(`${BASE_URL}/:communityId/posts`, async (req: Request, res: Response) => {
  const {communityId} = req.params
  CommunityValidator(req)
  res.send(`Posts for ${communityId}`);
});

router.post(`${BASE_URL}/:communityId/posts`, async (req: any, res: Response) => {
  const {postService} = req.app.locals.services
  const {communityId} = req.params
  CommunityValidator(req)
  const { userId } = req.auth
  if (!req.body.body || req.body.body.length < 3) {
    throw new ValidationError('body', 'Post must have a body (Bigger then 3 chars)')
  }
  let { title, summary, body } = req.body
  const post = await postService.createPost(userId, communityId, title, body, summary)
  res.json(post)
});


export default router;
