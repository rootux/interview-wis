import WatchlistService from "../watchlist/watchlist.service";
import config from "../config/config";
import {PostStatus} from "../db/models/postStatus.enum";

export class PostService {
  private watchlistService: WatchlistService
  private models: any;

  constructor(watchlistService: any, models: any) {
    this.watchlistService = watchlistService
    this.models = models
  }

  list(communityId: number, {includeAllStatus}: { includeAllStatus: boolean }) {
    let where: any = {communityId}
    if (!includeAllStatus) {
      where = {
        ...where,
        status: PostStatus.approved
      }
    }
    return this.models.Post.findAll({where})
  }

  createPost = async ( userId:string, communityId: number, title:string, body:string, summary:any) => {
    const post = await this.models.Post.create({title, body, summary, userId, communityId})
    const postUrl = `${config.BACKEND_URL}/communities/${communityId}/${post.id}`
    await this.watchlistService.validateAndAlert(body, postUrl)
    return post

  }
}
