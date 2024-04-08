import { SetNewAvatarUsecase } from "@modules/profile/core/usecases/setNewAvatar.usecase";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import { Body, Controller, Get, HttpStatus, Patch, Req, Res } from "@nestjs/common";
import { ProfileSetNewAvatarDto } from "./profileSetNewAvatar.dto";
import { ApiTags } from "@nestjs/swagger";
import { ProfileGatewayLocal } from "@modules/profile/infra/gateway/profileGatewayLocal.local";
import { UpdateProfileUsecase } from "@modules/profile/core/usecases/updateProfile.usecase";
import { ProfileUpdateUserRequest } from "./profileUpdateUser.request.dto";
import { FindUserByEmailUsecase } from "@modules/profile/core/usecases/finUserByEmail.usecase";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(
    readonly repo: ProfileRepositoryTypeOrm,
    readonly gateway: ProfileGatewayLocal,
  ) {}
  @Patch("update/avatar")
  async setNewAvatarToUser(@Req() request: Request, @Res() response, @Body() body: ProfileSetNewAvatarDto) {
    const tokenDecoded = request["tokenPayload"];
    const action = new SetNewAvatarUsecase(this.repo);
    const user = await action.execute({
      uuid: tokenDecoded.uuid,
      newAvatar: body.avatar,
    });
    response.status(HttpStatus.OK).send({
      message: "Avatar atualizado com sucesso",
      user: user.props,
    });
  }
  @Patch("update/user")
  async updateUser(@Req() request: Request, @Res() response, @Body() body: ProfileUpdateUserRequest) {
    const tokenDecoded = request["tokenPayload"];
    const action = new UpdateProfileUsecase(this.repo, this.gateway);
    const user = await action.execute(tokenDecoded.uuid, body);
    response.status(HttpStatus.OK).send({
      message: "usuario atualizado com sucesso",
      user: user.props,
    });
  }
  @Get("user/email")
  async FindUserByEmail(@Req() request: Request, @Res() response) {
    const tokenDecoded = request["tokenPayload"];
    const action = new FindUserByEmailUsecase(this.repo);
    const user = await action.execute(tokenDecoded.email);
    response.status(HttpStatus.OK).send({
      message: "Usuario encontrado",
      user: user.props,
    });
  }
}
