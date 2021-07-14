import UserService from "../user/user.service";
import MockService from "../mock/mock.service";
import EmailService from "../email/email.service";
import {PostService} from "../post/post.service";
import WatchlistService from "../watchlist/watchlist.service";
import WatchlistProvider from "../watchlist/watchlist.provider";
import CommunityService from "../community/community.service";

module.exports = (app:any) => {
  const {models} = app.locals
  const watchListProvider =  new WatchlistProvider(models)
  const userService = new UserService(models)
  const communityService = new CommunityService(app)
  const emailService =  new EmailService(models)
  const watchListService =  new WatchlistService(watchListProvider, emailService, userService)
  const postService = new PostService(watchListService, models)
  const mockService = new MockService(models)
  app.locals.services = {
    userService,
    communityService,
    emailService,
    watchListService,
    postService,
    mockService,
  }
};
