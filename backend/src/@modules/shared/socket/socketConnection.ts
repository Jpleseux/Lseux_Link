require("dotenv").config();
import { Server } from "socket.io";
import * as http from "http";

export class SocketConnection {
  private server: Server;

  constructor() {
    const serverHttp = http.createServer();
    this.server = new Server(serverHttp, {
      cors: {
        origin: process.env.SOCKET_ORIGIN,
      },
    });
    const SOCKET_PORT: number = (process.env.SOCKET_PORT ?? 4000) as number;
    this.server.listen(SOCKET_PORT);
  }

  async send(eventName: string, message: any): Promise<void> {
    await this.server.emit(eventName, message);
  }
}
