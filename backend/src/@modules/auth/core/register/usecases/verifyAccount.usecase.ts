import { UserEntity } from "../entities/user.entity";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";
import { RegisterRepositoryInterface } from "../registerRepository.interface";
import { RegisterGatewayInterface } from "../registerGateway.interface";

export class VerifyAccountUsecase {
  constructor(
    readonly gateway: RegisterGatewayInterface,
    readonly repo: RegisterRepositoryInterface,
  ) {}
  public async execute(token: string): Promise<UserEntity> {
    const tokenDecoded = await this.gateway.tokenDecoding(token);
    const user = await this.repo.findByEmail(tokenDecoded.email);
    if (!user) {
      throw new apiError("Esse usuario não foi encontrado em nosso banco de dados", 404, "not_found");
    } else if (user.is_verify() === true) {
      throw new apiError("Esse usuario já foi verificado", 404, "NOT_FOUND");
    }
    await this.repo.verifyAccount(user);
    return user;
  }
}
