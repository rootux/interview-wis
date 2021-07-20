import {User, UserInstance, UserWithCommunities} from "../db/models/user.model";
import {ModelCtor} from 'sequelize/types/lib/model';
import {sampleRandom} from '../utils/utils.array';
import {Community, CommunityInstance} from "../db/models/community.model";
import {Post, PostInstance} from "../db/models/post.model";
import {PostStatus} from "../db/models/postStatus.enum";
import {Roles} from "../user/user.roles.enum";
import {WatchlistInstance} from "../db/models/watchlist.model";
import {getCountry} from "../user/user.countries.enum";

const faker = require('faker');
const countries = require('../user/user.countries.enum').default;

export default class MockService {
  private models: {
    User: any,
    Community: any,
    Post: any,
    Watchlist: any,
  };

  constructor(models: any) {
    this.models = models
  }

  _createMockUser(role: Roles):Promise<User> {
    return this.models.User.create({
      name: faker.name.findName(),
      country: getCountry(sampleRandom(countries)),
      email: faker.internet.email(),
      image: faker.image.people(),
      role
    });
  }

  createMockUser():Promise<User> {
    return this._createMockUser(Roles.Normal)
  }

  createMockModUser():Promise<User> {
    return this._createMockUser(Roles.Moderator)
  }

  createMockSuperModUser():Promise<User> {
    return this._createMockUser(Roles.SuperModerator)
  }

  createMockCommunity():Promise<Community> {
    return this.models.Community.create({
      title: faker.company.companyName(),
      image: faker.image.business(),
    });
  }

  async associateUsersToRandomCommunities(users: any[], communities: Community[], communitiesPerUser: number) {
    for (const user of users) {
      for (let i = 0; i < communitiesPerUser; i++) {
        const community = sampleRandom(communities);
        await user.addCommunity(community);
      }
    }
  }

  async createMockPosts(users: UserWithCommunities[], count: number, status: PostStatus=PostStatus.approved):Promise<Post[]> {
    const objects = []
    for(let i=0; i<count; i++) {
      const user = sampleRandom(users)
      const userCommunities = user.communities
      const communityId = sampleRandom(userCommunities).id
      objects.push({
        title: faker.lorem.words(2),
        summary: faker.lorem.words(4),
        body: faker.lorem.words(15),
        status,
        likes: i,
        communityId,
        userId: user.id
      })
    }
    return this.models.Post.bulkCreate(objects)
  }

  async createMockWords(words:string[]) {
    const wordsFormatted:any = words.map((w => {return {word: w}}))
    return this.models.Watchlist.bulkCreate(wordsFormatted)
  }
}
