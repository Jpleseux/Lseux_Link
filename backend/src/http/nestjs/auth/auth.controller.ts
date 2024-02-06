import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthRegisterUserResponse } from "./authRegister.response.dto";
import { AuthRegisterUserRequestDto } from "./authRegister.request.dto";
import { saveUserUsecase } from "@modules/auth/core/register/usecases/saveUser.usecase";
import { RegisterEmailQueue } from "@modules/auth/infra/register/queue/registerEmailQueue.rabbitmq";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    readonly registerRepo: RegisterRepositoryTypeOrm,
    readonly registerGateway: RegisterGatewayLocal,
    readonly queue: RegisterEmailQueue,
  ) {}
  @ApiOkResponse({
    description: "",
    type: AuthRegisterUserResponse,
    isArray: false,
  })
  @Post("save/user")
  async saveUser(@Body() body: AuthRegisterUserRequestDto, @Res() response) {
    console.log(body);
    try {
      const action = new saveUserUsecase(this.registerRepo, this.registerGateway, this.queue);
      console.log(body);
      const user = await action.execute(body);
      response.status(HttpStatus.OK).send({
        message: "Usuario salvo com sucesso",
        user: user.props,
      });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send({
        message: error.message,
      });
    }
  }
}
