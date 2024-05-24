import { UserEntity } from "../entities/user.entity";
import { ProfileRepositoryInterface } from "../profileRepositoryInterface.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class FindUserByEmailUsecase {
  constructor(readonly repo: ProfileRepositoryInterface) {}
  public async execute(email: string): Promise<UserEntity> {
    const user = await this.repo.findUserByEmail(email);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    }
    user.setAvatar(process.env.STORAGE_BASE_URL + user.avatar());
    return user;
  }
}
