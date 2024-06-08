import { ConnectUserUsecase } from "@modules/contacts/core/usecase/connectUser.usecase";
import { ContactsRepositoryTypeOrm } from "@modules/contacts/infra/orm/contactsRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: ContactsRepositoryTypeOrm;
describe("Deve testar o ConnectUserUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ContactsRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve criar um contato", async () => {
    const contact = await new ConnectUserUsecase(repo).execute(
      "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
      "d0027811-4f76-4cf2-a24b-bc99ad777950",
    );
    expect(contact.firstUser().userName()).toBe("user2");
    expect(contact.secondUser().userName()).toBe("user1");
    await repo.disconnect(contact.uuid());
  });
});
