import { ContactsRepositoryInterface } from "../contactsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class ReconnectUserUsecase {
  constructor(private readonly repo: ContactsRepositoryInterface) {}
  public async execute(uuid: string, userUuid: string): Promise<void> {
    const contact = await this.repo.findBlockedContactByUuid(uuid);
    if (!contact) {
      throw new apiError("Contato não encontrado", 404, "not_found");
    } else if (contact.blockedBy() !== userUuid) {
      throw new apiError("Você não pode desbloquear esse contato", 404, "invalid");
    }
    await this.repo.reconnectUser(contact.uuid());
  }
}
