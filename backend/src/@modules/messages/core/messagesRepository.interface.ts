import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { MessageEntity } from "./entities/messageEntity.entity";
import { ChatEntity } from "@modules/chats/core/entity/chatEntity.entity";
import { ContactEntity } from "@modules/contacts/core/entities/contacts.entity";

export interface MessagesRepositoryInterface {
  findUserById(uuid: string): Promise<UserEntity>;
  findChatByUuid(uuid: string): Promise<ChatEntity>;
  findContactByUuid(uuid: string): Promise<ContactEntity>;
  findMessageByUuid(uuid: string): Promise<MessageEntity>;
  save(message: MessageEntity): Promise<void>;
  deleteMessage(uuid: string): Promise<void>;
  searchNewContacts(search: string, actualUser: string): Promise<UserEntity[]>;
}
