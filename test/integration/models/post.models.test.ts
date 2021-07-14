import * as faker from 'faker';
import db from '../../../src/db/models/db.models';
import {createMockCommunity, createMockUser} from "../../../src/utils/utils.mock";

describe('Post model', () => {
  let thisDb: any = db

  // Before any tests run, clear the DB and run migrations
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
  })

  it('after updating post - body length updates', async () => {
    const user = await createMockUser();
    const community = await createMockCommunity();
    const body = faker.lorem.paragraph();
    const post = await db.Post.create({
      title: faker.name.findName(),
      summary: faker.lorem.word(),
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
