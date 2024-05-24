import { SaveChatUsecase } from "@modules/chats/core/usecase/saveChat.usecase";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SaveEntityInputDto } from "./dto/saveChat.request.dto";
import { FindChatByUuidUsecase } from "@modules/chats/core/usecase/findChatByUuid.usecase";
import { FindChatsByUserUuids } from "@modules/chats/core/usecase/findChatsByUsersUuid.usecase";
import { UpdateEntityInputDto } from "./dto/updateChat.request.dto";
import { UpdateChatUsecase } from "@modules/chats/core/usecase/updateChat.usecase";
import { DeleteChateUsecase } from "@modules/chats/core/usecase/deleteChat.usecase";
import { AddUserToChatUsecase } from "@modules/chats/core/usecase/addUserToChat.usecase";
import { AddNewChatUserInputRequestDto } from "./dto/addNewUserChat.request.dto";

@ApiTags("Chats")
@Controller("chats")
export class ChatsController {
  constructor(readonly repo: ChatRepositoryTypeOrm) {}
  @Post()
  async saveChat(@Body() body: SaveEntityInputDto, @Req() req, @Res() res) {
    const tokenDecoded = req["tokenPayload"];
    const chat = await new SaveChatUsecase(this.repo).execute({ ...body, userUuid: tokenDecoded.uuid });
    res.status(HttpStatus.OK).send({
      message: "Chat criado com sucesso",
      chat: chat.toOutput(),
    });
  }
  @Get("/:uuid")
  async getChatByUuid(@Param("uuid") uuid: string, @Req() req, @Res() res) {
    const tokenDecoded = req["tokenPayload"];
    const chat = await new FindChatByUuidUsecase(this.repo).execute(uuid, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      chat: chat.toOutput(),
    });
  }
  @Get()
  async getByUserUuid(@Req() req, @Res() res) {
    const tokenDecoded = req["tokenPayload"];
    const chats = await new FindChatsByUserUuids(this.repo).execute([tokenDecoded.uuid], tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      chats: chats.map((chat) => {
        return chat.toOutput();
      }),
    });
  }
  @Patch()
  async updateChat(@Param("uuid") uuid: string, @Body() body: UpdateEntityInputDto, @Req() req, @Res() res) {
    const tokenDecoded = req["tokenPayload"];
    const chat = await new UpdateChatUsecase(this.repo).execute(uuid, body, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Chat atualizado com sucesso",
      chat: chat.toOutput(),
    });
  }

  @Patch()
  async addNewChatUser(@Param("uuid") uuid: string, @Body() body: AddNewChatUserInputRequestDto, @Req() req, @Res() res) {
    const tokenDecoded = req["tokenPayload"];
    const chat = await new AddUserToChatUsecase(this.repo).execute(tokenDecoded.uuid, body.userUuid, body.chatUuid);
    res.status(HttpStatus.OK).send({
      message: "Usuario adicionado com sucesso",
      chat: chat.toOutput(),
    });
  }
  @Delete("/:uuid")
  async DeleteChatByUuid(@Param("uuid") uuid: string, @Req() req, @Res() res) {
    const tokenDecoded = req["tokenPayload"];
    await new DeleteChateUsecase(this.repo).execute(uuid, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Chat deletado com sucesso",
    });
  }
}
