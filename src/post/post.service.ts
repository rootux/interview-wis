import WatchlistService from "../watchlist/watchlist.service";
import config from "../config/config";
import {PostStatus} from "../db/models/postStatus.enum";
import ValidationError from "../errors/validation.error";
import debug from "debug";

export class PostService {
  private watchlistService: WatchlistService
  private models: any;

  constructor(watchlistService: any, models: any) {
    this.watchlistService = watchlistService
    this.models = models
  }

  find(communityId: number, postId: number, {includeAllStatus}: { includeAllStatus: boolean }) {
    let where: any = {communityId, id: postId}
    if (!includeAllStatus) {
      where = {
        ...where,
        status: PostStatus.approved
      }
    }
    return this.models.Post.findOne({where})
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

  approve = async (communityId: number, postId: number) => {
    const post = await this.models.Post.findOne({
      where: {
        id: postId,
        communityId
      }})
    if(!post) throw new ValidationError(postId, `Cant find given post ${postId} in community ${communityId}`)
    if(post.status != PostStatus.pending) throw new ValidationError(postId, "Post already approved")

    await post.update({status: PostStatus.approved})
    return {message: "Approved successfully", post}
  }
}
