import { NotificationRepositoryInterface } from "../notificationRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class DeleteNotificationUsecase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}
  public async execute(notificationUuid: string, uuid: string): Promise<void> {
    const notification = await this.repo.findNotificationByUuid(notificationUuid);
    const user = await this.repo.findUserByUuid(uuid);
    if (!notification) {
      throw new apiError(`Notificação não existe`, 404, "not_found");
    } else if (!user) {
      throw new apiError(`Usuario não existe`, 404, "not_found");
    } else if (notification.To().some((u) => u.uuid() === user.uuid()) === false) {
      throw new apiError(`Usuario não pode deletar essa notificação`, 404, "not_found");
    } else if (notification.Type() !== "personal") {
      notification.removeTo(user.uuid());
      await this.repo.setNewUsers(notification);
    } else if (notification.Type() === "personal") {
      await this.repo.deleteNotification(notification.Uuid());
    }
  }
}
