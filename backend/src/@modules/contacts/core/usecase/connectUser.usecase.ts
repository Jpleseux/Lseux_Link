import { ContactsRepositoryInterface } from "../contactsRepository.interface";
import { ContactEntity } from "../entities/contacts.entity";
import { randomUUID } from "crypto";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class ConnectUserUsecase {
  constructor(private readonly repo: ContactsRepositoryInterface) {}
  public async execute(first_user: string, second_user: string): Promise<ContactEntity> {
    const firstUser = await this.repo.findUserByUuid(first_user);
    const secondUser = await this.repo.findUserByUuid(second_user);
    if (!firstUser) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    } else if (!secondUser) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    }
    const contact = new ContactEntity({
      firstUser: firstUser,
      secondUser: secondUser,
      messages: [],
      uuid: randomUUID(),
    });
    const existing = await this.repo.findUnityContact(contact);
    if (existing) {
      throw new apiError("Esse contato ja existe", 400, "ALREADY_EXIST");
    }
    await this.repo.connect(contact);
    return contact;
  }
}
