/* eslint-disable prettier/prettier */
import { saveUserUsecase } from "@modules/auth/core/register/usecases/saveUser.usecase";
import { UserModel } from "@modules/auth/infra/database/models/UserModel.model";
import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";
import { registerEmailQueueMemory } from "@modules/auth/infra/register/queue/registerEmailQueue.rabbitmq.memory";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: RegisterRepositoryTypeOrm;
let gateway: RegisterGatewayLocal;
let queue: registerEmailQueueMemory;
describe("Deve testar o saveUserUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new RegisterRepositoryTypeOrm(dataSource);
    gateway = new RegisterGatewayLocal(dataSource);
    queue = new registerEmailQueueMemory();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve criar um usuario", async () => {
    const user = {
      email: "user5@gmail.com",
      password: "231231",
      userName: "user5",
      phone_number: "89 999312231",
    };
    const action = new saveUserUsecase(repo, gateway, queue);
    await action.execute(user);
    const userDb = await dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .where("email = :email", { email: user.email })
      .getOne();
    expect(userDb.userName).toBe("user5");
    await dataSource.createQueryBuilder().delete().from(UserModel).where("email = :email", { email: userDb.email }).execute();
  });
  test("Deve emitir erro de email inválido", async () => {
    const user = {
      email: "user58987932gmail.com",
      password: "231231",
      userName: "user5",
      phone_number: "89 999312231",
    };
    const action = new saveUserUsecase(repo, gateway, queue);
    await expect(async () => {
      await action.execute(user);
    }).rejects.toThrow("Este email é inválido");
  })
  test("Deve emitir erro de usuario já existente", async () => {
    const user = {
      email: "user1@gmail.com",
      password: "231231",
      userName: "user5",
      phone_number: "89 999312231",
    };
    const action = new saveUserUsecase(repo, gateway, queue);
    await expect(async () => {
      await action.execute(user);
    }).rejects.toThrow("Este usuario já existe");
  })
  test("Deve emitir erro de usuario já existente mas não foi verificado", async () => {
    const user = {
      email: "user2@gmail.com",
      password: "231231",
      userName: "user5",
      phone_number: "89 999312231",
    };
    const action = new saveUserUsecase(repo, gateway, queue);
    await expect(async () => {
      await action.execute(user);
    }).rejects.toThrow("Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token");
  })
});
