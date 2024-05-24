import { SetNewAvatarUsecase } from "@modules/profile/core/usecases/setNewAvatar.usecase";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import { Body, Controller, Get, HttpStatus, Patch, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProfileGatewayLocal } from "@modules/profile/infra/gateway/profileGatewayLocal.local";
import { UpdateProfileUsecase } from "@modules/profile/core/usecases/updateProfile.usecase";
import { ProfileUpdateUserRequest } from "./profileUpdateUser.request.dto";
import { FindUserByEmailUsecase } from "@modules/profile/core/usecases/finUserByEmail.usecase";
import { FileInterceptor } from "@nestjs/platform-express";
import multerConfig from "@modules/shared/multer/multerConfig";
import { UploadImageStorageAws } from "@modules/profile/infra/storage/uploadImageStorage.aws";

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(
    readonly repo: ProfileRepositoryTypeOrm,
    readonly gateway: ProfileGatewayLocal,
    readonly storage: UploadImageStorageAws,
  ) {}
  @UseInterceptors(FileInterceptor("file", multerConfig))
  @Patch("update/avatar")
  async setNewAvatarToUser(@Req() request: Request, @Res() response, @UploadedFile() file: Express.Multer.File) {
    const tokenDecoded = request["tokenPayload"];
    const action = new SetNewAvatarUsecase(this.repo, this.storage);
    const user = await action.execute({
      uuid: tokenDecoded.uuid,
      newAvatar: file,
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
