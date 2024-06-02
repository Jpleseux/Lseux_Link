import { NotificationEntity } from "../entities/notification.entity";
import { NotificationRepositoryInterface } from "../notificationRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class GetNotificationUsecase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}
  public async execute(uuid: string): Promise<NotificationEntity[]> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não existe`, 404, "not_found");
    }
    return await this.repo.findNotificationsByUserUuid(user.uuid());
  }
}
