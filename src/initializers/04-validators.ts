import CommunityValidator from "../community/community.validator";

module.exports = (app:any) => {
  const {communityService} = app.locals.services
  const communityValidator = new CommunityValidator(communityService)

  app.locals.validators = {
    communityValidator
  }
};
