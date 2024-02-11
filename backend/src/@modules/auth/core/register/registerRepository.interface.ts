/* eslint-disable prettier/prettier */
import { UserEntity } from "./entities/user.entity";
export interface RegisterRepositoryInterface {
  saveUser(user: UserEntity): Promise<UserEntity>;
  verifyAccount(user: UserEntity): Promise<void>;
  findByEmail(email: string): Promise<UserEntity>;
}
