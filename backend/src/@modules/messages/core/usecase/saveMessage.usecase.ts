import { MessageEntity } from "../entities/messageEntity.entity";
import { MessagesRepositoryInterface } from "../messagesRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { randomUUID } from "crypto";
import { ChatsSocketInterface } from "../ChatsSocket.interface";
export type saveMessageInput = {
  text: string;
  senderUuid: string;
  chatUuid: string;
};
export class SaveMessageUsecase {
  constructor(
    readonly repo: MessagesRepositoryInterface,
    readonly socket: ChatsSocketInterface,
  ) {}
  public async execute(input: saveMessageInput): Promise<MessageEntity> {
    const user = await this.repo.findUserById(input.senderUuid);
    const chat = await this.repo.findChatByUuid(input.chatUuid);
    const contact = await this.repo.findContactByUuid(input.chatUuid);
    if (!user) {
      throw new apiError("Uusuario não encontrado", 404, "not_found");
    } else if (!chat && !contact) {
      throw new apiError("Chat não encontrado", 404, "not_found");
    }
    const message = new MessageEntity({
      chatUuid: input.chatUuid,
      sender: user,
      text: input.text,
      uuid: randomUUID(),
    });
    await this.repo.save(message);
    await this.socket.sendMessage(message);
    return message;
  }
}
