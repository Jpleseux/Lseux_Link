import { ChatsSocketInterface } from "@modules/messages/core/ChatsSocket.interface";
import { MessageEntity } from "@modules/messages/core/entities/messageEntity.entity";

export class ChatSocketMemory implements ChatsSocketInterface {
  async sendMessage(input: MessageEntity): Promise<void> {}
  async deleteMessage(uuid: string): Promise<void> {}
}
