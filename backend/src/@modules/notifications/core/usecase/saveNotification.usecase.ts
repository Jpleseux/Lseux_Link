import { NotificationEntity } from "../entities/notification.entity";
import { UserEntity } from "../entities/user.entity";
import { NotificationRepositoryInterface } from "../notificationRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { randomUUID } from "crypto";
type SaveNotificationInput = {
  to: string[];
  type: "system" | "personal" | "group";
  from?: string;
  message: string;
  invite?: boolean;
};
export class SaveNotificationUsecase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}
  public async execute(input: SaveNotificationInput): Promise<NotificationEntity> {
    const users: UserEntity[] = [];
    for (let i = 0; i < input.to.length; i++) {
      const user = await this.repo.findUserByUuid(input.to[i]);
      if (!user) {
        throw new apiError(`Destinatário ${input.to[i]} não existe`, 404, "not_found");
      } else {
        users.push(user);
      }
    }
    const notification = new NotificationEntity({
      isInvite: input.invite ?? false,
      isReaded: false,
      message: input.message,
      from: (await this.repo.findUserByUuid(input.from)) ?? null,
      to: users,
      type: input.type,
      uuid: randomUUID(),
    });
    if (input.from) {
      const from = await this.repo.findUserByUuid(input.from);
      if (!from) {
        throw new apiError(`Remetente não existe`, 404, "not_found");
      } else if (input.invite === true && input.type === "personal") {
        const notification = await this.repo.findNotificationByUsers(users[0], from);
        if (notification) {
          throw new apiError(`Você ja enviou uma solicitação á esse usuario!!!`, 404, "not_found");
        }
      } else {
        notification.setFrom(from);
      }
    }
    await this.repo.save(notification);
    return notification;
  }
}
