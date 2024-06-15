import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { MessagesRepositoryInterface } from "@modules/messages/core/messagesRepository.interface";
import { DataSource } from "typeorm";
import { MessagesUserModel } from "../database/models/UserModel.model";
import { MessageEntity } from "@modules/messages/core/entities/messageEntity.entity";
import { MessageModel } from "../database/models/MessageModel.model";
import { ChatEntity } from "@modules/chats/core/entity/chatEntity.entity";
import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { ContactEntity } from "@modules/contacts/core/entities/contacts.entity";
import { MessagesContactModel } from "../database/models/contactModel.model";

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
    const userEn = new UserEntity({
      userName: userDb.userName,
      uuid: userDb.uuid,
      avatar: userDb.avatar,
    });
    userEn.setAvatar(process.env.STORAGE_BASE_URL + userDb.avatar);
    return userEn;
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
  async searchNewContacts(search: string, actualUser: string): Promise<UserEntity[]> {
    const users = await this.dataSource
      .getRepository(MessagesUserModel)
      .createQueryBuilder("user")
      .where("(user.userName ILIKE :query OR user.email ILIKE :query) AND user.uuid != :uuid", {
        query: `%${search}%`,
        uuid: actualUser,
      })
      .getMany();

    if (!users || users.length === 0) {
      return [];
    }

    return users.map(
      (user) =>
        new UserEntity({
          userName: user.userName,
          uuid: user.uuid,
          avatar: `${process.env.STORAGE_BASE_URL}${user.avatar}`,
        }),
    );
  }
  private async FindMessagesByChat(uuid: string): Promise<MessageEntity[]> {
    const messagesDb = await this.dataSource
      .getRepository(MessageModel)
      .createQueryBuilder()
      .where("chat_uuid = :uuid", { uuid: uuid })
      .orderBy("created_at")
      .getMany();
    if (!messagesDb || (messagesDb && messagesDb.length === 0)) {
      return [];
    }
    return await Promise.all(
      messagesDb.map(async (message) => {
        return new MessageEntity({
          chatUuid: message.chat_uuid,
          sender: await this.findUserById(message.sender_uuid),
          text: message.message,
          uuid: message.uuid,
        });
      }),
    );
  }
  async findContactByUuid(uuid: string): Promise<ContactEntity> {
    const contact = await this.dataSource
      .getRepository(MessagesContactModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .andWhere("blocked = :blocked", { blocked: false })
      .getOne();
    if (!contact) {
      return;
    }
    return new ContactEntity({
      firstUser: await this.findUserById(contact.first_user),
      secondUser: await this.findUserById(contact.second_user),
      uuid: contact.uuid,
      messages: await this.FindMessagesByChat(contact.uuid),
    });
  }
}
