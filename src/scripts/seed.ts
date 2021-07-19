
import app from '../app';

import {Sequelize} from "sequelize";
import MockService from "../mock/mock.service";
import debug from "debug";
import {User, UserInstance, UserWithCommunities} from "../db/models/user.model";
import {ModelCtor} from "sequelize/types/lib/model";

const logger = debug('wisdo:api:seed');

(async () => {
  logger('Syncing database...');
  let db:{sequelize:Sequelize} = app.locals.db
  let {mockService}:{mockService:MockService} = app.locals.services
  const models:{User:ModelCtor<UserInstance>} = app.locals.models

  await db.sequelize.sync({force: true}); // This would drop old data // TODO: given more time we should use sequalize migrations and seed
  logger('Seeding database...');
  // TODO: replace with bulkCreate
  for(let i=0;i<10;i++) {
    await mockService.createMockUser()
  }
  for(let i=0;i<2;i++) {
    await mockService.createMockModUser()
  }
  for(let i=0;i<2;i++) {
    await mockService.createMockSuperModUser()
  }
  const users:any = await models.User.findAll({include: 'communities'})

  const communities = [];
  for(let i=0;i<10;i++) {
    communities.push(await mockService.createMockCommunity());
  }
  await mockService.associateUsersToRandomCommunities(users, communities, 5);
  await mockService.createMockPosts(users, 200);
  await mockService.createMockWords(['alert', 'problem', 'mandalorian'])

  logger('Done seeding...');
  logger('Starting update feed...');
})();
