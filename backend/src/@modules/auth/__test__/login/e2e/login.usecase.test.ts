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
    const action = new LoginUsecase(gateway, repo);
    const { token } = await action.execute({
      email: "user1@gmail.com",
      password: "123456",
    });
    const tokenDecoded = await gateway.tokenDecoding(token);
    expect(tokenDecoded.email).toBe("user1@gmail.com");
  });
  test("Deve emitir erro de usuario inexistente", async () => {
    const action = new LoginUsecase(gateway, repo);
    await expect(async () => {
      await action.execute({
        email: "user66@gmail.com",
        password: "123456",
      });
    }).rejects.toThrow("Esse usuario não foi encontrado em nosso banco de dados");
  });
  test("Deve emitir erro de usuario existente mas não verificado", async () => {
    const action = new LoginUsecase(gateway, repo);
    await expect(async () => {
      await action.execute({
        email: "user2@gmail.com",
        password: "123456",
      });
    }).rejects.toThrow(
      "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token",
    );
  });
  test("Deve emitir erro de senha inválida", async () => {
    const action = new LoginUsecase(gateway, repo);
    await expect(async () => {
      await action.execute({
        email: "user1@gmail.com",
        password: "12345",
      });
    }).rejects.toThrow("Senha Incorreta");
  });
});
