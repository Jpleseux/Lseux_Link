import { DataSource } from "typeorm";
import { LoginRepositoryInterface } from "../../../core/login/loginRepository.interface";
import { UserModel } from "../../database/models/UserModel.model";
import { UserEntity } from "@modules/auth/core/login/entities/user.entity";

export class LoginRepositoryTypeorm implements LoginRepositoryInterface {
  constructor(readonly datasource: DataSource) {}
  async findByEmail(email: string): Promise<UserEntity> {
    const userModel = await this.datasource
      .getRepository(UserModel)
      .createQueryBuilder("users")
      .orWhere("users.email = :email", { email })
      .getOne();

    if (!userModel) return null;

    return new UserEntity(userModel);
  }
  async recoveryPassword(user: UserEntity, newPassword: string): Promise<void> {
    await this.datasource
      .createQueryBuilder()
      .update(UserModel)
      .set({ password: newPassword })
      .where("uuid = :uuid ", { uuid: user.uuid() })
      .execute();
  }
  async findByUuid(uuid: string): Promise<UserEntity> {
    const userModel = await this.datasource
      .getRepository(UserModel)
      .createQueryBuilder()
      .orWhere("uuid = :uuid", { uuid })
      .getOne();

    if (!userModel) return null;

    return new UserEntity(userModel);
  }
}
