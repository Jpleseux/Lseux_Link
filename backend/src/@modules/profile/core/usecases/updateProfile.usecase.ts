import { userProps } from "@modules/auth/core/register/entities/user.entity";
import { ProfileGatewayInterface } from "../profileGatewayInterface.interface";
import { ProfileRepositoryInterface } from "../profileRepositoryInterface.interface";
import { UserEntity } from "../entities/user.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class UpdateProfileUsecase {
  constructor(
    readonly repo: ProfileRepositoryInterface,
    readonly gateway: ProfileGatewayInterface,
  ) {}
  public async execute(uuid: string, newUser: Partial<userProps>): Promise<UserEntity> {
    delete newUser.avatar;
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError("Esse usuario não existe", 404, "NOT_FOUND");
    } else if (!(await this.gateway.validateEmail(newUser.email))) {
      throw new apiError("Email inválido", 400, "NOT_FOUND");
    } else if (user.is_verify() === false) {
      throw new apiError(
        "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token",
        400,
        "item_already_exist",
      );
    }
    await this.repo.updateUser(uuid, newUser);
    const Output = await this.repo.findUserByUuid(uuid);
    user.setAvatar(process.env.STORAGE_BASE_URL + Output.avatar());
    return Output;
  }
}
