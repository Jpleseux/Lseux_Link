import { UserEntity } from "../../../entities/chats/user.entity";
import httpClient from "../../../http/httpClient";
import { ChatsGatewayInterface, FindUserOutput } from "../../interfaces/chats/chatsGateway";

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
            const users: UserEntity[] = data.users.map((user) => {
                return new UserEntity(user)
            }) 
            return {
                status: response.status,
                user: users,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
}