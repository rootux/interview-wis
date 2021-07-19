import * as faker from 'faker';
import app from '../../../src/app'
import MockService from "../../../src/mock/mock.service";

describe('Post model', () => {
  let thisDb: any = app.locals.db
  let models: any = app.locals.models
  let {mockService}:{mockService:MockService} = app.locals.services

  // Before any tests run, clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
  })

  it('after updating post - body length updates', async () => {
    const user = await mockService.createMockUser();
    const community = await mockService.createMockCommunity();
    const body = faker.lorem.paragraph();
    const post = await models.Post.create({
      title: faker.lorem.words(2),
      summary: faker.lorem.words(5),
      body,
      status: 'pending',
      communityId: community.id,
      userId: user.id
    });

    expect(post.body.length).toBe(body.length);
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
