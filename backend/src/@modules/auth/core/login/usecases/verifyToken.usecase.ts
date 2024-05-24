import { UserEntity } from "../entities/user.entity";
import { LoginGatewayInterface } from "../loginGateway.interface";
import { LoginRepositoryInterface } from "../loginRepository.interface";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";

export class VerifyToken {
  constructor(
    readonly gateway: LoginGatewayInterface,
    readonly repo: LoginRepositoryInterface,
  ) {}
  public async execute(token: string): Promise<UserEntity> {
    const tokenDecoded = await this.gateway.tokenDecoding(token);
    const user = await this.repo.findByEmail(tokenDecoded.email);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    }
    user.setAvatar(process.env.STORAGE_BASE_URL + user.avatar());
    return user;
  }
}
