import { ChatRepositoryInterface } from "../chatRepository.interface";
import { ChatEntity } from "../entity/chatEntity.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class FindChatsByUserUuids {
  constructor(readonly repo: ChatRepositoryInterface) {}
  public async execute(uuids: string[], userUuid: string): Promise<ChatEntity[]> {
    await this.verifyUser(userUuid);
    const chats = await this.repo.findChatsByUsers(uuids);
    if (!chats) {
      return [];
    } else {
      return chats;
    }
  }
  private async verifyUser(uuid: string): Promise<void> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não foi encontrado`, 404, "not_found");
    }
  }
}
