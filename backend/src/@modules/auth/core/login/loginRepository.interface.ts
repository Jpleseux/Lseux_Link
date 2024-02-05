import { UserEntity } from "./entities/user.entity";

export interface LoginRepositoryInterface {
  findByUuid(uuid: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity>;
  recoveryPassword(user: UserEntity, newPassword: string): Promise<void>;
}
