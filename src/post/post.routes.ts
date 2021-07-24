import express from 'express';
import {body} from 'express-validator';
import validator from "../routes/validator.middleware";
import PostController from "./post.controller";
const router = express.Router();

const BASE_URL = '/communities' // Posts are mapped under communities

router.get(`${BASE_URL}/:communityId/posts`, PostController.list);
router.post(
  `${BASE_URL}/:communityId/posts`,
  body('body').isLength({min: 2}),
  body('title').isLength({min: 3}),
  validator,
  PostController.createPost);

router.get(`${BASE_URL}/:communityId/posts/:postId`, PostController.find)
router.post(`${BASE_URL}/:communityId/posts/:postId/approve`, PostController.approve)

export default router;
