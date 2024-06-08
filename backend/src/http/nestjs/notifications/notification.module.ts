import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";
import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";
import { NotificationController } from "./notification.controller";
import { NotificationRepositoryTypeOrm } from "@modules/notifications/infra/orm/notificationRepository.typeOrm";

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
