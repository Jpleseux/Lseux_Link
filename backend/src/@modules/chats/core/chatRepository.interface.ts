import { ChatEntity } from "./entity/chatEntity.entity";
import { UserEntity } from "./entity/user.entity";
export type UpdateChatInput = {
  name: string;
  type: string;
};
export interface ChatRepositoryInterface {
  findChatsByUsers(uuids: string[]): Promise<ChatEntity[]>;
  findUserByUuid(uuid: string): Promise<UserEntity>;
  save(chat: ChatEntity): Promise<void>;
  findChatByUuid(uuid: string): Promise<ChatEntity>;
  updateChat(uuid: string, input: Partial<UpdateChatInput>): Promise<void>;
  deleteChat(uuid: string): Promise<void>;
}
