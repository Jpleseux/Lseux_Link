import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthRegisterUserResponse } from "./authRegister.response.dto";
import { AuthRegisterUserRequestDto } from "./authRegister.request.dto";
import { saveUserUsecase } from "@modules/auth/core/register/usecases/saveUser.usecase";
import { RegisterEmailQueue } from "@modules/auth/infra/register/queue/registerEmailQueue.rabbitmq";
import { AuthLoginRequestDto } from "./authLogin.request.dto";
import { LoginUsecase } from "@modules/auth/core/login/usecases/login.usecase";
import { LoginGatewayLocal } from "@modules/auth/infra/login/gateway/loginGatewayLocal.local";
import { LoginRepositoryTypeorm } from "@modules/auth/infra/login/repository/loginRepositoryTypeOrm.orm";
import { VerifyToken } from "@modules/auth/core/login/usecases/verifyToken.usecase";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    readonly registerRepo: RegisterRepositoryTypeOrm,
    readonly registerGateway: RegisterGatewayLocal,
    readonly queue: RegisterEmailQueue,
    readonly loginGateway: LoginGatewayLocal,
    readonly loginRepo: LoginRepositoryTypeorm,
  ) {}
  @ApiOkResponse({
    description: "",
    type: AuthRegisterUserResponse,
    isArray: false,
  })
  @Post("save/user")
  async saveUser(@Body() body: AuthRegisterUserRequestDto, @Res() response) {
    try {
      const action = new saveUserUsecase(this.registerRepo, this.registerGateway, this.queue);
      const user = await action.execute(body);
      response.status(HttpStatus.OK).send({
        message:
          "Usuario salvo com sucesso, um email de verificação foi enviado a sua caixa de email, acesse o link para verificar.",
        user: user.props,
      });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
  }
  @Post("login")
  async Login(@Body() body: AuthLoginRequestDto, @Res() response) {
    const action = new LoginUsecase(this.loginGateway, this.loginRepo);
    const token = await action.execute(body);
    response.status(HttpStatus.OK).send({
      message: "Login realizado com sucesso.",
      token: token,
    });
  }
  @Get("verify/:token")
  async verifyToken(@Res() response, @Param("token") token: string) {
    const action = new VerifyToken(this.loginGateway, this.loginRepo);
    const user = await action.execute(token);
    response.status(HttpStatus.ACCEPTED).send({
      message: "Usuario Autorizado.",
      token: user.props,
    });
  }
}
