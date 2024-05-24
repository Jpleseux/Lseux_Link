import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { PostsController } from "./post.controller";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";
import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";
import { UploadImageStorageAws } from "@modules/posts/infra/storage/uploadImageStorage.aws";

@Module({
  controllers: [PostsController],
  providers: [
    {
      provide: PostsRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new PostsRepositoryTypeOrm(dataSource);
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
  ],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes("posts");
  }
}
