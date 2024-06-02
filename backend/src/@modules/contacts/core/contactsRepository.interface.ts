import { ContactEntity } from "./entities/contacts.entity";
import { UserEntity } from "./entities/user.entity";

export interface ContactsRepositoryInterface {
  findUserByUuid(uuid: string): Promise<UserEntity>;
  connect(contact: ContactEntity): Promise<void>;
}
