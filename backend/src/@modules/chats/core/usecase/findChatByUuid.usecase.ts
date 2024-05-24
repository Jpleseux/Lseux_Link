import { ChatRepositoryInterface } from "../chatRepository.interface";
import { ChatEntity } from "../entity/chatEntity.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class FindChatByUuidUsecase {
  constructor(readonly repo: ChatRepositoryInterface) {}
  public async execute(uuid: string, userUuid: string): Promise<ChatEntity> {
    const chat = await this.repo.findChatByUuid(uuid);
    if (!chat) {
      throw new apiError(`Chat não foi encontrado`, 404, "not_found");
    }
    await this.verifyUser(userUuid, chat);
    return chat;
  }
  private async verifyUser(uuid: string, chat: ChatEntity): Promise<void> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não foi encontrado`, 404, "not_found");
    } else if (chat.verifyUser(user) === false) {
      throw new apiError(`Usuario não pode acessar esse chat`, 401, "invalid");
    }
  }
}
