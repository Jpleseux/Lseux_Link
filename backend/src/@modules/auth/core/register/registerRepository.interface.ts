import { UserEntity } from "./entities/user.entity";
export interface RegisterRepositoryInterface {
  saveUser(user: UserEntity): Promise<UserEntity>;
}
