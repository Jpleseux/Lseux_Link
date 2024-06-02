import { MessagesRepositoryInterface } from "../messagesRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class DeleteMessageUsecase {
  constructor(readonly repo: MessagesRepositoryInterface) {}
  public async execute(uuid: string, userUuid: string): Promise<void> {
    const user = await this.repo.findUserById(userUuid);
    const message = await this.repo.findMessageByUuid(uuid);
    if (!message) {
      throw new apiError("Mensagem não encontrada", 404, "not_found");
    } else if (message.sender().uuid() !== user.uuid()) {
      throw new apiError("Esse usuario não pode deletar essa mensagem", 401, "unauthorized");
    }
    await this.repo.deleteMessage(message.uuid());
  }
}
