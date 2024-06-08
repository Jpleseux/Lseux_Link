import { MessageEntity } from "../../../entities/chats/messageEntity.entity";
import httpClient from "../../../http/httpClient";
import { MessageOutput, MessagesGatewayInterface, messagesOutput } from "../../interfaces/messages/messagesGateway.interface";

export class HttpMessagesGateway implements MessagesGatewayInterface {
    constructor(readonly httpClient: httpClient) {}
    async sendMessage(message: string, chatUuid: string): Promise<messagesOutput> {
        const response = await this.httpClient.post("messages", {text: message, chatUuid: chatUuid});
        const { data } = response;
        if (response && response.status < 300) {
            return {
                messages: new MessageEntity(data.messages),
                status: response.status,
                message: data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async deleteMessage(uuid: string): Promise<MessageOutput> {
        const response = await this.httpClient.delete("messages", uuid);
        const { data } = response;
        return {
            status: response.status,
            message: data.message,
        }
    }
}