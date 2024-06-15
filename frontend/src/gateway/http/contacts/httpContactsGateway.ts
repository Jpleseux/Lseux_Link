import { ContactEntity } from "../../../entities/contacts/contacts.entity";
import { MessageEntity } from "../../../entities/contacts/messageEntity.entity";
import { UserEntity } from "../../../entities/contacts/user.entity";
import httpClient from "../../../http/httpClient";
import { ContactsGatewayInterface, contactsOutput, contactsOutputMany } from "../../interfaces/contacts/contactsGateway.interface";
export class HttpContactsGateway implements ContactsGatewayInterface {
    constructor(private readonly httpClient: httpClient) {}
    async saveContact(userUuid: string): Promise<contactsOutput> {
        const response = await this.httpClient.post(`contacts/${userUuid}`, {});
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async getContacts(): Promise<contactsOutputMany> {
        const response = await this.httpClient.get(`contacts`);
        const { data } = response;
        if (response && response.status < 300) {
            const contacts = data.contacts.map((contact: any) => {
                return new ContactEntity({
                    firstUser: new UserEntity(contact.firstUser),
                    secondUser: new UserEntity(contact.secondUser),
                    uuid: contact.uuid,
                    messages: contact.messages.length > 0 ? contact.messages.map((message: any) => {
                        return new MessageEntity({
                            chatUuid: message.chatUuid,
                            sender: new UserEntity(message.sender),
                            text: message.text,
                            uuid: message.uuid,
                        });
                    }) : []
                })
            })
            return {
                contacts: contacts,
                status: response.status,
                message: response.data.message,
            }
        }
        return {
            contacts: [],
            status: response.status,
            message: response.data.message,
        }
    }
    async blockUser(uuid: string): Promise<contactsOutput> {
        const response = await this.httpClient.delete(`contacts`, uuid);
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async findBlockedContacts(): Promise<contactsOutputMany> {
        const response = await this.httpClient.get(`contacts/blockeds`);
        const { data } = response;
        if (response && response.status < 300) {
            const contacts = data.contacts.map((contact: any) => {
                return new ContactEntity({
                    firstUser: new UserEntity(contact.firstUser),
                    secondUser: new UserEntity(contact.secondUser),
                    uuid: contact.uuid,
                    messages: contact.messages.length > 0 ? contact.messages.map((message: any) => {
                        return new MessageEntity({
                            chatUuid: message.chatUuid,
                            sender: new UserEntity(message.sender),
                            text: message.text,
                            uuid: message.uuid,
                        });
                    }) : []
                })
            })
            return {
                contacts: contacts,
                status: response.status,
                message: response.data.message,
            }
        }
        return {
            contacts: [],
            status: response.status,
            message: response.data.message,
        }
    }
    async unblockContact(uuid: string): Promise<contactsOutput> {
        const response = await this.httpClient.post(`contacts/reconnect/${uuid}`, {});
        return {
            status: response.status,
            message: response.data.message,
        }
    }
}