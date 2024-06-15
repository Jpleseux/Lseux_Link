import { ContactsRepositoryInterface } from "../contactsRepository.interface";
import { ContactEntity } from "../entities/contacts.entity";

export class FindBlockedContactsUsecase {
  constructor(private readonly repo: ContactsRepositoryInterface) {}
  public async execute(uuid: string): Promise<ContactEntity[]> {
    return this.repo.findBlockedContacts(uuid);
  }
}
