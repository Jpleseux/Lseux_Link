import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { MessagesRepositoryInterface } from "@modules/messages/core/messagesRepository.interface";
import { DataSource } from "typeorm";
import { MessagesUserModel } from "../database/models/UserModel.model";
import { MessageEntity } from "@modules/messages/core/entities/messageEntity.entity";
import { MessageModel } from "../database/models/MessageModel.model";
import { ChatEntity } from "@modules/chats/core/entity/chatEntity.entity";
import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";

export class MessagesRepositoryTypeOrm implements MessagesRepositoryInterface {
  constructor(readonly dataSource: DataSource) {}
  async findUserById(uuid: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(MessagesUserModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!userDb) {
      return;
    }
    return new UserEntity({
      userName: userDb.userName,
      uuid: userDb.uuid,
      avatar: userDb.avatar,
    });
  }
  async findChatByUuid(uuid: string): Promise<ChatEntity> {
    const chatDb = await this.dataSource
      .getRepository(ChatsModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!chatDb) {
      return;
    }
    return new ChatEntity({
      uuid: chatDb.uuid,
      name: chatDb.name,
      type: chatDb.type,
      messages: [],
      users: await Promise.all(
        chatDb.user_uuids.map((uuid) => {
          return this.findUserById(uuid);
        }),
      ),
    });
  }
  async save(message: MessageEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(MessageModel)
      .values([
        {
          chat_uuid: message.chatUuid(),
          message: message.text(),
          sender_uuid: message.sender().uuid(),
          uuid: message.uuid(),
        },
      ])
      .execute();
  }
  async deleteMessage(uuid: string): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from(MessageModel).where("uuid = :uuid", { uuid: uuid }).execute();
  }
  async findMessageByUuid(uuid: string): Promise<MessageEntity> {
    const messageDB = await this.dataSource
      .getRepository(MessageModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!messageDB) {
      return;
    }
    return new MessageEntity({
      uuid: messageDB.uuid,
      chatUuid: messageDB.chat_uuid,
      sender: await this.findUserById(messageDB.sender_uuid),
      text: messageDB.message,
    });
  }
  async searchNewContacts(search: string): Promise<UserEntity[]> {
    const users = await this.dataSource
      .getRepository(MessagesUserModel)
      .createQueryBuilder("user")
      .where("user.userName ILIKE :query", { query: `%${search}%` })
      .orWhere("user.email ILIKE :query", { query: `%${search}%` })
      .getMany();
    if (!users || (users && users.length === 0)) {
      return [];
    }
    return users.map((user) => {
      return new UserEntity({
        userName: user.userName,
        uuid: user.uuid,
        avatar: process.env.STORAGE_BASE_URL + user.avatar,
      });
    });
  }
}
