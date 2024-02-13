import { UserEntity } from "../entities/user.entity";
import { RegisterRepositoryInterface } from "../registerRepository.interface";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";
import { RegisterGatewayInterface } from "../registerGateway.interface";

export class RecoveryPasswordUsecase {
  constructor(
    readonly repo: RegisterRepositoryInterface,
    readonly gateway: RegisterGatewayInterface,
  ) {}
  public async execute(email: string, newPassword: string): Promise<UserEntity> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    } else if (user.is_verify() === false) {
      throw new apiError("Usuario não verificado", 404, "NOT_FOUND");
    }
    user.setPassword(await this.gateway.encryptPassword(newPassword));
    await this.repo.recoveryPassword(user);
    return user;
  }
}
