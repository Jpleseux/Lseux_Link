import { GetNotificationUsecase } from "@modules/notifications/core/usecase/getNotification.usecase";
import { NotificationsModel } from "@modules/notifications/infra/database/models/notification.model";
import { NotificationRepositoryTypeOrm } from "@modules/notifications/infra/orm/notificationRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: NotificationRepositoryTypeOrm;
describe("Deve testar o GetNotificationUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new NotificationRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve buscar notificaçãos", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(NotificationsModel)
      .values([
        {
          from: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
          is_invite: false,
          is_readed: false,
          message: "teste",
          to: ["d0027811-4f76-4cf2-a24b-bc99ad777950"],
          type: "personal",
          uuid: "bb841990-9d03-4f78-be1b-d7b933fb2ba6",
        },
      ])
      .execute();
    const notification = await new GetNotificationUsecase(repo).execute("d0027811-4f76-4cf2-a24b-bc99ad777950");
    expect(notification[0].From().uuid()).toBe("e3034bba-ff39-4e38-ba59-a77dd913f5c2");
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(NotificationsModel)
      .where("uuid = :uuid", { uuid: notification[0].Uuid() })
      .execute();
  });
});
