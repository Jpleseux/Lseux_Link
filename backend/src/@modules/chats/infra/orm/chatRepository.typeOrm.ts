import { ChatRepositoryInterface, UpdateChatInput } from "@modules/chats/core/chatRepository.interface";
import { ChatEntity } from "@modules/chats/core/entity/chatEntity.entity";
import { DataSource } from "typeorm";
import { ChatsModel } from "../database/models/chats.model";
import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { UserModel } from "../database/models/UserModel.model";

export class ChatRepositoryTypeOrm implements ChatRepositoryInterface {
  constructor(readonly dataSource: DataSource) {}
  async save(chat: ChatEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(ChatsModel)
      .values([
        {
          name: chat.name(),
          type: chat.type(),
          user_uuids: chat.users().map((user) => {
            return user.uuid();
          }),
          uuid: chat.uuid(),
        },
      ])
      .execute();
  }
  async findUserByUuid(uuid: string): Promise<UserEntity> {
    const user = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!user) {
      return;
    }
    return new UserEntity({
      userName: user.userName,
      uuid: user.uuid,
      avatar: user.avatar,
    });
  }
  async findChatByUuid(uuid: string): Promise<ChatEntity> {
    const chat = await this.dataSource
      .getRepository(ChatsModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!chat) {
      return;
    }
    return new ChatEntity({
      name: chat.name,
      type: chat.type,
      users: await Promise.all(
        chat.user_uuids.map(async (uuid) => {
          return await this.findUserByUuid(uuid);
        }),
      ),
      uuid: chat.uuid,
    });
  }
  async updateChat(uuid: string, input: Partial<UpdateChatInput>): Promise<void> {
    await this.dataSource.createQueryBuilder().update(ChatsModel).set(input).where("uuid = :uuid", { uuid: uuid }).execute();
  }
  async deleteChat(uuid: string): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from(ChatsModel).where("uuid = :uuid", { uuid: uuid }).execute();
  }
  async findChatsByUsers(uuids: string[]): Promise<ChatEntity[]> {
    const data = await this.dataSource.query(`select * from blog_chats where user_uuids @> $1`, [JSON.stringify(uuids)]);
    if (!data || (data && data.length === 0)) {
      return [];
    }
    const chats: ChatEntity[] = [];
    for (let i = 0; i < data.length; i++) {
      chats.push(
        new ChatEntity({
          name: data[i].name,
          type: data[i].type,
          uuid: data[i].uuid,
          users: await Promise.all(
            await data[i].user_uuids.map(async (uuid) => {
              return await this.findUserByUuid(uuid);
            }),
          ),
        }),
      );
    }
    return chats;
  }
}
