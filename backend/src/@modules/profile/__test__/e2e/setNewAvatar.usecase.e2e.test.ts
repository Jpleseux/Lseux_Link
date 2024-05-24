import { StorageUploadMemory } from "@modules/posts/infra/storage/storageUploadImage.storage.memory";
import { SetNewAvatarUsecase } from "@modules/profile/core/usecases/setNewAvatar.usecase";
import { UserModel } from "@modules/profile/infra/database/models/UserModel.model";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: ProfileRepositoryTypeOrm;
const storage = new StorageUploadMemory();
describe("Deve testar o SetNewAvatarUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ProfileRepositoryTypeOrm(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve mudar o avatar de um usuario", async () => {
    const action = new SetNewAvatarUsecase(repo, storage);
    const user = await action.execute({
      uuid: "d0027811-4f76-4cf2-a24b-bc99ad777950",
      newAvatar: "https://lseuxlink.s3.amazonaws.com/",
    });
    expect(user.avatar()).toBe("https://lseuxlink.s3.amazonaws.com/");
    await dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .update(UserModel)
      .set({ avatar: "tretetreret" })
      .where("uuid = :uuid", { uuid: user.uuid() })
      .execute();
  });
  test("Deve emitir erro de usuario já existente", async () => {
    const action = new SetNewAvatarUsecase(repo, storage);
    await expect(async () => {
      await action.execute({ uuid: "d0027811-4f76-4cf2-a24b-bc99ad777951", newAvatar: "owekkonfsoo" });
    }).rejects.toThrow("Usuario não encontrado");
  });
});
