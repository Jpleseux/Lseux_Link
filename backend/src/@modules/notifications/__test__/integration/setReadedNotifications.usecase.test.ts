import { SetReadedNotificationsUsecase } from "@modules/notifications/core/usecase/setReadedNotification.usecase";
import { NotificationsModel } from "@modules/notifications/infra/database/models/notification.model";
import { NotificationRepositoryTypeOrm } from "@modules/notifications/infra/orm/notificationRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: NotificationRepositoryTypeOrm;
describe("Deve testar o SetReadedNotificationsUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new NotificationRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve setar as notificações como lidas", async () => {
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
          uuid: "b804e6a9-8a39-4c34-b46a-16dbf390a385",
        },
      ])
      .execute();
    await new SetReadedNotificationsUsecase(repo).execute("d0027811-4f76-4cf2-a24b-bc99ad777950");
    const notification = await repo.findNotificationByUuid("b804e6a9-8a39-4c34-b46a-16dbf390a385");
    expect(notification.From().uuid()).toBe("e3034bba-ff39-4e38-ba59-a77dd913f5c2");
    expect(notification.IsReaded()).toBe(true);
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(NotificationsModel)
      .where("uuid = :uuid", { uuid: notification.Uuid() })
      .execute();
  });
});
