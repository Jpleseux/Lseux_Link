import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { ChatsUserModel } from "@modules/chats/infra/database/models/UserModel.model";
import { SaveMessageUsecase } from "@modules/messages/core/usecase/saveMessage.usecase";
import { MessagesRepositoryTypeOrm } from "@modules/messages/infra/orm/messagesRepository.typeOrm";
import { ChatSocketMemory } from "@modules/messages/infra/socket/chatsSocket.memory";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: MessagesRepositoryTypeOrm;
describe("Deve testar o SaveMessageUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new MessagesRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve salvar uma mensagem", async () => {
    await SaveData();
    const message = await new SaveMessageUsecase(repo, new ChatSocketMemory()).execute({
      chatUuid: "21f7e1d1-ba40-44c9-9120-ac330f05c2e7",
      senderUuid: "25a369c9-fcf5-403e-a43a-1f0c8cfcb093",
      text: "Olá senhor",
    });
    expect(message.sender().userName()).toBe("joao");
    expect(message.text()).toBe("Olá senhor");
    await repo.deleteMessage(message.uuid());
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
        uuid: "25a369c9-fcf5-403e-a43a-1f0c8cfcb093",
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
        user_uuids: ["25a369c9-fcf5-403e-a43a-1f0c8cfcb093"],
        uuid: "21f7e1d1-ba40-44c9-9120-ac330f05c2e7",
      },
    ])
    .execute();
}
async function DeleteData() {
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsUserModel)
    .where("uuid = :userUuid", { userUuid: "25a369c9-fcf5-403e-a43a-1f0c8cfcb093" })
    .execute();
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsModel)
    .where("uuid = :uuid", { uuid: "21f7e1d1-ba40-44c9-9120-ac330f05c2e7" })
    .execute();
}
