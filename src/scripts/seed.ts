
import app from '../app';

import {Sequelize} from "sequelize";
import MockService from "../mock/mock.service";
import debug from "debug";
import {User, UserInstance, UserWithCommunities} from "../db/models/user.model";
import {ModelCtor} from "sequelize/types/lib/model";
import {Community, CommunityInstance} from "../db/models/community.model";
import {PostStatus} from "../db/models/postStatus.enum";

const logger = debug('wisdo:api:seed');

(async () => {
  logger('Syncing database...');
  let db:{sequelize:Sequelize} = app.locals.db
  let {mockService}:{mockService:MockService} = app.locals.services
  const models:{User:ModelCtor<UserInstance>, Community: ModelCtor<CommunityInstance>} = app.locals.models

  await db.sequelize.sync({force: true}); // This would drop old data // TODO: given more time we should use sequalize migrations and seed
  logger('Seeding database...');
  // TODO: replace with bulkCreate
  const users = []
  for(let i=0;i<10;i++) {
    users.push(await mockService.createMockUser())
  }
  for(let i=0;i<2;i++) {
    users.push(await mockService.createMockModUser())
  }
  for(let i=0;i<2;i++) {
    users.push(await mockService.createMockSuperModUser())
  }

  const communities:Community[] = []
  for(let i=0;i<10;i++) {
    communities.push(await mockService.createMockCommunity())
  }
  await mockService.associateUsersToRandomCommunities(users, communities, 5)

  const usersWithCommunities:any = await models.User.findAll({include: 'communities'})
  await mockService.createMockPosts(usersWithCommunities, 150, PostStatus.approved)
  await mockService.createMockPosts(usersWithCommunities, 50, PostStatus.pending)
  await mockService.createMockWords(['alert', 'problem', 'mandalorian'])

  logger('Done seeding...')
  logger('Starting update feed...');
})();
