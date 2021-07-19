import UserService from "../user/user.service";
import MockService from "../mock/mock.service";
import EmailService from "../email/email.service";
import {PostService} from "../post/post.service";
import WatchlistService from "../watchlist/watchlist.service";
import WatchlistProvider from "../watchlist/watchlist.provider";
import CommunityService from "../community/community.service";
import FeedService from "../user/feed/feed.service";

module.exports = (app:any) => {
  const {models} = app.locals
  const watchlistProvider =  new WatchlistProvider(models)
  const userService = new UserService(models)
  const communityService = new CommunityService(app)
  const emailService =  new EmailService(models)
  const watchlistService =  new WatchlistService(watchlistProvider, emailService, userService)
  const postService = new PostService(watchlistService, models)
  const feedService = new FeedService(app)
  const mockService = new MockService(models)
  app.locals.services = {
    userService,
    communityService,
    emailService,
    watchlistService,
    postService,
    feedService,
    mockService
  }
};
