import { ContactsSocketInterface } from "@modules/contacts/core/ContactsSocket.interface";

export class ContactsSocketMemory implements ContactsSocketInterface {
  async blockContact(uuid: string): Promise<void> {}
}
