import { SaveChatUsecase } from "@modules/chats/core/usecase/saveChat.usecase";
import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { ChatsUserModel } from "@modules/chats/infra/database/models/UserModel.model";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: ChatRepositoryTypeOrm;
describe("Deve testar o SaveChatUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ChatRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve salvar o chat", async () => {
    await SaveData();
    const chat = await new SaveChatUsecase(repo).execute({
      name: "teste",
      type: "personal",
      users: ["29373e6f-bc2a-4304-9cb1-57c60cd88750"],
      userUuid: "29373e6f-bc2a-4304-9cb1-57c60cd88750",
    });
    expect(chat.users()[0].userName()).toBe("joao");
    expect(chat.name()).toBe("teste");
    await dataSource.createQueryBuilder().delete().from(ChatsModel).where("uuid = :uuid", { uuid: chat.uuid() }).execute();
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
        uuid: "29373e6f-bc2a-4304-9cb1-57c60cd88750",
      },
    ])
    .execute();
}
async function DeleteData() {
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsUserModel)
    .where("uuid = :userUuid", { userUuid: "29373e6f-bc2a-4304-9cb1-57c60cd88750" })
    .execute();
}
