import { MessagesRepositoryTypeOrm } from "@modules/messages/infra/orm/messagesRepository.typeOrm";
import { Body, Controller, Delete, HttpStatus, Param, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SaveMessageInputDto } from "./dto/saveMessage.request.dto";
import { SaveMessageUsecase } from "@modules/messages/core/usecase/saveMessage.usecase";
import { ChatsSocketLocal } from "@modules/messages/infra/socket/chatsSocket.local";
import { DeleteMessageUsecase } from "@modules/messages/core/usecase/deleteMessage.usecase";

@ApiTags("Messages")
@Controller("messages")
export class MessagesController {
  constructor(
    readonly repo: MessagesRepositoryTypeOrm,
    readonly socket: ChatsSocketLocal,
  ) {}
  @Post()
  async saveMessage(@Res() res, @Req() req, @Body() body: SaveMessageInputDto) {
    const tokenDecoded = req["tokenPayload"];
    const message = await new SaveMessageUsecase(this.repo, this.socket).execute({ ...body, senderUuid: tokenDecoded.uuid });
    res.status(HttpStatus.OK).send({
      messages: message.toOutput(),
    });
  }
  @Delete(":uuid")
  async DeleteMessages(@Res() res, @Req() req, @Param("uuid") uuid: string) {
    const tokenDecoded = req["tokenPayload"];
    await new DeleteMessageUsecase(this.repo, this.socket).execute(uuid, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Mensagem deletado com sucesso",
    });
  }
}
