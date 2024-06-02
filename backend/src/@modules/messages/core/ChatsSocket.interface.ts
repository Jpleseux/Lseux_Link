import { MessageEntity } from "./entities/messageEntity.entity";

export interface ChatsSocketInterface {
  sendMessage(input: MessageEntity): Promise<void>;
  sendPorcentMailLote(input: any): Promise<void>;
}
