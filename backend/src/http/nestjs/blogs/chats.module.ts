import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ChatsController } from "./chats/chats.controller";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";
import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";
import { ChatsSocketLocal } from "@modules/messages/infra/socket/chatsSocket.local";
import { SocketConnection } from "@modules/shared/socket/socketConnection";
import { MessagesRepositoryTypeOrm } from "@modules/messages/infra/orm/messagesRepository.typeOrm";
import { MessagesController } from "./messages/message.controller";
import { ContactsRepositoryTypeOrm } from "@modules/contacts/infra/orm/contactsRepository.typeOrm";
import { ContactsController } from "./contacts/contacts.controller";
import { contactsSocketLocal } from "@modules/contacts/infra/socket/ContactsSocket.local";

@Module({
  controllers: [ChatsController, MessagesController, ContactsController],
  providers: [
    {
      provide: ChatRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new ChatRepositoryTypeOrm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: middlewareGateway,
      useFactory: (dataSource: DataSource) => {
        return new middlewareGateway(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: ChatsSocketLocal,
      useFactory: (connection: SocketConnection) => {
        return new ChatsSocketLocal(connection);
      },
      inject: [SocketConnection],
    },
    {
      provide: contactsSocketLocal,
      useFactory: (connection: SocketConnection) => {
        return new contactsSocketLocal(connection);
      },
      inject: [SocketConnection],
    },
    {
      provide: MessagesRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new MessagesRepositoryTypeOrm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: ContactsRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new ContactsRepositoryTypeOrm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
  ],
})
export class ChatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes("chats");
    consumer.apply(AuthorizationMiddleware).forRoutes("messages");
    consumer.apply(AuthorizationMiddleware).forRoutes("contacts");
  }
}
