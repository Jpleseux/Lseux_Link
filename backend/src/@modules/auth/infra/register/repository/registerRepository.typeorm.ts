import { DataSource } from "typeorm";
import { UserEntity } from "@modules/auth/core/register/entities/user.entity";
import { RegisterRepositoryInterface } from "@modules/auth/core/register/registerRepository.interface";
import { UserModel } from "../../database/models/UserModel.model";

export class RegisterRepositoryTypeOrm implements RegisterRepositoryInterface {
  constructor(readonly dataSource: DataSource) {}
  async saveUser(user: UserEntity): Promise<UserEntity> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserModel)
      .values([
        {
          email: user.email(),
          password: user.password(),
          phone_number: user.phone_number(),
          userName: user.userName(),
          uuid: user.uuid(),
        },
      ])
      .execute();
    return user;
  }
  async verifyAccount(user: UserEntity): Promise<void> {
    await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .update(UserModel)
      .set({ is_verify: true })
      .where("uuid = :uuid", { uuid: user.uuid() })
      .execute();
  }
  async findByEmail(email: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .where("email = :email", { email: email })
      .getOne();
    if (!userDb) {
      return;
    }
    return new UserEntity(userDb);
  }
  async recoveryPassword(user: UserEntity): Promise<void> {
    await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .update(UserModel)
      .set({ password: user.password() })
      .where("uuid = :uuid", { uuid: user.uuid() })
      .execute();
  }
}
