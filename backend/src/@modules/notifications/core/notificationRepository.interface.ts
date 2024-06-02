import { NotificationEntity } from "./entities/notification.entity";
import { UserEntity } from "./entities/user.entity";

export interface NotificationRepositoryInterface {
  findUserByUuid(uuid: string): Promise<UserEntity>;
  findNotificationsByUserUuid(uuid: string): Promise<NotificationEntity[]>;
  setReadedNotifications(uuid: string): Promise<void>;
  findNotificationByUuid(uuid: string): Promise<NotificationEntity>;
  deleteNotification(uuid: string): Promise<void>;
  setNewUsers(notification: NotificationEntity): Promise<void>;
  findNotificationByUsers(to: UserEntity, from: UserEntity): Promise<NotificationEntity>;
  save(notification: NotificationEntity): Promise<void>;
}
