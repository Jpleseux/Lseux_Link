import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";
import { LoginGatewayInterface } from "../loginGateway.interface";
import { LoginRepositoryInterface } from "../loginRepository.interface";
export type LoginInput = {
  email: string;
  password: string;
};
export class LoginUsecase {
  constructor(
    readonly gateway: LoginGatewayInterface,
    readonly repo: LoginRepositoryInterface,
  ) {}
  public async execute(input: LoginInput): Promise<string> {
    const user = await this.repo.findByEmail(input.email);
    if (!user) {
      throw new apiError("Esse usuario não foi encontrado em nosso banco de dados", 404, "not_found");
    } else if (user.isVerify() === false) {
      throw new apiError(
        "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token",
        400,
        "item_already_exist",
      );
    } else if (!(await this.gateway.userValidatePassword(user, input.password))) {
      throw new apiError("Senha Incorreta", 400, "invalid_item");
    }
    return await this.gateway.tokenGenerate(user);
  }
}
