import { NotificationsSocketInterface } from "@modules/notifications/core/NotificationsSocket.interface";

export class NotificationsSocketMemory implements NotificationsSocketInterface {
  async notify(uuid: string[]): Promise<void> {}
  async removeNotify(uuid: string): Promise<void> {}
}
