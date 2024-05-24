import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ChatsController } from "./chats/chats.controller";
import { ChatRepositoryTypeOrm } from "@modules/chats/infra/orm/chatRepository.typeOrm";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";

@Module({
  controllers: [ChatsController],
  providers: [
    {
      provide: ChatRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new ChatRepositoryTypeOrm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
  ],
})
export class ChatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes("chats");
  }
}
