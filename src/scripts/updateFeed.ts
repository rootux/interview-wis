// We use a transaction to prevent a race condition where client might get deleted rows
import app from '../app';
import debug from "debug";
const logger = debug('wisdo:api:updateFeed');
(async () => {
  logger('Updating feed...');
  const [results, metadata] = await app.locals.db.sequelize.query(`
    BEGIN TRANSACTION;
    DELETE from rank_by_reaction;
    INSERT INTO rank_by_reaction (ranking, post_id,country,created_at,updated_at)
    SELECT row_number() over(order by likes DESC) as ranking, post.id, "user".country, current_timestamp, current_timestamp
    FROM post JOIN "user" on post.user_id = "user".id;

    DELETE from rank_by_length;
    INSERT INTO rank_by_length (ranking, post_id,country, created_at, updated_at)
    SELECT row_number() over(order by length DESC) as ranking, post.id, "user".country, current_timestamp, current_timestamp
    FROM post JOIN "user" on post.user_id = "user".id;

    COMMIT;
  `);

  logger(metadata);
  logger("Done");
})();
