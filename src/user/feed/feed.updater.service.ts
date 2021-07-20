import {Sequelize} from "sequelize"
import {PostStatus} from "../../db/models/postStatus.enum";

export default class FeedUpdaterService {
  private sequelize: Sequelize

  constructor(app: any) {
    this.sequelize = app.locals.db.sequelize
  }

  /**
   * Our feed is populated into 2 tables - `rank_by_reaction` and `rank_by_length`
   * Each ranked the posts based on the reaction count (likes) and the length of the approved posts
   *
   * We use a transaction to prevent a race condition where client might get an empty / incomplete feed
   */
  async updateFeed() {
    const [results] = await this.sequelize.query(`
        BEGIN TRANSACTION;
        DELETE from rank_by_reaction;
        INSERT INTO rank_by_reaction (ranking, community_id, post_id,country,created_at,updated_at)
        SELECT row_number() over(order by likes DESC) as ranking, post.community_id, post.id, "user".country, current_timestamp, current_timestamp
        FROM post JOIN "user" on post.user_id = "user".id
        WHERE post.status = '${PostStatus.approved}';
    
        DELETE from rank_by_length;
        INSERT INTO rank_by_length (ranking, community_id, post_id,country, created_at, updated_at)
        SELECT row_number() over(order by length DESC) as ranking, post.community_id, post.id, "user".country, current_timestamp, current_timestamp
        FROM post JOIN "user" on post.user_id = "user".id
        WHERE post.status = '${PostStatus.approved}';
    
        COMMIT;
      `)
    return results
  }
}
