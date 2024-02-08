import { UserEntity } from "../entities/user.entity";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";

export class VerifyAccountUsecase {
  constructor(
    readonly gateway: LoginGatewayInterface,
    readonly repo: LoginRepositoryInterface,
  ) {}
  public async execute(token: string): Promise<UserEntity> {
    const tokenDecoded = await this.gateway.tokenDecoding(token);
    const user = await this.repo.findByEmail(tokenDecoded.email);
    if (!user) {
      throw new apiError("Esse usuario não foi encontrado em nosso banco de dados", 404, "not_found");
    }
    await this.repo.
  }
}
