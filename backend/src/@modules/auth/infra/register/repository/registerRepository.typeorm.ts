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
  async getUserByEMail(email: string): Promise<UserEntity> {
    const user = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .where("email = :email", { email: email })
      .getOne();
    if (!user) {
      return;
    }
    return new UserEntity({
      email: user.email,
      password: user.password,
      phone_number: user.phone_number,
      userName: user.userName,
      isVerify: user.is_verify,
      uuid: user.uuid,
    });
  }
}
