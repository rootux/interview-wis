// We use a transaction so client won't get deleted rows
import app from '../app';
(async () => {
  console.log('Updating feed...');
  const [results, metadata] = await app.locals.db.sequelize.query(`
    BEGIN TRANSACTION;
    DELETE from rankingByReaction;
    INSERT INTO rankingByReaction (ranking, postId,country)
    SELECT row_number() over(order by likes DESC) as ranking, post.id, users.country
    FROM post JOIN users on post.userId = users.id;
    
    DELETE from rankingByLength;
    INSERT INTO rankingByLength (ranking, postId,country)
    SELECT row_number() over(order by length DESC) as ranking, post.id, users.country
    FROM post JOIN users on post.userId = users.id;
    
    COMMIT;
  `);

  console.log(metadata);
  console.log("Done");
})();
