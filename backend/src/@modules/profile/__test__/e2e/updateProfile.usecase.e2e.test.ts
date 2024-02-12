import { UserModel } from "@modules/auth/infra/database/models/UserModel.model";
import { UpdateProfileUsecase } from "@modules/profile/core/usecases/updateProfile.usecase";
import { ProfileGatewayLocal } from "@modules/profile/infra/gateway/profileGatewayLocal.local";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: ProfileRepositoryTypeOrm;
let gateway: ProfileGatewayLocal;
const newUser = {
  email: "jleseux@gmail.com",
  userName: "kiko",
  phone_number: "98287230432",
  avatar: "fsjdkfs",
};
describe("Deve testar o UpdateProfileUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ProfileRepositoryTypeOrm(dataSource);
    gateway = new ProfileGatewayLocal(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve atualizar uma conta", async () => {
    const action = new UpdateProfileUsecase(repo, gateway);
    await action.execute("d0027811-4f76-4cf2-a24b-bc99ad777950", newUser);
    const user = await repo.findUserByUuid("d0027811-4f76-4cf2-a24b-bc99ad777950");
    expect(user.email()).toBe("jleseux@gmail.com");
    await dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .update(UserModel)
      .set({
        email: "user1@gmail.com",
        userName: "user1",
        phone_number: "89 999312231",
        avatar: "tretetreret",
      })
      .where("uuid = :uuid", { uuid: user.uuid() })
      .execute();
  });
  test("Deve emitir erro de usuario já inexistente", async () => {
    const action = new UpdateProfileUsecase(repo, gateway);
    await expect(async () => {
      await action.execute("d0027811-4f76-4cf2-a24b-bc99ad777953", newUser);
    }).rejects.toThrow("Esse usuario não existe");
  });
  test("Deve emitir erro de usuario não verificado", async () => {
    const action = new UpdateProfileUsecase(repo, gateway);
    await expect(async () => {
      await action.execute("e3034bba-ff39-4e38-ba59-a77dd913f5c2", newUser);
    }).rejects.toThrow(
      "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token",
    );
  });
  test("Deve emitir erro de email inválido", async () => {
    const action = new UpdateProfileUsecase(repo, gateway);
    newUser.email = "Jao#toi.com";
    await expect(async () => {
      await action.execute("d0027811-4f76-4cf2-a24b-bc99ad777950", newUser);
    }).rejects.toThrow("Email inválido");
    newUser.email = "jleseux@gmail.com";
  });
});
