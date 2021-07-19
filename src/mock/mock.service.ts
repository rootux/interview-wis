import {User, UserInstance} from "../db/models/user.model";

const faker = require('faker');
import {ModelCtor} from 'sequelize/types/lib/model';
import { sampleRandom } from '../utils/utils.array';
import {Community, CommunityInstance} from "../db/models/community.model";
import {Post, PostInstance} from "../db/models/post.model";
import {PostStatus} from "../db/models/postStatus.enum";
import {Roles} from "../user/user.roles.enum";
const countries = require('../user/user.countries.enum').default;

export default class MockService {
  private models: {
    User: ModelCtor<UserInstance>,
    Community: ModelCtor<CommunityInstance>,
    Post: ModelCtor<PostInstance>,
  };

  constructor(models: any) {
    this.models = models
  }

  createMockUser():Promise<User> {
    return this.models.User.create({
      name: faker.name.findName(),
      country: sampleRandom(countries),
      email: faker.internet.email(),
      image: faker.image.people(),
      role: Roles.Normal
    });
  }

  createMockCommunity():Promise<Community> {
    return this.models.Community.create({
      title: faker.company.companyName(),
      image: faker.image.business(),
    });
  }

  async associateUsersToRandomCommunities(users: any[], communities: any[], communitiesPerUser: number) {
    for (const user of users) {
      for (let i = 0; i < communitiesPerUser; i++) {
        const community = sampleRandom(communities);
        await user.addCommunity(community);
      }
    }
  }

  async createMockPost(user: any, communityId: any):Promise<Post> {
    return this.models.Post.create({
      title: faker.name.findName(),
      summary: faker.lorem.word(),
      body: faker.lorem.word(),
      status: PostStatus.pending,
      communityId: communityId,
      userId: user.id
    });
  }
}
