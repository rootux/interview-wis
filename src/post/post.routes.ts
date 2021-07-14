import express, { Request, Response } from 'express';
const router = express.Router();

const BASE_URL = '/community' // Posts are mapped under communities

router.get(`${BASE_URL}/:communityId/posts`, function(req: Request, res: Response) {
  const communityId = req.params.communityId;
  res.send(`Posts for ${communityId}`);
});

router.post(`${BASE_URL}/:communityId/posts`, function(req: Request, res: Response) {
  const {postService} = req.app.locals.services
  return postService.createPost(req, res);
});


export default router;
