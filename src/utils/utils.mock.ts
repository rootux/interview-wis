const faker = require('faker');
import { sampleRandom } from './utils.array';
import db from "../db/models/db.models";
const countries = require('../user/user.countries.enum').default;

export function createMockUser() {
  return db.User.create({
    name: faker.name.findName(),
    country: sampleRandom(countries),
    email: faker.internet.email(),
    image: faker.image.people()
  });
}

export function createMockCommunity() {
  return db.Community.create({
    title: faker.company.companyName(),
    image: faker.image.business(),
  });
}

export async function associateUsersToRandomCommunities(users:any[], communities:any[], communitiesPerUser:number) {
  for (const user of users) {
    for(let i=0;i<communitiesPerUser;i++) {
      const community = sampleRandom(communities);
      await user.addCommunity(community);
    }
  }
}

export async function createMockPost(user:any, communityId:any) {
  return db.Post.create({
    title: faker.name.findName(),
    summary: faker.lorem.word(),
    body: faker.lorem.word(),
    status: 'pending',
    communityId: communityId,
    userId: user.id
  });
}
