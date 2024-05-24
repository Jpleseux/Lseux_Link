import { UpdateChatUsecase } from "@modules/chats/core/usecase/updateChat.usecase";
import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { UserModel } from "@modules/chats/infra/database/models/UserModel.model";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: ChatRepositoryTypeOrm;
describe("Deve testar o UpdateChatUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ChatRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve atualizar o chat pelo UUID", async () => {
    await SaveData();
    const chat = await new UpdateChatUsecase(repo).execute(
      "93485978-e9ec-4c2c-adef-978fb8bfffcb",
      {
        name: "teste 3",
        type: "private",
      },
      "43cd187d-3c35-4544-acdb-812512b5b347",
    );
    expect(chat.users().length).toBe(1);
    expect(chat.type()).toBe("private");
    expect(chat.name()).toBe("teste 3");
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
        uuid: "43cd187d-3c35-4544-acdb-812512b5b347",
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
        user_uuids: ["43cd187d-3c35-4544-acdb-812512b5b347"],
        uuid: "93485978-e9ec-4c2c-adef-978fb8bfffcb",
      },
    ])
    .execute();
}
async function DeleteData() {
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(UserModel)
    .where("uuid = :userUuid", { userUuid: "43cd187d-3c35-4544-acdb-812512b5b347" })
    .execute();
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsModel)
    .where("uuid = :uuid", { uuid: "93485978-e9ec-4c2c-adef-978fb8bfffcb" })
    .execute();
}
