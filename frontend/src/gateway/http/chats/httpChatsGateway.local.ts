import { ChatEntity } from "../../../entities/chats/chatEntity.entity";
import { MessageEntity } from "../../../entities/chats/messageEntity.entity";
import { UserEntity } from "../../../entities/chats/user.entity";
import httpClient from "../../../http/httpClient";
import { chatResponse, ChatsGatewayInterface, findChatsByUser, FindUserOutput, SaveEntityInputDto } from "../../interfaces/chats/chatsGateway";

export type Output = {
    status: number,
    message: string,
}

export class HttpChatsGateway implements ChatsGatewayInterface {
    constructor(readonly httpClient: httpClient) {}

    async findContactUsers(query: string): Promise<FindUserOutput> {
        const response = await this.httpClient.get(`chats/user/${query}`);
        const data = response.data;

        if (response && response.status < 300) {
            const users: UserEntity[] = (data.users ?? []).map((user) => {
                return new UserEntity(user);
            });

            return {
                status: response.status,
                user: users,
                message: response.data.message ?? "Success",
            };
        }

        return {
            status: response.status,
            message: response.data.message ?? "Error fetching users",
        };
    }

    async findChatsByUser(): Promise<findChatsByUser> {
        const response = await this.httpClient.get("chats");
        const data = response.data;
        if (response && response.status < 300) {
            const chats = (data.chats ?? []).map((chat) => {
                return new ChatEntity({
                    uuid: chat.uuid,
                    name: chat.name,
                    type: chat.type,
                    messages: (chat.messages ?? []).map((message) => {
                        return new MessageEntity({
                            chatUuid: message.chatUuid,
                            sender: new UserEntity(message.sender),
                            text: message.text,
                            uuid: message.uuid,
                        });
                    }),
                    users: (chat.users ?? []).map((user) => {
                        return new UserEntity(user);
                    }),
                });
            });

            return {
                status: response.status,
                chats: chats,
                message: response.data.message ?? "Success",
            };
        }

        return {
            status: response.status,
            message: response.data.message ?? "Error fetching chats",
        };
    }
    async saveChat(chat: SaveEntityInputDto): Promise<chatResponse> {
        const response = await this.httpClient.post("chats", chat)
        return {
            status: response.status,
            message: response.data.message ?? "Error fetching chats",
        };
    }
}
