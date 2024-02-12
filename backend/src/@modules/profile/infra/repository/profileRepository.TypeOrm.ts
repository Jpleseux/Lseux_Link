import { UserEntity } from "@modules/profile/core/entities/user.entity";
import { ProfileRepositoryInterface } from "@modules/profile/core/profileRepositoryInterface.interface";
import { DataSource } from "typeorm";
import { UserModel } from "../database/models/UserModel.model";

export class ProfileRepositoryTypeOrm implements ProfileRepositoryInterface {
  constructor(readonly dataSource: DataSource) {}
  async findUserByUuid(uuid: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!userDb) {
      return;
    }
    return new UserEntity(userDb);
  }
  async setNewAvatar(user: UserEntity): Promise<void> {
    await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder()
      .update(UserModel)
      .set({ avatar: user.avatar() })
      .where("uuid = :uuid", { uuid: user.uuid() })
      .execute();
  }
}
