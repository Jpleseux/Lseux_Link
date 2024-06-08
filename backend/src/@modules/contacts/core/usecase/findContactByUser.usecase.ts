import { ContactsRepositoryInterface } from "../contactsRepository.interface";
import { ContactEntity } from "../entities/contacts.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class FindContactByUser {
  constructor(private readonly repo: ContactsRepositoryInterface) {}
  public async execute(userUuid: string): Promise<ContactEntity[]> {
    const user = await this.repo.findUserByUuid(userUuid);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    }
    const contacts = await this.repo.findContactsByUsers(user);
    return contacts;
  }
}
