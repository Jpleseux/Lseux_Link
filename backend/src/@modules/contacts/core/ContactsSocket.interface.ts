export interface ContactsSocketInterface {
  blockContact(uuid: string): Promise<void>;
}
