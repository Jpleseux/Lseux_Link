import { ResendEmailVerifyAccountUsecase } from "@modules/auth/core/register/usecases/resendEmailVerifyAccount.usecase";
import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";
import { registerEmailQueueMemory } from "@modules/auth/infra/register/queue/registerEmailQueue.rabbitmq.memory";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: RegisterRepositoryTypeOrm;
let gateway: RegisterGatewayLocal;
let queue: registerEmailQueueMemory;
describe("Deve testar o ResendEmailVerifyAccountUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new RegisterRepositoryTypeOrm(dataSource);
    queue = new registerEmailQueueMemory();
    gateway = new RegisterGatewayLocal(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve reenviar um email", async () => {
    const action = new ResendEmailVerifyAccountUsecase(repo, queue, gateway);
    const token = await action.execute("user2@gmail.com");
    const tokenDecoded = await gateway.tokenDecoding(token);
    expect(tokenDecoded.email).toBe("user2@gmail.com");
  });
  test("Deve emitir erro de usuario inexistente", async () => {
    const action = new ResendEmailVerifyAccountUsecase(repo, queue, gateway);
    await expect(async () => {
      await action.execute("user4@gmail.com");
    }).rejects.toThrow("Usuario não encontrado");
  });
  test("Deve emitir erro de usuario ja'verificado", async () => {
    const action = new ResendEmailVerifyAccountUsecase(repo, queue, gateway);
    await expect(async () => {
      await action.execute("user1@gmail.com");
    }).rejects.toThrow("Esse usuario já foi verificado");
  });
});
