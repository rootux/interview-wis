import {Sequelize} from "sequelize";
import app from "../../app";
import {User, UserWithCommunities} from "../../db/models/user.model";
import {Post} from "../../db/models/post.model";

export default class FeedService {
  private models: any
  private sequelize: Sequelize;

  constructor(app:any) {
    this.models = app.locals.models
    this.sequelize = app.locals.db.sequelize
  }

  private REACTION_PERCENTAGE = 0.8

  /**
   * Feed is populate by the following rules:
   * section In the app where the user sees posts which are “recommended” to him. Ranked by “relevance” score - descending
   * The Feed should only include posts which belong to one of the requesting user’s communities
   *
   * The algorithm for this feature should rank posts where the post author is from the same country first,
   * then based on the following weighted score - 80% reaction count + 20% post length.
   * this weighted score is calculated every few hours
   *
   * Some examples:
   * 1. Post A author is from the same country as the requesting user, post B isn’t.
   * A is ranked higher then B (returned first in the array) even if B has a higher weighted score
   *
   * 2. Post A and B authors are from the same country as the requesting user. The post with the highest weighted score is returned first
   *
   * 3. Post A and B authors are not from the same country as the requesting user. The post with the highest weighted score is returned first
   * 4. No posts are found from one of the users communities - the feed is empty (empty array response)
   *
   * @param userId User to get feed for
   * @param limit number of items to return
   * @param offset the page to return
   */
  async getFeed(userId: any, limit: number, offset: number):Promise<Post[]> {
    const user:UserWithCommunities = await this.models.User.findByPk(userId, {include: 'communities'})
    const userCountry = user.country
    const communitiesId = user.communities.map(comm => comm.id)

    const reactionLimitSameCountry = Math.round(limit * this.REACTION_PERCENTAGE)
    const lengthLimitSameCountry = limit - reactionLimitSameCountry

    // Ranked posts from the same country - always displayed first
    const rankedPostsFromSameCountry = await this.getRankedPostsFromSameCountry(
      userCountry, communitiesId, reactionLimitSameCountry, offset, lengthLimitSameCountry)

    // If ranked posts doesn't fill the bucket - get next ranked posts NOT from country
    if(rankedPostsFromSameCountry.length >= limit) {
      return rankedPostsFromSameCountry
    }
    const bucketLeft = limit - rankedPostsFromSameCountry.length
    const rankByReactionLimit = Math.round(bucketLeft * this.REACTION_PERCENTAGE)
    const rankByLengthLimit = limit - rankByReactionLimit

    const rankedPosts = await this.getRankedPostsNotFromSameCountry(
      userCountry, communitiesId, rankByReactionLimit, offset, rankByLengthLimit)

    return [...rankedPostsFromSameCountry, ...rankedPosts]
  }

  private async getRankedPostsFromSameCountry(userCountry: number, communitiesId: number[],
                                              byReactionLimit: number, offset: number,
                                              byLengthLimit: number):Promise<any[]> {
    return this._getRankedPosts(userCountry, communitiesId, byReactionLimit, offset,
      byLengthLimit, "IN")
  }

  // When we ask posts not from the same country - we removed possible duplicated posts
  private async getRankedPostsNotFromSameCountry(userCountry: number,
                               communitiesId: number[],  rankByReactionLimit: number,
                               offset: number, rankByLengthLimit: number):Promise<any[]> {
    return this._getRankedPosts(userCountry, communitiesId, rankByReactionLimit, offset,
      rankByLengthLimit, "NOT IN")
  }

  private async _getRankedPosts(userCountry: number,
                               communitiesId: number[],  byReactionLimit: number,
                               offset: number, byLengthLimit: number, countryWhere: string):Promise<any[]> {
    const [result] = await app.locals.db.sequelize.query(`
      SELECT id,body,community_id as "communityId",
      length,likes,status,summary,title,created_at as "createdAt",updated_at as "updatedAt",
      user_id as "userId"
       
      FROM ((SELECT '1' as type,post_id,ranking from rank_by_reaction
      WHERE country ${countryWhere} ('${userCountry}') AND community_id in(${communitiesId})
      ORDER by ranking DESC LIMIT ${byReactionLimit} OFFSET ${offset})
      
      UNION ALL
      
      (SELECT '2' as type,post_id,ranking from rank_by_length
      WHERE country ${countryWhere} ('${userCountry}') AND community_id in(${communitiesId}) AND post_id not in(
      
        -- TODO Redundant duplication to make sure no duplicated posts appear
      (SELECT post_id from rank_by_reaction
      WHERE country ${countryWhere} ('${userCountry}') AND community_id in(${communitiesId})
      ORDER by ranking DESC LIMIT ${byReactionLimit} OFFSET ${offset})
      )
      
      ORDER by ranking DESC LIMIT ${byLengthLimit} OFFSET ${offset})) as top_posts
      JOIN post on top_posts.post_id = post.id
      `);
    return result
  }
}
