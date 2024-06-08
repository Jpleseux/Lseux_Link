import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { MessagesRepositoryInterface } from "../messagesRepository.interface";

export class searchNewContactsUsecase {
  constructor(readonly repo: MessagesRepositoryInterface) {}
  public async execute(search: string, uuid: string): Promise<UserEntity[]> {
    return this.repo.searchNewContacts(search, uuid);
  }
}
