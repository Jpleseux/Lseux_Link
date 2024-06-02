import { SaveNotificationUsecase } from "@modules/notifications/core/usecase/saveNotification.usecase";
import { NotificationsModel } from "@modules/notifications/infra/database/models/notification.model";
import { NotificationRepositoryTypeOrm } from "@modules/notifications/infra/orm/notificationRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";

let repo: NotificationRepositoryTypeOrm;
describe("Deve testar o SaveNotificationUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new NotificationRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve salvar uma notificação", async () => {
    const notification = await new SaveNotificationUsecase(repo).execute({
      message: "Nova notificação",
      to: ["d0027811-4f76-4cf2-a24b-bc99ad777950"],
      type: "personal",
      from: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
      invite: false,
    });
    expect(notification.From().uuid()).toBe("e3034bba-ff39-4e38-ba59-a77dd913f5c2");
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(NotificationsModel)
      .where("uuid = :uuid", { uuid: notification.Uuid() })
      .execute();
  });
});
