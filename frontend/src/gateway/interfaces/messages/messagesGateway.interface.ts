import { MessageEntity } from "../../../entities/chats/messageEntity.entity";

export type messagesOutput = {
    messages: MessageEntity;
    message: string;
    status:  number;
}
export type MessageOutput = {
    message: string;
    status:  number;
}
export interface MessagesGatewayInterface {
    sendMessage(message: string, chatUuid: string): Promise<messagesOutput>;
    deleteMessage(uuid: string): Promise<MessageOutput>
}