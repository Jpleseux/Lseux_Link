import { ChatRepositoryInterface } from "../chatRepository.interface";
import { ChatEntity } from "../entity/chatEntity.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class AddUserToChatUsecase {
  constructor(readonly repo: ChatRepositoryInterface) {}
  public async execute(userUuid: string, newUserUuid: string, chatUuid: string): Promise<ChatEntity> {
    const chat = await this.repo.findChatByUuid(userUuid);
    if (!chat) {
      throw new apiError(`Chat não foi encontrado`, 404, "not_found");
    }
    await this.verifyUser(userUuid, chat);
    const newUser = await this.repo.findUserByUuid(newUserUuid);
    if (!newUser) {
      throw new apiError(`Usuario não foi encontrado`, 404, "not_found");
    }
    chat.addUser(newUser);
    await this.repo.updateChat(chatUuid, chat.props);
    return chat;
  }
  private async verifyUser(uuid: string, chat: ChatEntity): Promise<void> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não foi encontrado`, 404, "not_found");
    } else if (chat.users()[0].uuid() !== user.uuid()) {
      throw new apiError(`Usuario ${user.userName()} não pode atualizar esse chat`, 401, "invalid");
    }
  }
}
