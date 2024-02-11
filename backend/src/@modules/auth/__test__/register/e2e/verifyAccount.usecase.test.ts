import { VerifyAccountUsecase } from "@modules/auth/core/register/usecases/verifyAccount.usecase";
import { UserModel } from "@modules/auth/infra/database/models/UserModel.model";
import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: RegisterRepositoryTypeOrm;
let gateway: RegisterGatewayLocal;
describe("Deve testar o VerifyAccountUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new RegisterRepositoryTypeOrm(dataSource);
    gateway = new RegisterGatewayLocal(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve verificar uma conta", async () => {
    const user = await repo.findByEmail("user2@gmail.com");
    const token = await gateway.tokenGenerate(user);
    const action = new VerifyAccountUsecase(gateway, repo);
    await action.execute(token);
    const userAfterUsecase = await repo.findByEmail("user2@gmail.com");
    expect(userAfterUsecase.is_verify()).toBe(true);
    await dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .update(UserModel)
      .set({ is_verify: false })
      .where("uuid = :uuid", { uuid: user.uuid() })
      .execute();
  });
});
