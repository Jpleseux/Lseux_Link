import { ChatRepositoryInterface } from "../chatRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { ChatEntity } from "../entity/chatEntity.entity";

export class DeleteChateUsecase {
  constructor(readonly repo: ChatRepositoryInterface) {}
  public async execute(uuid: string, userUuid: string): Promise<void> {
    const chat = await this.repo.findChatByUuid(uuid);
    if (!chat) {
      throw new apiError(`Chat não foi encontrado`, 404, "not_found");
    }
    await this.verifyUser(userUuid, chat);
    await this.repo.deleteChat(uuid);
  }
  private async verifyUser(uuid: string, chat: ChatEntity): Promise<void> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não foi encontrado`, 404, "not_found");
    } else if (chat.users()[0].uuid() !== user.uuid()) {
      throw new apiError(`Usuario ${user.userName()} não pode deletar esse chat`, 401, "invalid");
    }
  }
}
