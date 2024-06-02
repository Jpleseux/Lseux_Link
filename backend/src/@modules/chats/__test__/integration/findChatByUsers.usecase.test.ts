import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { ChatsUserModel } from "@modules/chats/infra/database/models/UserModel.model";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: ChatRepositoryTypeOrm;
describe("Querys", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ChatRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve achar chats pelo UUID do usuario", async () => {
    await SaveData();
    const chats = await repo.findChatsByUsers(["26b2240d-2a2d-4a46-9626-9d1b85898042"]);
    expect(chats.length).toBe(1);
    expect(chats[0].name()).toBe("teste");
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
        uuid: "26b2240d-2a2d-4a46-9626-9d1b85898042",
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
        user_uuids: ["26b2240d-2a2d-4a46-9626-9d1b85898042"],
        uuid: "c615d6c4-3243-45a9-b4fe-82ef74e7112c",
      },
    ])
    .execute();
}
async function DeleteData() {
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsUserModel)
    .where("uuid = :userUuid", { userUuid: "26b2240d-2a2d-4a46-9626-9d1b85898042" })
    .execute();
  await dataSource
    .createQueryBuilder()
    .delete()
    .from(ChatsModel)
    .where("uuid = :uuid", { uuid: "c615d6c4-3243-45a9-b4fe-82ef74e7112c" })
    .execute();
}
