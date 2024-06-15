import { ChatRepositoryInterface } from "../chatRepository.interface";
import { ChatEntity } from "../entity/chatEntity.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { UserEntity } from "../entity/user.entity";

export class ExitFromChatUsecase {
  constructor(readonly repo: ChatRepositoryInterface) {}
  public async execute(userUuid: string, chatUuid: string): Promise<ChatEntity> {
    const chat = await this.repo.findChatByUuid(chatUuid);
    if (!chat) {
      throw new apiError(`Chat não foi encontrado`, 404, "not_found");
    }
    const user = await this.verifyUser(userUuid, chat);
    chat.removeUser(user);
    await this.repo.updateChat(chatUuid, chat.props);
    return chat;
  }
  private async verifyUser(uuid: string, chat: ChatEntity): Promise<UserEntity> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não foi encontrado`, 404, "not_found");
    } else if (chat.verifyUser(user) === false) {
      throw new apiError(`Usuario ${user.userName()} não pode atualizar esse chat`, 401, "invalid");
    }
    return user;
  }
}
