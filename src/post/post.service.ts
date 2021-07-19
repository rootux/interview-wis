import WatchlistService from "../watchlist/watchlist.service";
import config from "../config/config";

export class PostService {
  private watchlistService:WatchlistService
  private models: any;

  constructor(watchlistService:any, models:any) {
    this.watchlistService = watchlistService
    this.models = models
  }

  createPost = async ( userId:string, communityId: number, title:string, body:string, summary:any) => {
    // TODO - replace with some input validation framework

    const post = await this.models.Post.create({title, body, summary, userId, communityId})
    const postUrl = `${config.BACKEND_URL}/communities/${communityId}/${post.id}`
    await this.watchlistService.validateAndAlert(body, postUrl)
    return post

  }
}
