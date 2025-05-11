import { UserEntity } from "./entity/user.entity";

export interface ChatsSocketInterface {
  addUser(user: UserEntity): Promise<void>;
}
