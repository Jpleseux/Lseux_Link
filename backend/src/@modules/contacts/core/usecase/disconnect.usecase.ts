import { ContactsRepositoryInterface } from "../contactsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { ContactsSocketInterface } from "../ContactsSocket.interface";

export class DisconnectContact {
  constructor(
    private readonly repo: ContactsRepositoryInterface,
    private readonly socket: ContactsSocketInterface,
  ) {}
  public async execute(uuid: string, userUuid: string): Promise<void> {
    const user = await this.repo.findUserByUuid(userUuid);
    const contact = await this.repo.findContactByUuid(uuid);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    } else if (!contact) {
      throw new apiError("Contato não encontrado", 404, "NOT_FOUND");
    } else if (contact.firstUser().uuid() !== user.uuid() && contact.secondUser().uuid() !== user.uuid()) {
      throw new apiError("Usuario não pode deletar esse contato", 404, "NOT_FOUND");
    }
    await this.socket.blockContact(contact.uuid());
    await this.repo.disconnect(contact.uuid(), user.uuid());
  }
}
