import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";
import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";
import { ProfileGatewayLocal } from "@modules/profile/infra/gateway/profileGatewayLocal.local";
import { UploadImageStorageAws } from "@modules/profile/infra/storage/uploadImageStorage.aws";

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
    {
      provide: UploadImageStorageAws,
      useFactory: () => {
        return new UploadImageStorageAws();
      },
      inject: [],
    },
    {
      provide: ProfileGatewayLocal,
      useFactory: (dataSource: DataSource) => {
        return new ProfileGatewayLocal(dataSource);
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
