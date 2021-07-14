import {Response} from "express"
import {getFirstWords} from "../utils/utils.array"
import WatchlistService from "../watchlist/watchlist.service";
import config from "../config/config";

export class PostService {
  private watchListService:WatchlistService
  private models: any;

  constructor(watchListService:any, models:any) {
    this.watchListService = watchListService
    this.models = models
  }

  createPost = async ( req: any, res: Response) => {
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
    const post = await this.models.Post.create({title, body, summary, userId, communityId})
    const postUrl = `${config.BACKEND_URL}/community/${communityId}/${post.id}`
    await this.watchListService.validateAndAlert(body, postUrl)
    return res.json({message: 'Created post', post})

  }
}
