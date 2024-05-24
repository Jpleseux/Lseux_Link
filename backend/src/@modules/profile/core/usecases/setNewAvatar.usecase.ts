import { ProfileRepositoryInterface } from "../profileRepositoryInterface.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { UserEntity } from "../entities/user.entity";
import { UploadImageStorageInterface } from "../storage.interface";

export type setNewAvatarInput = {
  uuid: string;
  newAvatar: Express.Multer.File;
};
export class SetNewAvatarUsecase {
  constructor(
    readonly repo: ProfileRepositoryInterface,
    readonly storage: UploadImageStorageInterface,
  ) {}
  public async execute(input: setNewAvatarInput): Promise<UserEntity> {
    if (!input.newAvatar) {
      throw new apiError("Deve existir uma imagem", 404, "NOT_FOUND");
    }
    const user = await this.repo.findUserByUuid(input.uuid);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    }
    if (user.avatar()) {
      await this.storage.delete(user.avatar());
    }
    const avatar = await this.storage.save(input.newAvatar);
    user.setAvatar(avatar);
    await this.repo.setNewAvatar(user);
    user.setAvatar(process.env.STORAGE_BASE_URL + avatar);
    return user;
  }
}
