import Post from "../../../src/db/models/post.model";
import * as faker from 'faker';
import {createMockCommunity, createMockUser} from "../../../src/utils/utils.mock";

describe('Post model', () => {
  test('after updating post - body updates', async () => {
    const user = await createMockUser();
    const community = await createMockCommunity();
    const body = faker.lorem.paragraph();
    const post = await Post.create({
      title: faker.name.findName(),
      summary: faker.lorem.word(),
      body,
      status: 'pending',
      communityId: community.id,
      userId: user.id
    });

    expect(post.body.length).toBe(body.length);
  });
})
