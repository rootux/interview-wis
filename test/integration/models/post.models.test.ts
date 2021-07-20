import * as faker from 'faker';
import app from '../../../src/app'
import MockService from "../../../src/mock/mock.service";
import ValidationError from "../../../src/errors/validation.error";

describe('Post model', () => {
  let thisDb: any = app.locals.db
  let models: any = app.locals.models
  let {mockService}:{mockService:MockService} = app.locals.services

  // Clear the DB and run migrations
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

  it('summary should not be more then 150 words', async () => {
    const user = await mockService.createMockUser();
    const community = await mockService.createMockCommunity();
    const body = faker.lorem.words(200);
    await expect(models.Post.create({
      title: faker.lorem.words(2),
      body,
      summary: faker.lorem.words(160),
      status: 'pending',
      communityId: community.id,
      userId: user.id
    }))
      .rejects
      .toThrow(`Summary cant be more then 150 words (160)`);
  });

  it('when no summary - summary is taken from body', async () => {
    const user = await mockService.createMockUser();
    const community = await mockService.createMockCommunity();
    const body = faker.lorem.words(200);
    const post = await models.Post.create({
      title: faker.lorem.words(2),
      body,
      status: 'pending',
      communityId: community.id,
      userId: user.id
    });
    expect(post.summary.split(' ').length).toBe(100);
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
