import app from '../../src/app'
import {PostStatus} from "../../src/db/models/postStatus.enum"
import {User, UserInstance} from "../../src/db/models/user.model"
import {ModelCtor} from "sequelize/types/lib/model"
import {Community} from "../../src/db/models/community.model"
import {PostCreation, PostInstance} from "../../src/db/models/post.model";
import FeedService from "../../src/user/feed/feed.service";
import MockService from "../../src/mock/mock.service";
import CommunityService from "../../src/community/community.service";
import {PostService} from "../../src/post/post.service";
import FeedUpdaterService from "../../src/user/feed/feed.updater.service";

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

  let createMockedPosts = async(count:number, status: PostStatus) => {
    let posts = mockPosts(count, status)
    const result = await postService.bulkCreatePosts(posts)
    await feedUpdaterService.updateFeed()
    return result
  }

  let cleanPosts = async () => {
    return Post.sync({force: true})
  }

  let mockPost = (body: string, status:PostStatus=PostStatus.pending):PostCreation => {
    return {
      title: 'title',
      body,
      communityId: community.id,
      userId: user.id,
      status
    }
  }

  let mockPosts = (count: number, status:PostStatus=PostStatus.pending): PostCreation[] => {
    let result = []
    for (let i=0;i<count;i++) {
      result.push(mockPost("c"+i, status))
    }
    return result
  }

  // Clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
    user = await mockService.createMockUser()
    community = await mockService.createMockCommunity()
    await communityService.join(user.id, community.id)
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

  afterEach(async() => {
    await cleanPosts()
  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
