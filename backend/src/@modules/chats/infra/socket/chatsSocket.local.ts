require("dotenv").config();
import { ChatsSocketInterface } from "@modules/chats/core/ChatsSocket.interface";
import { UserEntity } from "@modules/chats/core/entity/user.entity";
import { SocketConnection } from "@modules/shared/socket/socketConnection";

export class ChatsSocketLocal implements ChatsSocketInterface {
  constructor(readonly server: SocketConnection) {}
  async addUser(user: UserEntity): Promise<void> {
    await this.server.send("add-user", user.props);
  }
}
