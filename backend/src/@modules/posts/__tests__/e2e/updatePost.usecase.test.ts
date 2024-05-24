import { updatePostUsecase } from "@modules/posts/core/usecase/updatePost.usecase";
import { PostModel } from "@modules/posts/infra/database/models/Post.model";
import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

describe("Deve testar o updatePostUsecase", () => {
  let repo: PostsRepositoryTypeOrm;
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new PostsRepositoryTypeOrm(dataSource);
  });
  afterEach(async () => {
    await repo.DeletePostByUuid("a4cb4bed-b786-4ca4-b809-e8d5a293ad55");
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve atualizar um post", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values([
        {
          images: [""],
          text: "text",
          title: "title",
          user_uuid: "d0027811-4f76-4cf2-a24b-bc99ad777950",
          uuid: "a4cb4bed-b786-4ca4-b809-e8d5a293ad55",
          des_like: {
            amount: 0,
            userUuids: [],
          },
          like: {
            amount: 0,
            userUuids: [],
          },
        },
      ])
      .execute();
    const action = new updatePostUsecase(repo);
    const post = await action.execute(
      "a4cb4bed-b786-4ca4-b809-e8d5a293ad55",
      { title: "title 2" },
      "d0027811-4f76-4cf2-a24b-bc99ad777950",
    );
    expect(post.title()).toBe("title 2");
  });
});
