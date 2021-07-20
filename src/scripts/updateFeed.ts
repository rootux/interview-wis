
import app from '../app';
import debug from "debug";
import FeedUpdaterService from "../user/feed/feed.updater.service";
const logger = debug('wisdo:api:updateFeed');

(async () => {
  logger('Updating feed...');
  const {feedUpdaterService}:{feedUpdaterService:FeedUpdaterService} = app.locals.services
  await feedUpdaterService.updateFeed()
  logger("Done");
})();
