import { randomUUID } from "crypto";
import { ChatRepositoryInterface } from "../chatRepository.interface";
import { ChatEntity } from "../entity/chatEntity.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
type chatInputProps = {
  name: string;
  type: string;
  userUuid: string;
  users: string[];
};
export class SaveChatUsecase {
  constructor(readonly repo: ChatRepositoryInterface) {}
  public async execute(input: chatInputProps): Promise<ChatEntity> {
    const user = await this.repo.findUserByUuid(input.userUuid);
    const chat = new ChatEntity({
      name: input.name,
      type: input.type,
      uuid: randomUUID(),
      users: [user],
    });
    input.users.map(async (user) => {
      const res = await this.repo.findUserByUuid(user);
      if (!res) {
        throw new apiError(`Usuario ${user} não foi encontrado`, 404, "not_found");
      }
      chat.addUser(res);
    });
    await this.repo.save(chat);
    return chat;
  }
}
