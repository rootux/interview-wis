import {Request, Response} from "express";
import Post from "../db/models/post.model";
import db from '../db/models';

export class PostService {
  static createPost = async ( req: Request, res: Response) => {
    // TODO - replace with some input validation framework
    const communityId = req.params.communityId;
    if (!req.body.post) throw new Error('No post data');
    // TODO validate body length > 3
    // TODO SECURITY: validate that communityId is of type community id
    let { title, summary, body } = req.body.post;
    if(!summary) {
      const NUMBER_OF_SUMMARY_WORDS = 100;
      summary = body.split(' ').slice(NUMBER_OF_SUMMARY_WORDS).map((s: string) => s + " ");
      summary.splice(-1,1); // remove the last ' '
    }
    await db.postPost.create({title, summary}); // TODO
    return res.send('Created post');
  }
}
