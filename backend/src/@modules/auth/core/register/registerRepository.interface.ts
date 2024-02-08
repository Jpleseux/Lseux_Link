/* eslint-disable prettier/prettier */
import { UserEntity } from "./entities/user.entity";
export interface RegisterRepositoryInterface {
  saveUser(user: UserEntity): Promise<UserEntity>;
  getUserByEMail(email: string): Promise<UserEntity>;
  verifyAccount(uuid: string): Promise<void>;
}
