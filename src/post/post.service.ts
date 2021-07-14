import {Response} from "express"
import db from '../db/models/db.models'
import {getFirstWords} from "../utils/utils.array"

export class PostService {
  static createPost = async ( req: any, res: Response) => {
    // TODO - replace with some input validation framework
    const communityId = req.params.communityId
    const { userId } = req.auth
    if (!req.body.body || req.body.body.length < 3) throw new Error('Post must have a body (Bigger then 3 chars)')
    // TODO SECURITY: validate that communityId is of type community id
    let { title, summary, body } = req.body
    if(!summary || summary == '') {
      const NUMBER_OF_SUMMARY_WORDS = 100
      summary = getFirstWords(body, NUMBER_OF_SUMMARY_WORDS)
    }
    const post = await db.Post.create({title, summary, userId, communityId})
    return res.json({message: 'Created post', post})

  }
}
