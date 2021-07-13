
import db from '../db/models/db.models';
import { sampleRandom } from '../utils/utils.array';
import {
  associateUsersToRandomCommunities,
  createMockCommunity,
  createMockUser,
  createMockPost
} from "../utils/utils.mock";


const createFakePost = async (users: any[]) => {
  const user = sampleRandom(users);
  const communities = await user.getCommunities();
  const community = sampleRandom(communities);
  return createMockPost(user, community.id);
}

(async () => {
  console.log('Syncing database...');
  await db.sequelize.sync({force: true}); // This would drop old data // TODO: given more time we should use sequalize migrations and seed
  console.log('Seeding database...');
  // TODO: Promise.all
  const users = [];
  for(let i=0;i<10;i++) {
    users.push(await createMockUser());
  }
  const communities = [];
  for(let i=0;i<10;i++) {
    communities.push(await createMockCommunity());
  }
  await associateUsersToRandomCommunities(users, communities, 5);
  for(let i=0;i<10;i++) {
    await createFakePost(users);
  }

  console.log('Done');
})();
