import { DeleteChateUsecase } from "@modules/chats/core/usecase/deleteChat.usecase";
import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { ChatsUserModel } from "@modules/chats/infra/database/models/UserModel.model";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: ChatRepositoryTypeOrm;
describe("Deve testar o DeleteChatUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ChatRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve deletar o chat pelo UUID", async () => {
    await SaveData();
    await new DeleteChateUsecase(repo).execute("e1d659d5-74b3-4272-8476-e4e561093c80", "299278a9-0c8b-4c2e-8a79-26929352e756");
    const chat = await repo.findChatByUuid("e1d659d5-74b3-4272-8476-e4e561093c80");
    expect(!chat).toBe(true);
    await DeleteData();
  });
});
async function SaveData() {
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(ChatsUserModel)
    .values([
      {
        avatar: "jiodrfjidfbfgbuv",
        email: "joao@gmail.com",
        is_verify: true,
        password: "2423423",
        phone_number: "997813834",
        userName: "joao",
        uuid: "299278a9-0c8b-4c2e-8a79-26929352e756",
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
        user_uuids: ["299278a9-0c8b-4c2e-8a79-26929352e756"],
        uuid: "e1d659d5-74b3-4272-8476-e4e561093c80",
      },
    ])
    .execute();
}
async function DeleteData() {
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsUserModel)
    .where("uuid = :userUuid", { userUuid: "299278a9-0c8b-4c2e-8a79-26929352e756" })
    .execute();
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsModel)
    .where("uuid = :uuid", { uuid: "e1d659d5-74b3-4272-8476-e4e561093c80" })
    .execute();
}
