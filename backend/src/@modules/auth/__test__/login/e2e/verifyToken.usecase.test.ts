import { VerifyToken } from "@modules/auth/core/login/usecases/verifyToken.usecase";
import { LoginGatewayLocal } from "@modules/auth/infra/login/gateway/loginGatewayLocal.local";
import { LoginRepositoryTypeorm } from "@modules/auth/infra/login/repository/loginRepositoryTypeOrm.orm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: LoginRepositoryTypeorm;
let gateway: LoginGatewayLocal;

describe("Deve testar o verifyUserUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new LoginRepositoryTypeorm(dataSource);
    gateway = new LoginGatewayLocal(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve verificar um token jwt", async () => {
    const action = new VerifyToken(gateway, repo);
    const user = await action.execute(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZDAwMjc4MTEtNGY3Ni00Y2YyLWEyNGItYmM5OWFkNzc3OTUwIiwibmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBnbWFpbC5jb20iLCJpYXQiOjE3MDczOTYzNTl9.N_PRwItA_qC3XBmylRiKFctW2Gy0wxiQ6wA-U1PGuK4",
    );
    expect(user.email()).toBe("user1@gmail.com");
  });
  test("Deve emitir erro de usuario não autorizado", async () => {
    const action = new VerifyToken(gateway, repo);
    await expect(async () => {
      await action.execute(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZDAwMjc4MTEtNGY3Ni00Y2YyLyNGItYmM5OWFkNzc3OTUwIiwibmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBnbWFpbC5jb20iLCJpYXQiOjE3MDczOTYzNTl9.N_PRwItA_qC3XBmylRiKFctW2Gy0wxiQ6wA-U1PGuK4",
      );
    }).rejects.toThrow("Você não está autorizado");
  });
});
