import { ChatEntity } from "../../../entities/chats/chatEntity.entity";
import { UserEntity } from "../../../entities/chats/user.entity";
export type FindUserOutput = {
    status: number,
    user?: UserEntity[],
    message: string,
}
export type findChatsByUser = {
    status: number,
    chats?: ChatEntity[],
    message: string,
}
export type SaveEntityInputDto  = {
    name: string;
    type: string;
    users: string[];
}
export type chatResponse = {
    status: number,
    message: string,
}
export interface ChatsGatewayInterface {
    findContactUsers(query: string): Promise<FindUserOutput>;
    findChatsByUser(): Promise<findChatsByUser>;
    saveChat(chat: SaveEntityInputDto): Promise<chatResponse>;
}