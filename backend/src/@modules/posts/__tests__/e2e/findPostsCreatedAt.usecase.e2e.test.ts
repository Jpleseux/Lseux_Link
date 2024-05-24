import { FinPostsCreatedAtTodayUsecase } from "@modules/posts/core/usecase/findPostsCreatedAtToday.usecase";
import { PostModel } from "@modules/posts/infra/database/models/Post.model";
import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: PostsRepositoryTypeOrm;
describe.skip("Deve testar o FinPostsCreatedAtTodayUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new PostsRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve buscar os posts criados hoje", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values([
        {
          images: [],
          text: "wouiefhiosd",
          title: "teste",
          uuid: "7cb9e8a5-4736-451c-9a0d-e156a46bdce5",
          user_uuid: "d0027811-4f76-4cf2-a24b-bc99ad777950",
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
    const action = new FinPostsCreatedAtTodayUsecase(repo);
    const posts = await action.execute();
    expect(posts.length).toBe(1);
    await repo.DeletePostByUuid("7cb9e8a5-4736-451c-9a0d-e156a46bdce5");
  });
});
