import { ChatEntity } from "@modules/chats/core/entity/chatEntity.entity";
import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { randomUUID } from "crypto";

describe("Deve testar a entidade do CHAT", () => {
  test("Deve adicionar um usuario apenas se ele for um chat não pessoal", async () => {
    const chat = new ChatEntity({
      name: "my-first",
      type: "chat_group",
      users: [
        new UserEntity({
          userName: "teste",
          uuid: randomUUID(),
          avatar: "osdkpfmkopjcmdkopsm",
        }),
      ],
      uuid: randomUUID(),
    });
    chat.addUser(
      new UserEntity({
        userName: "teste 3",
        uuid: randomUUID(),
        avatar: "osdkpfmkopjcmdkopsm",
      }),
    );
    expect(chat.users().length).toBe(2);
  });
  test("Deve emitir erro de não poder adicionar usuario", async () => {
    const chat = new ChatEntity({
      name: "my-first",
      type: "personal",
      users: [
        new UserEntity({
          userName: "teste",
          uuid: randomUUID(),
          avatar: "osdkpfmkopjcmdkopsm",
        }),
      ],
      uuid: randomUUID(),
    });
    await expect(async () => {
      chat.addUser(
        new UserEntity({
          userName: "teste 3",
          uuid: randomUUID(),
          avatar: "osdkpfmkopjcmdkopsm",
        }),
      );
    }).rejects.toThrow("Um chat pessoal com um contato não pode adicionar mais usuarios");
  });
  test("Deve verificar se um usuario pode acessar esse chat", async () => {
    const chat = new ChatEntity({
      name: "my-first",
      type: "chat_group",
      users: [
        new UserEntity({
          userName: "teste",
          uuid: "c615d6c4-3243-45a9-b4fe-82ef74e7112c",
          avatar: "osdkpfmkopjcmdkopsm",
        }),
      ],
      uuid: randomUUID(),
    });
    const result = chat.verifyUser(
      new UserEntity({
        userName: "teste",
        uuid: "c615d6c4-3243-45a9-b4fe-82ef74e7112c",
        avatar: "osdkpfmkopjcmdkopsm",
      }),
    );
    expect(result).toBe(true);
  });
});
