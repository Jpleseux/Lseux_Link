import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";
import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";

@Module({
  controllers: [ProfileController],
  providers: [
    {
      provide: ProfileRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new ProfileRepositoryTypeOrm(dataSource);
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
  ],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes("profile");
  }
}
