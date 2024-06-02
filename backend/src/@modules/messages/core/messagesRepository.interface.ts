import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { MessageEntity } from "./entities/messageEntity.entity";
import { ChatEntity } from "@modules/chats/core/entity/chatEntity.entity";

export interface MessagesRepositoryInterface {
  findUserById(uuid: string): Promise<UserEntity>;
  findChatByUuid(uuid: string): Promise<ChatEntity>;
  findMessageByUuid(uuid: string): Promise<MessageEntity>;
  save(message: MessageEntity): Promise<void>;
  deleteMessage(uuid: string): Promise<void>;
  searchNewContacts(search: string): Promise<UserEntity[]>;
}
