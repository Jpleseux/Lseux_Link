import { ContactEntity } from "./entities/contacts.entity";
import { UserEntity } from "./entities/user.entity";

export interface ContactsRepositoryInterface {
  findUserByUuid(uuid: string): Promise<UserEntity>;
  connect(contact: ContactEntity): Promise<void>;
  disconnect(uuid: string): Promise<void>;
  findContactByUuid(uuid: string): Promise<ContactEntity>;
  findContactsByUsers(user: UserEntity): Promise<ContactEntity[]>;
  findUnityContact(contact: ContactEntity): Promise<ContactEntity>;
}
