import { MessageEntity } from "./entities/messageEntity.entity";

export interface ChatsSocketInterface {
  sendMessage(input: MessageEntity): Promise<void>;
  deleteMessage(uuid: string): Promise<void>;
}
