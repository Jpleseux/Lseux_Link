require("dotenv").config();
import { NotificationsSocketInterface } from "@modules/notifications/core/NotificationsSocket.interface";
import { SocketConnection } from "@modules/shared/socket/socketConnection";

export class NotificationsSocketLocal implements NotificationsSocketInterface {
  constructor(readonly server: SocketConnection) {}
  async notify(uuid: string[]): Promise<void> {
    await this.server.send("new-notify", uuid);
  }
  async removeNotify(uuid: string): Promise<void> {
    await this.server.send("remove-notify", uuid);
  }
}
