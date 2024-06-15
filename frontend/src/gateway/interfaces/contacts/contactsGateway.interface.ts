import { ContactEntity } from "../../../entities/contacts/contacts.entity";

export type contactsOutput = {
    message: string;
    status:  number;
}
export type contactsOutputMany = {
    message: string;
    status:  number;
    contacts: ContactEntity[];
}
export interface ContactsGatewayInterface {
    saveContact(userUuid: string): Promise<contactsOutput>;
    getContacts(): Promise<contactsOutputMany>;
    blockUser(uuid: string): Promise<contactsOutput>;
    findBlockedContacts(): Promise<contactsOutputMany>;
    unblockContact(uuid: string): Promise<contactsOutput>;
}