import app from '../../src/app'
import {PostStatus} from "../../src/db/models/postStatus.enum"
import {User} from "../../src/db/models/user.model"
import {ModelCtor} from "sequelize/types/lib/model"
import {Community} from "../../src/db/models/community.model"
import {Post, PostInstance} from "../../src/db/models/post.model";
import FeedService from "../../src/user/feed/feed.service";
import MockService from "../../src/mock/mock.service";
import CommunityService from "../../src/community/community.service";
import {PostService} from "../../src/post/post.service";
import FeedUpdaterService from "../../src/user/feed/feed.updater.service";
import {sliceArray} from "../../src/utils/utils.array";

describe("test the Feed Service", () => {
  let thisDb: any = app.locals.db
  let {feedService,feedUpdaterService,mockService,communityService,postService}:
    {feedService:FeedService, feedUpdaterService:FeedUpdaterService, mockService:MockService,
      communityService:CommunityService, postService: PostService} = app.locals.services
  const {Post}: {
    Post:ModelCtor<PostInstance>} = app.locals.models
  let user:User
  let community: Community

  const POST_LIMIT = 20
  const REACTION_PERCENTAGE = 0.8

  let createMockedPosts = async(communityId:number, userId: number, count:number, status: PostStatus):Promise<Post[]> => {
    let posts = mockService.mockPosts(communityId, userId, count, status)
    const result = await postService.bulkCreatePosts(posts)
    await feedUpdaterService.updateFeed()
    return result
  }

  let cleanPosts = async () => {
    return Post.sync({force: true})
  }

  let createMockUserAndJoinCommunity = async (): Promise<any[]> => {
    const user = await mockService.createMockUser()
    const community = await mockService.createMockCommunity()
    await communityService.join(user.id, community.id)
    return [user, community]
  }

  let expectPostDescBy1Items = (reactionPosts:Post[], lengthPosts:Post[]) => {
    // Likes should have descending order
    expectPostsDescBy1(reactionPosts, 'likes')
    // Length should have descending order
    expectPostsDescBy1(lengthPosts, 'length')
  }

  let expectPostsDescBy1 = (posts:Post[], attribute:string) =>{
    for(let i=0;i<posts.length-1;i++) {
      const nextElement = posts[i+1]
      // @ts-ignore
      expect(parseInt(posts[i][attribute])).toEqual(parseInt(nextElement[attribute])+1)
    }
  }

  let expectPostDescItems = (reactionPosts:Post[], lengthPosts:Post[]) => {
    expectPostDescOrder(reactionPosts,'likes')
    expectPostDescOrder(lengthPosts,'length')
  }

  let expectPostDescOrder = (posts:Post[], attribute:string) =>{
    for(let i=0;i<posts.length-1;i++) {
      // @ts-ignore
      expect(parseInt(posts[i][attribute])).toBeGreaterThanOrEqual(parseInt(posts[i + 1][attribute]))
    }
  }

  // Clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
    const [mockedUser, mockedCommunity] = await createMockUserAndJoinCommunity()
    user = mockedUser
    community = mockedCommunity
  })

  it("should get posts only from the users country when those exists", async () => {
    const createdPosts = await createMockedPosts(community.id, user.id, POST_LIMIT, PostStatus.approved)

    const feedPosts = await feedService.getFeed(user.id,POST_LIMIT,0)

    // @ts-ignore
    expect(Post.pick(createdPosts)).toMatchObject(Post.pick(feedPosts))
  })

  it("should allow paginating through the posts", async () => {
    const PAGE_SIZE = 5
    await createMockedPosts(community.id, user.id, POST_LIMIT, PostStatus.approved)

    for(let offset=0; offset<POST_LIMIT; offset+=PAGE_SIZE) {
      const feedPostsWindow = await feedService.getFeed(user.id, PAGE_SIZE, offset)
      expect(feedPostsWindow).toHaveLength(PAGE_SIZE)
    }
  })

  it("should only show approved posts", async () => {
    await createMockedPosts(community.id, user.id, POST_LIMIT, PostStatus.pending)

    const posts = await feedService.getFeed(user.id,POST_LIMIT,0)

    expect(posts).toHaveLength(0)
  })

  it("should return 80% of posts by likes and the rest 20% by length", async () => {
    let posts = await mockService.createMockedPostsWithIncLikesLength(community.id, user.id, POST_LIMIT, PostStatus.approved)
    await feedUpdaterService.updateFeed()
    const feedPosts = await feedService.getFeed(user.id,POST_LIMIT,0)
    const [reactionPosts, lengthPosts] = sliceArray(feedPosts, POST_LIMIT, REACTION_PERCENTAGE)

    expectPostDescBy1Items(reactionPosts, lengthPosts)

    // @ts-ignore
    expect(Post.pick(posts)).toMatchObject(Post.pick(feedPosts))
  })

  it("should not return anything if feed posts are not from the user community", async () => {
    await createMockedPosts(community.id, user.id, POST_LIMIT, PostStatus.pending)
    const [newUser] = await createMockUserAndJoinCommunity()
    const posts = await feedService.getFeed(newUser.id,POST_LIMIT,0)
    expect(posts).toHaveLength(0)
  })

  it("should allow pagination to return data 80% likes and 20% length", async () => {
    const PAGE_SIZE = 10 // TODO: Fix it for size of 9
    await mockService.createMockedPostsWithIncLikesLength(community.id, user.id, POST_LIMIT, PostStatus.approved)
    await feedUpdaterService.updateFeed()

    for(let offset=0; offset<POST_LIMIT; offset+=PAGE_SIZE) {
      const feedPostsWindow = await feedService.getFeed(user.id, PAGE_SIZE, offset)
      const [reactionPosts, lengthPosts] = sliceArray(feedPostsWindow, POST_LIMIT, REACTION_PERCENTAGE)

      expectPostDescBy1Items(reactionPosts, lengthPosts)

      expect(feedPostsWindow).toHaveLength(PAGE_SIZE)
    }
  })


  it("should validate country posts then weights", async () => {
    const sameCountryPosts = await createMockedPosts(community.id, user.id, 10, PostStatus.approved)
    const [newUser, newCommunity] = await createMockUserAndJoinCommunity()
    const otherCountryPosts = await createMockedPosts(newCommunity.id, newUser.id, 10, PostStatus.approved)
    await feedUpdaterService.updateFeed()

    // First pagination window - should display same country posts
    const postsWindow = await feedService.getFeed(user.id, 10, 0)
    for(let post of postsWindow) {
      expect(post.userId == user.id)
    }
    // Inside that pagination window - posts should be sorted by weights
    const [reactionPosts, lengthPosts] = sliceArray(postsWindow, 10, REACTION_PERCENTAGE)
    expectPostDescItems(reactionPosts, lengthPosts)

    // Second window - once same country posts are over - should display other country posts
    const postsWindow2 = await feedService.getFeed(user.id, 10, 10)
    for(let post of postsWindow2) {
      expect(post.userId == newUser.id)
    }
    // Inside that window - posts should be sorted by weights
    const [reactionPosts2, lengthPosts2] = sliceArray(postsWindow2, 10, REACTION_PERCENTAGE)
    expectPostDescItems(reactionPosts2, lengthPosts2)
  })

  afterEach(async() => {
    await cleanPosts()
  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
