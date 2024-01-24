import { DataSource } from "typeorm";
import { UserEntity } from "@modules/auth/core/register/entities/user.entity";
import { RegisterRepositoryInterface } from "@modules/auth/core/register/registerRepository.interface";

export class RegisterRepositoryTypeOrm implements RegisterRepositoryInterface {
  constructor(readonly dataSource: DataSource) {}
  async saveUser(user: UserEntity): Promise<UserEntity> {
    await this.dataSource.createQueryBuilder().insert().into(UserModel)
  }
}
