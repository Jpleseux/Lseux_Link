require("dotenv").config();
import { ChatsSocketInterface } from "@modules/messages/core/ChatsSocket.interface";
import { MessageEntity } from "@modules/messages/core/entities/messageEntity.entity";
import { SocketConnection } from "@modules/shared/socket/socketConnection";

export class ChatsSocketLocal implements ChatsSocketInterface {
  constructor(readonly server: SocketConnection) {}

  async sendMessage(input: MessageEntity): Promise<void> {
    await this.server.send("send-porcent-mail-lote", input);
  }

  async sendPorcentMailLote(input: any): Promise<void> {
    await this.server.send("send-porcent-mail-lote", input);
  }
}
