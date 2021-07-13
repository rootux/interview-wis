import express, { Request, Response, NextFunction } from 'express';
import {PostService} from "./post.service";
const router = express.Router();

router.get('/:communityId/posts', function(req: Request, res: Response) {
  const communityId = req.params.communityId;
  res.send(`Posts for ${communityId}`);
});

router.post('/:communityId/posts', function(req: Request, res: Response) {
  return PostService.createPost(req, res);
});


export default router;

//POST (body, userId, communityId)
//Community (id)
//ordered_by //
// POST //COMMUNITY
// SELECT
// JOIN user
// UserCommunities UserId, CommunityId (Primary key on both)

// SELECT * POSTS FROM USERS WHERE posts.communityId is in user.communities
