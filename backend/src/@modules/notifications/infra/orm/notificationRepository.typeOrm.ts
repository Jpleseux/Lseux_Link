import { UserEntity } from "@modules/notifications/core/entities/user.entity";
import { NotificationRepositoryInterface } from "@modules/notifications/core/notificationRepository.interface";
import { NotificationUserModel } from "../database/models/UserModel.model";
import { DataSource } from "typeorm";
import { NotificationEntity } from "@modules/notifications/core/entities/notification.entity";
import { NotificationsModel } from "../database/models/notification.model";

export class NotificationRepositoryTypeOrm implements NotificationRepositoryInterface {
  constructor(readonly dataSource: DataSource) {}
  async findUserByUuid(uuid: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(NotificationUserModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!userDb) {
      return;
    }
    return new UserEntity({
      userName: userDb.userName,
      uuid: userDb.uuid,
      avatar: userDb.avatar,
    });
  }
  async save(notification: NotificationEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(NotificationsModel)
      .values([
        {
          from: notification.From().uuid(),
          to: await notification.To().map((user) => {
            return user.uuid();
          }),
          is_invite: notification.IsInvite(),
          is_readed: false,
          message: notification.Message(),
          type: notification.Type(),
          uuid: notification.Uuid(),
        },
      ])
      .execute();
  }
  async findNotificationsByUserUuid(uuid: string): Promise<NotificationEntity[]> {
    const data = await this.dataSource.query(`select * from blog_notifications where blog_notifications.to @> $1`, [
      JSON.stringify([uuid]),
    ]);
    if (!data || (data && data.length === 0)) {
      return [];
    }
    const notifications: NotificationEntity[] = [];
    for (let i = 0; i < data.length; i++) {
      notifications.push(
        new NotificationEntity({
          isInvite: data[i].is_invite,
          isReaded: data[i].is_readed,
          message: data[i].message,
          to: await Promise.all(
            await data[i].to.map(async (uuid) => {
              const user = await this.findUserByUuid(uuid);
              if (!user) {
                return;
              } else {
                return user;
              }
            }),
          ),
          type: data[i].type,
          uuid: data[i].uuid,
          from: await this.findUserByUuid(data[i].from),
        }),
      );
    }
    return notifications;
  }
  async setReadedNotifications(uuid: string): Promise<void> {
    await this.dataSource
      .getRepository(NotificationsModel)
      .createQueryBuilder("blog_notifications")
      .update(NotificationsModel)
      .set({ is_readed: true })
      .where("blog_notifications.to @> :uuid", { uuid: JSON.stringify([uuid]) })
      .execute();
  }
  async findNotificationByUuid(uuid: string): Promise<NotificationEntity> {
    const data = await this.dataSource
      .getRepository(NotificationsModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!data) {
      return;
    }
    const notification = new NotificationEntity({
      isInvite: data.is_invite,
      isReaded: data.is_readed,
      message: data.message,
      to: await Promise.all(
        await data.to.map(async (uuid) => {
          const user = await this.findUserByUuid(uuid);
          if (!user) {
            return;
          } else {
            return user;
          }
        }),
      ),
      type: data.type as "system" | "personal" | "group",
      uuid: data.uuid,
      from: await this.findUserByUuid(data.from),
    });
    return notification;
  }
  async deleteNotification(uuid: string): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from(NotificationsModel).where("uuid = :uuid", { uuid: uuid }).execute();
  }
  async setNewUsers(notification: NotificationEntity): Promise<void> {
    await this.dataSource
      .getRepository(NotificationsModel)
      .createQueryBuilder()
      .update(NotificationsModel)
      .set({ to: notification.To().map((to) => to.uuid()) })
      .where("uuid = :uuid", { uuid: notification.Uuid() })
      .execute();
  }
  async findNotificationByUsers(to: UserEntity, from: UserEntity): Promise<NotificationEntity> {
    const notificationDb = await this.dataSource
      .getRepository(NotificationsModel)
      .createQueryBuilder("blog_notifications")
      .where("blog_notifications.to @> :toUuid::jsonb", { toUuid: JSON.stringify([to.uuid()]) })
      .andWhere("blog_notifications.from = :fromUuid", { fromUuid: from.uuid() })
      .andWhere("blog_notifications.is_invite = :invite", { invite: true })
      .andWhere("blog_notifications.is_readed = :readed", { readed: false })

      .getOne();
    if (!notificationDb) {
      return;
    }
    return new NotificationEntity({
      isInvite: notificationDb.is_invite,
      isReaded: notificationDb.is_readed,
      message: notificationDb.message,
      to: await Promise.all(
        notificationDb.to.map(async (uuid) => {
          const user = await this.findUserByUuid(uuid);
          return user;
        }),
      ),
      type: notificationDb.type as "system" | "personal" | "group",
      uuid: notificationDb.uuid,
      from: await this.findUserByUuid(notificationDb.from),
    });
  }
}
