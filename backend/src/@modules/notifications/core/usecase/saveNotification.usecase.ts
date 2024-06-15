import { NotificationEntity } from "../entities/notification.entity";
import { UserEntity } from "../entities/user.entity";
import { NotificationRepositoryInterface } from "../notificationRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { randomUUID } from "crypto";
import { ContactEntity } from "../entities/contacts.entity";
import { NotificationsSocketInterface } from "../NotificationsSocket.interface";

type SaveNotificationInput = {
  to: string[];
  type: "system" | "personal" | "group";
  from?: string;
  message: string;
  invite?: boolean;
};

export class SaveNotificationUsecase {
  constructor(
    private readonly repo: NotificationRepositoryInterface,
    private readonly socket: NotificationsSocketInterface,
  ) {}

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
      from: (input.from && (await this.repo.findUserByUuid(input.from))) || null,
      to: users,
      type: input.type,
      uuid: randomUUID(),
    });

    if (input.from) {
      console.log(input.invite);
      const from = await this.repo.findUserByUuid(input.from);

      if (!from) {
        throw new apiError(`Remetente não existe`, 404, "not_found");
      } else if (input.invite === true && input.type === "personal") {
        const existingNotification = await this.repo.findNotificationByUsers(users[0], from);

        if (existingNotification) {
          throw new apiError(`Você já enviou uma solicitação a esse usuário!!!`, 404, "not_found");
        }
        const contact = new ContactEntity({
          firstUser: from,
          secondUser: users[0],
          uuid: "",
          blocked: false,
          messages: [],
        });
        const response = await this.repo.findUnityContact(contact);
        if (response && response.blocked() === true) {
          throw new apiError(`Você bloqueou esse contato`, 400, "invalid");
        } else if (response) {
          throw new apiError(`Voce ja tem esse contato adicionado!!!`, 400, "invalid");
        }
      } else {
        notification.setFrom(from);
      }
    }
    await this.socket.notify(
      notification.To().map((user) => {
        return user.uuid();
      }),
    );
    await this.repo.save(notification);
    return notification;
  }
}
