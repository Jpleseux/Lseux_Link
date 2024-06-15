import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";
import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";
import { NotificationController } from "./notification.controller";
import { NotificationRepositoryTypeOrm } from "@modules/notifications/infra/orm/notificationRepository.typeOrm";
import { NotificationsSocketLocal } from "@modules/notifications/infra/socket/NotificationsSocket.local";
import { SocketConnection } from "@modules/shared/socket/socketConnection";

@Module({
  controllers: [NotificationController],
  providers: [
    {
      provide: middlewareGateway,
      useFactory: (dataSource: DataSource) => {
        return new middlewareGateway(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: NotificationsSocketLocal,
      useFactory: (connection: SocketConnection) => {
        return new NotificationsSocketLocal(connection);
      },
      inject: [SocketConnection],
    },
    {
      provide: NotificationRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new NotificationRepositoryTypeOrm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
  ],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes("notifications");
  }
}
