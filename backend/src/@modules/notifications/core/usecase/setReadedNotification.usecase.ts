import { NotificationRepositoryInterface } from "../notificationRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class SetReadedNotificationsUsecase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}
  public async execute(uuid: string): Promise<void> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não existe`, 404, "not_found");
    }
    await this.repo.setReadedNotifications(uuid);
  }
}
