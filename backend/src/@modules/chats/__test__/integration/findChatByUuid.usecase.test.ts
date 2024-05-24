import { FindChatByUuidUsecase } from "@modules/chats/core/usecase/findChatByUuid.usecase";
import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { UserModel } from "@modules/chats/infra/database/models/UserModel.model";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: ChatRepositoryTypeOrm;
describe("Deve testar o FindChatByUuidUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ChatRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve buscar o chat pelo UUID", async () => {
    await SaveData();
    const chat = await new FindChatByUuidUsecase(repo).execute(
      "53d1cc7d-8cea-4431-878f-39ab5c341278",
      "792f9db5-b3b9-4402-9f31-4a309d76eef0",
    );
    expect(chat.users().length).toBe(1);
    expect(chat.type()).toBe("personal");
    await DeleteData();
  });
});
async function SaveData() {
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(UserModel)
    .values([
      {
        avatar: "jiodrfjidfbfgbuv",
        email: "joao@gmail.com",
        is_verify: true,
        password: "2423423",
        phone_number: "997813834",
        userName: "joao",
        uuid: "792f9db5-b3b9-4402-9f31-4a309d76eef0",
      },
    ])
    .execute();
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(ChatsModel)
    .values([
      {
        name: "teste",
        type: "personal",
        user_uuids: ["792f9db5-b3b9-4402-9f31-4a309d76eef0"],
        uuid: "53d1cc7d-8cea-4431-878f-39ab5c341278",
      },
    ])
    .execute();
}
async function DeleteData() {
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(UserModel)
    .where("uuid = :userUuid", { userUuid: "792f9db5-b3b9-4402-9f31-4a309d76eef0" })
    .execute();
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsModel)
    .where("uuid = :uuid", { uuid: "53d1cc7d-8cea-4431-878f-39ab5c341278" })
    .execute();
}
