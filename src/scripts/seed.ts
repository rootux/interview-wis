
import { sampleRandom } from '../utils/utils.array';
import app from '../app';

import {Sequelize} from "sequelize";
import MockService from "../mock/mock.service";

const createFakePost = async (mockService:MockService, users: any[]) => {
  const user = sampleRandom(users);
  const communities = await user.getCommunities();
  const community = sampleRandom(communities);
  return mockService.createMockPost(user, community.id);
}

(async () => {
  console.log('Syncing database...');
  let db:{sequelize:Sequelize} = app.locals.db
  let {mockService}:{mockService:MockService} = app.locals.services

  await db.sequelize.sync({force: true}); // This would drop old data // TODO: given more time we should use sequalize migrations and seed
  console.log('Seeding database...');
  // TODO: Promise.all
  const users = [];
  for(let i=0;i<10;i++) {
    users.push(await mockService.createMockUser());
  }
  const communities = [];
  for(let i=0;i<10;i++) {
    communities.push(await mockService.createMockCommunity());
  }
  await mockService.associateUsersToRandomCommunities(users, communities, 5);
  for(let i=0;i<10;i++) {
    await createFakePost(mockService, users);
  }

  console.log('Done');
})();
