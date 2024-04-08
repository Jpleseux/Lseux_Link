import { userProps } from "@modules/auth/core/register/entities/user.entity";
import { UserEntity } from "./entities/user.entity";

export interface ProfileRepositoryInterface {
  findUserByUuid(uuid: string): Promise<UserEntity>;
  setNewAvatar(user: UserEntity): Promise<void>;
  updateUser(uuid: string, newUser: Partial<userProps>): Promise<void>;
  findUserByEmail(email: string): Promise<UserEntity>;
}
