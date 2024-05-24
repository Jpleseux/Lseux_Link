import { SavePostUsecase } from "@modules/posts/core/usecase/savePost.usecase";
import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import { StorageUploadMemory } from "@modules/posts/infra/storage/storageUploadImage.storage.memory";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: PostsRepositoryTypeOrm;
const storage = new StorageUploadMemory();
describe("Deve testar o savePostUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new PostsRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve salvar um post de um usuario", async () => {
    const action = new SavePostUsecase(repo, storage);
    const res = await action.execute({
      images: [""],
      title: "Titulo teste",
      text: "texto teste",
      userUuid: "d0027811-4f76-4cf2-a24b-bc99ad777950",
    });
    const post = await repo.findPostByUuid(res.uuid());
    expect(post.title()).toBe("Titulo teste");
    await repo.DeletePostByUuid(post.uuid());
  });
});
