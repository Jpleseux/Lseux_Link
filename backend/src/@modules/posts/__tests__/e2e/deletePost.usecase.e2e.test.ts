import { DeletePostUsecase } from "@modules/posts/core/usecase/DeletePost.usecase";
import { PostModel } from "@modules/posts/infra/database/models/Post.model";
import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: PostsRepositoryTypeOrm;
describe("Deve testar o FinPostsCreatedAtTodayUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new PostsRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve deletar um post", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values([
        {
          images: [],
          text: "wouiefhiosd",
          title: "teste",
          uuid: "84539f75-a6e7-4683-a022-8ac2f05533e9",
          user_uuid: "d0027811-4f76-4cf2-a24b-bc99ad777950",
        },
      ])
      .execute();
    const action = new DeletePostUsecase(repo);
    await action.execute("84539f75-a6e7-4683-a022-8ac2f05533e9", "d0027811-4f76-4cf2-a24b-bc99ad777950");
    const posts = await repo.findPostsByUserUuid("d0027811-4f76-4cf2-a24b-bc99ad777950");
    expect(posts.length).toBe(0);
  });
});
