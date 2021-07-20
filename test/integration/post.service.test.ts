import app from '../../src/app'
import {PostService} from "../../src/post/post.service"
import {PostStatus} from "../../src/db/models/postStatus.enum"
import {User, UserInstance} from "../../src/db/models/user.model"
import {ModelCtor} from "sequelize/types/lib/model"
import MockService from "../../src/mock/mock.service"
import {Community} from "../../src/db/models/community.model"
import CommunityService from "../../src/community/community.service"
import WatchlistService from "../../src/watchlist/watchlist.service"
import sinon from "sinon"
import {PostInstance} from "../../src/db/models/post.model";
import ValidationError from "../../src/errors/validation.error";

describe("test the Post Service", () => {
  let thisDb: any = app.locals.db
  let {postService, mockService, communityService, watchlistService}
    :{postService:PostService, mockService: MockService, communityService: CommunityService,
  watchlistService:WatchlistService} = app.locals.services
  const {User, Post}: {
    User:ModelCtor<UserInstance>,
    Post:ModelCtor<PostInstance>} = app.locals.models
  let user:User
  let community: Community

  let mockPost = () => {
    return {
      title: 'title',
      body: 'this should alert',
      communityId: community.id,
      userId: user.id,
      status: PostStatus.pending
    }
  }

  let cleanPosts = async () => {
    return Post.sync({force: true})
  }

  // Before any tests run, clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
    user = await mockService.createMockUser()
    community = await mockService.createMockCommunity()
    await communityService.join(user.id, community.id)
  })

  it("should create a post", async () => {
    const postMock = mockPost()
    const post = await postService.createPost(postMock)
    expect(post.title).toEqual(postMock.title)
    expect(post.body).toEqual(postMock.body)
    expect(post.status).toEqual(postMock.status)
  })

  it("should bulk create posts", async () => {
    const postMock = mockPost()
    const postMock2 = mockPost()
    const posts = await postService.bulkCreatePosts([postMock,postMock2])
    expect(posts[0].title).toEqual(postMock.title)
    expect(posts[0].body).toEqual(postMock.body)
    expect(posts[0].status).toEqual(postMock.status)
    expect(posts[1].title).toEqual(postMock2.title)
    expect(posts[1].body).toEqual(postMock2.body)
    expect(posts[1].status).toEqual(postMock2.status)

  })

  it("Should call watchlist alert for a given post", async () => {
    const postMock = mockPost()
    const fake = sinon.fake()
    sinon.replace(watchlistService,"validateAndAlert", fake)
    await postService.createPost(postMock)
    sinon.assert.calledOnce(fake)
    sinon.restore()
  })

  it("Should hide pending posts for normal users", async () => {
    const postMock = mockPost()
    await postService.createPost(postMock)
    const posts = await postService.list(community.id,{includeAllStatus: false})
    expect(posts).toHaveLength(0)
    await cleanPosts()
  })

  it("Should show approved posts for normal users", async () => {
    let postMock = mockPost()
    postMock = {...postMock, status: PostStatus.approved}
    await postService.createPost(postMock)
    const posts = await postService.list(community.id,{includeAllStatus: false})
    expect(posts).toHaveLength(1)
    await cleanPosts()
  })

  it("Should allow to approve posts", async () => {
    let postMock = mockPost()
    const createdPost = await postService.createPost(postMock)
    await postService.approve(createdPost.communityId, createdPost.id)
  })

  it("Should throw when approving an already Approved posts", async () => {
    let postMock = mockPost()
    postMock = {...postMock, status: PostStatus.approved}
    const createdPost = await postService.createPost(postMock)
    await expect(postService.approve(createdPost.communityId, createdPost.id))
      .rejects
      .toThrow(ValidationError);
  })

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
