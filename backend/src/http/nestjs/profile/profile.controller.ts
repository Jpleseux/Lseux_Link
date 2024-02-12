import { SetNewAvatarUsecase } from "@modules/profile/core/usecases/setNewAvatar.usecase";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import { Body, Controller, HttpStatus, Patch, Req, Res } from "@nestjs/common";
import { ProfileSetNewAvatarDto } from "./profileSetNewAvatar.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(readonly repo: ProfileRepositoryTypeOrm) {}
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
}
