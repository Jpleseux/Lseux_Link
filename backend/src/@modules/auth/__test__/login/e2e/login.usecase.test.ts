import { LoginUsecase } from "@modules/auth/core/login/usecases/login.usecase";
import { LoginGatewayLocal } from "@modules/auth/infra/login/gateway/loginGatewayLocal.local";
import { LoginRepositoryTypeorm } from "@modules/auth/infra/login/repository/loginRepositoryTypeOrm.orm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: LoginRepositoryTypeorm;
let gateway: LoginGatewayLocal;
describe("Deve testar o saveUserUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new LoginRepositoryTypeorm(dataSource);
    gateway = new LoginGatewayLocal(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve logar um usuario", async () => {
    await dataSource.
    const action = new LoginUsecase(gateway, repo);
    const token = await action.execute({
        email: 
    })
  })
});
