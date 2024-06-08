import { ConnectUserUsecase } from "@modules/contacts/core/usecase/connectUser.usecase";
import { DisconnectContact } from "@modules/contacts/core/usecase/disconnect.usecase";
import { FindContactByUser } from "@modules/contacts/core/usecase/findContactByUser.usecase";
import { ContactsRepositoryTypeOrm } from "@modules/contacts/infra/orm/contactsRepository.typeOrm";
import { Controller, Delete, Get, HttpStatus, Param, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Contacts")
@Controller("contacts")
export class ContactsController {
  constructor(readonly repo: ContactsRepositoryTypeOrm) {}
  @Post("/:uuid")
  async SaveContact(@Res() res, @Param("uuid") uuid: string, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    const contact = await new ConnectUserUsecase(this.repo).execute(tokenDecoded.uuid, uuid);
    res.status(HttpStatus.OK).send({
      message: "Contato criado",
      contact: contact.toOutput(),
    });
  }
  @Delete("/uuid")
  async deleteContact(@Res() res, @Param("uuid") uuid: string, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    await new DisconnectContact(this.repo).execute(uuid, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Contato excluido",
    });
  }
  @Get()
  async getContactsByUser(@Res() res, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    const contacts = await new FindContactByUser(this.repo).execute(tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      contacts:
        contacts.length > 0
          ? contacts.map((contact) => {
              return contact.toOutput();
            })
          : [],
    });
  }
}
