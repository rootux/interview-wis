import {User, UserWithCommunities} from "../db/models/user.model";
import {sampleRandom} from '../utils/utils.array';
import {Community} from "../db/models/community.model";
import {Post, PostCreation} from "../db/models/post.model";
import {PostStatus} from "../db/models/postStatus.enum";
import {Roles} from "../user/user.roles.enum";
import {getCountry} from "../user/user.countries.enum";
import _ from "lodash";

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

  async createMockPostsRandomly(users: UserWithCommunities[], count: number, status: PostStatus=PostStatus.approved):Promise<Post[]> {
    const posts = []
    for(let i=0; i<count; i++) {
      const user = sampleRandom(users)
      const userCommunities = user.communities
      const communityId = sampleRandom(userCommunities).id
      posts.push(this.mockPost(communityId, user.id, status))
    }
    return this.models.Post.bulkCreate(posts)
  }

  mockPosts(communityId:number, userId:number, count: number, status:PostStatus=PostStatus.pending): PostCreation[] {
    let result = []
    for (let i=0;i<count;i++) {
      result.push(this.mockPost(communityId, userId, status))
    }
    return result
  }

  mockPost(communityId:number,
                   userId:number,
                   status:PostStatus = PostStatus.pending,
                   body:string = faker.lorem.words(15),
                   likes:number = _.random(100),
                   title:string = faker.lorem.words(2),
                   summary:string = faker.lorem.words(4)) {
    return {
      title,
      summary,
      body,
      status,
      likes,
      communityId,
      userId
    };
  }

  /**
   * Posts with increasing length and increasing likes
   * creates: {"p1 b" 1 likes}, {"p2 bb" 2 likes}, {"p3 bbb" 3 likes}, {...}
   */
  async createMockedPostsWithIncLikesLength(communityId:number, userId:number, count:number, status: PostStatus):Promise<Post[]> {
    let posts = []
    for(let i=0;i<count;i++) {
      posts.push(this.mockPost(communityId, userId, status, `p${i} ${"b".repeat(i)}`, i+1, ))
    }
    return this.models.Post.bulkCreate(posts)
  }

  async createMockWords(words:string[]) {
    const wordsFormatted:any = words.map((w => {return {word: w}}))
    return this.models.Watchlist.bulkCreate(wordsFormatted)
  }
}
