import { NotificationRepositoryInterface } from "../notificationRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class getAmountNotificationsUsecase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}
  public async execute(uuid: string): Promise<number> {
    const user = await this.repo.findUserByUuid(uuid);
    if (!user) {
      throw new apiError(`Usuario não existe`, 404, "not_found");
    }
    return await this.repo.getAmountNotificationsByUuid(user.uuid());
  }
}
