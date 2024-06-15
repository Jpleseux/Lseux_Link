require("dotenv").config();
import { ContactsSocketInterface } from "@modules/contacts/core/ContactsSocket.interface";
import { SocketConnection } from "@modules/shared/socket/socketConnection";

export class contactsSocketLocal implements ContactsSocketInterface {
  constructor(readonly server: SocketConnection) {}
  async blockContact(uuid: string): Promise<void> {
    await this.server.send("block-contact", uuid);
  }
}
