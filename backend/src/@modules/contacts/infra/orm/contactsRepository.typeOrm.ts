import { ContactsRepositoryInterface } from "@modules/contacts/core/contactsRepository.interface";
import { DataSource } from "typeorm";
import { ContactsUserModel } from "../database/models/UserModel.model";
import { UserEntity } from "@modules/contacts/core/entities/user.entity";
import { ContactEntity } from "@modules/contacts/core/entities/contacts.entity";
import { ContactsModel } from "../database/models/contactModel.model";
import { ContactsMessageModel } from "../database/models/MessageModel.model";
import { MessageEntity } from "@modules/contacts/core/entities/messageEntity.entity";

export class ContactsRepositoryTypeOrm implements ContactsRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {}
  async findUserByUuid(uuid: string): Promise<UserEntity> {
    const user = await this.dataSource
      .getRepository(ContactsUserModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!user) {
      return;
    }
    const userEn = new UserEntity({
      userName: user.userName,
      uuid: user.uuid,
      avatar: user.avatar,
    });
    userEn.setAvatar(process.env.STORAGE_BASE_URL + user.avatar);
    return userEn;
  }
  async connect(contact: ContactEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(ContactsModel)
      .values([
        {
          first_user: contact.firstUser().uuid(),
          second_user: contact.secondUser().uuid(),
          uuid: contact.uuid(),
        },
      ])
      .execute();
  }
  async disconnect(uuid: string): Promise<void> {
    await this.DeleteContactsMessages(uuid);
    await this.dataSource.createQueryBuilder().delete().from(ContactsModel).where("uuid = :uuid", { uuid: uuid }).execute();
  }
  async findContactByUuid(uuid: string): Promise<ContactEntity> {
    const contact = await this.dataSource
      .getRepository(ContactsModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!contact) {
      return;
    }
    return new ContactEntity({
      firstUser: await this.findUserByUuid(contact.first_user),
      secondUser: await this.findUserByUuid(contact.second_user),
      uuid: contact.uuid,
      messages: await this.FindMessagesByChat(contact.uuid),
    });
  }
  async findContactsByUsers(user: UserEntity): Promise<ContactEntity[]> {
    const contacts = await this.dataSource
      .getRepository(ContactsModel)
      .createQueryBuilder()
      .where("first_user = :uuid", { uuid: user.uuid() })
      .orWhere("second_user = :uuid", { uuid: user.uuid() })
      .getMany();
    if (!contacts || (contacts && contacts.length === 0)) {
      return [];
    }
    return await Promise.all(
      await contacts.map(async (contact) => {
        return new ContactEntity({
          firstUser: await this.findUserByUuid(contact.first_user),
          secondUser: await this.findUserByUuid(contact.second_user),
          uuid: contact.uuid,
          messages: await this.FindMessagesByChat(contact.uuid),
        });
      }),
    );
  }
  private async DeleteContactsMessages(uuid: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ContactsMessageModel)
      .where("chat_uuid = :uuid", { uuid: uuid })
      .execute();
  }
  private async FindMessagesByChat(uuid: string): Promise<MessageEntity[]> {
    const messagesDb = await this.dataSource
      .getRepository(ContactsMessageModel)
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
          sender: await this.findUserByUuid(message.sender_uuid),
          text: message.message,
          uuid: message.uuid,
        });
      }),
    );
  }
  async findUnityContact(contact: ContactEntity): Promise<ContactEntity> {
    const contactDb = await this.dataSource
      .getRepository(ContactsModel)
      .createQueryBuilder()
      .where("first_user = :uuid", { uuid: contact.firstUser().uuid() })
      .orWhere("second_user = :uuid", { uuid: contact.secondUser().uuid() })
      .orWhere("first_user = :uuid", { uuid: contact.secondUser().uuid() })
      .orWhere("second_user = :uuid", { uuid: contact.firstUser().uuid() })
      .getOne();
    if (!contactDb) {
      return;
    }
    return new ContactEntity({
      firstUser: await this.findUserByUuid(contactDb.first_user),
      secondUser: await this.findUserByUuid(contactDb.second_user),
      uuid: contactDb.uuid,
      messages: await this.FindMessagesByChat(contactDb.uuid),
    });
  }
}
