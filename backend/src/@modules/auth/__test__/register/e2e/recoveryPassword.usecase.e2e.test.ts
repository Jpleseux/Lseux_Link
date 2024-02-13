import { RecoveryPasswordUsecase } from "@modules/auth/core/register/usecases/recoveryPassword.usecase";
import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import dataSource from "@modules/shared/infra/database/datasource";
import * as bcryptjs from "bcryptjs";

let repo: RegisterRepositoryTypeOrm;
let gateway: RegisterGatewayLocal;
describe("Deve testar o RecoveryPasswordUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new RegisterRepositoryTypeOrm(dataSource);
    gateway = new RegisterGatewayLocal(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve modificar uma senha", async () => {
    const action = new RecoveryPasswordUsecase(repo, gateway);
    const user = await action.execute("user1@gmail.com", "1234");
    const response = await bcryptjs.compare("1234", user.password());
    expect(response).toBe(true);
    await action.execute("user1@gmail.com", "123456");
  });
  test("Deve emitir erro de usuario não encontrado", async () => {
    const action = new RecoveryPasswordUsecase(repo, gateway);
    await expect(async () => {
      await action.execute("user4@gmail.com", "8234");
    }).rejects.toThrow("Usuario não encontrado");
  });
});
