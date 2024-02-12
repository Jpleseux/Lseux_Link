import { UserEntity } from "./entities/user.entity";

export interface ProfileRepositoryInterface {
  findUserByUuid(uuid: string): Promise<UserEntity>;
  setNewAvatar(user: UserEntity): Promise<void>;
}
