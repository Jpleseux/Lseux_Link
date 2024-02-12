import { ProfileRepositoryInterface } from "../profileRepositoryInterface.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { UserEntity } from "../entities/user.entity";

export type setNewAvatarInput = {
  uuid: string;
  newAvatar: string;
};
export class SetNewAvatarUsecase {
  constructor(readonly repo: ProfileRepositoryInterface) {}
  public async execute(input: setNewAvatarInput): Promise<UserEntity> {
    const user = await this.repo.findUserByUuid(input.uuid);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    }
    user.setAvatar(input.newAvatar);
    await this.repo.setNewAvatar(user);
    return user;
  }
}
