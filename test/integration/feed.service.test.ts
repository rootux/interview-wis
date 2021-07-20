import app from '../../src/app'
import {PostStatus} from "../../src/db/models/postStatus.enum"
import {User, UserInstance} from "../../src/db/models/user.model"
import {ModelCtor} from "sequelize/types/lib/model"
import {Community} from "../../src/db/models/community.model"
import {Post, PostCreation, PostInstance} from "../../src/db/models/post.model";
import FeedService from "../../src/user/feed/feed.service";
import MockService from "../../src/mock/mock.service";
import CommunityService from "../../src/community/community.service";
import {PostService} from "../../src/post/post.service";
import FeedUpdaterService from "../../src/user/feed/feed.updater.service";
import {sliceWindow} from "../../src/utils/utils.array";

describe("test the Feed Service", () => {
  let thisDb: any = app.locals.db
  let {feedService,feedUpdaterService,mockService,communityService,postService}:
    {feedService:FeedService, feedUpdaterService:FeedUpdaterService, mockService:MockService,
      communityService:CommunityService, postService: PostService} = app.locals.services
  const {User, Post}: {
    User:ModelCtor<UserInstance>,
    Post:ModelCtor<PostInstance>} = app.locals.models
  let user:User
  let community: Community
  const POST_LIMIT = 20
  const REACTION_PERCENTAGE = 0.8

  let createMockedPosts = async(count:number, status: PostStatus):Promise<Post[]> => {
    let posts = mockPosts(count, status)
    const result = await postService.bulkCreatePosts(posts)
    await feedUpdaterService.updateFeed()
    return result
  }

  /**
   * Posts with increasing length and increasing likes
   * creates: {"p1 b" 1 likes}, {"p2 bb" 2 likes}, {"p3 bbb" 3 likes}, {...}
   */
  let createMockedPostsWithIncLikesLength = async (count:number, status: PostStatus):Promise<Post[]> => {
    let posts = []
    for(let i=0;i<POST_LIMIT;i++) {
      posts.push(mockPost(`p${i} ${"b".repeat(i)}`, i+1, PostStatus.approved))
    }
    const result = await postService.bulkCreatePosts(posts)
    await feedUpdaterService.updateFeed()
    return result
  }

  let cleanPosts = async () => {
    return Post.sync({force: true})
  }

  let mockPost = (body: string, likes:number=0, status:PostStatus=PostStatus.pending):PostCreation => {
    return {
      title: 'title',
      body,
      likes,
      communityId: community.id,
      userId: user.id,
      status
    }
  }

  let mockPosts = (count: number, status:PostStatus=PostStatus.pending): PostCreation[] => {
    let result = []
    for (let i=0;i<count;i++) {
      result.push(mockPost("p"+i, 0, status))
    }
    return result
  }

  let createMockUserAndJoinCommunity = async (): Promise<any[]> => {
    const user = await mockService.createMockUser()
    const community = await mockService.createMockCommunity()
    await communityService.join(user.id, community.id)
    return [user, community]
  }

  let sliceWindowMatch = (reactionPosts:Post[], lengthPosts:Post[]) => {
    // Likes should have descending order
    for(let i=0;i<reactionPosts.length-1;i++) {
      expect(reactionPosts[i].likes).toMatch(String(reactionPosts[i + 1].likes - 1))
    }

    // Length should have descending order
    for(let i=0;i<lengthPosts.length-1;i++) {
      expect(lengthPosts[i].length).toMatch(String(lengthPosts[i+1].length-1))
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
    const createdPosts = await createMockedPosts(POST_LIMIT, PostStatus.approved)

    const feedPosts = await feedService.getFeed(user.id,POST_LIMIT,0)

    // @ts-ignore
    expect(Post.pick(createdPosts)).toMatchObject(Post.pick(feedPosts))
  })

  it("should allow paginating through the posts", async () => {
    const PAGE_SIZE = 5
    await createMockedPosts(POST_LIMIT, PostStatus.approved)

    for(let offset=0; offset<POST_LIMIT; offset+=PAGE_SIZE) {
      const feedPostsWindow = await feedService.getFeed(user.id, PAGE_SIZE, offset)
      expect(feedPostsWindow).toHaveLength(PAGE_SIZE)
    }
  })

  it("should only show approved posts", async () => {
    await createMockedPosts(POST_LIMIT, PostStatus.pending)

    const posts = await feedService.getFeed(user.id,POST_LIMIT,0)

    expect(posts).toHaveLength(0)
  })

  it("should return 80% of posts by likes and the rest 20% by length", async () => {
    let posts = await createMockedPostsWithIncLikesLength(POST_LIMIT, PostStatus.approved)
    const feedPosts = await feedService.getFeed(user.id,POST_LIMIT,0)
    const [reactionPosts, lengthPosts] = sliceWindow(feedPosts, POST_LIMIT, REACTION_PERCENTAGE)

    sliceWindowMatch(reactionPosts, lengthPosts)

    // @ts-ignore
    expect(Post.pick(posts)).toMatchObject(Post.pick(feedPosts))
  })

  it("should not return anything if feed posts are not from the user community", async () => {
    await createMockedPosts(POST_LIMIT, PostStatus.pending)
    const [newUser] = await createMockUserAndJoinCommunity()
    const posts = await feedService.getFeed(newUser.id,POST_LIMIT,0)
    expect(posts).toHaveLength(0)
  })

  it("should allow pagination to return data 80% likes and 20% length", async () => {
    const PAGE_SIZE = 10 // TODO: Fix it for size of 9
    await createMockedPostsWithIncLikesLength(POST_LIMIT, PostStatus.approved)

    for(let offset=0; offset<POST_LIMIT; offset+=PAGE_SIZE) {
      const feedPostsWindow = await feedService.getFeed(user.id, PAGE_SIZE, offset)
      const [reactionPosts, lengthPosts] = sliceWindow(feedPostsWindow, POST_LIMIT, REACTION_PERCENTAGE)

      sliceWindowMatch(reactionPosts, lengthPosts)

      expect(feedPostsWindow).toHaveLength(PAGE_SIZE)
    }
  })

  // TODO: add more unit tests to validate a mix of posts from same country + different weights

  afterEach(async() => {
    await cleanPosts()
  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
