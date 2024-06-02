import { UserEntity } from "../../../entities/chats/user.entity";
export type FindUserOutput = {
    status: number,
    user?: UserEntity[],
    message: string,
}
export interface ChatsGatewayInterface {
    findContactUsers(query: string): Promise<FindUserOutput>;
}