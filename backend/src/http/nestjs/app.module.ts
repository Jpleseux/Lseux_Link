require("dotenv").config();
import { Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { UserModel } from "@modules/auth/infra/database/models/UserModel.model";
import { AuthModule } from "./auth/auth.module";
import { UserModel as profileUserModel } from "@modules/profile/infra/database/models/UserModel.model";
import { ProfileModule } from "./profile/profile.module";
import { PostsModule } from "./posts/post.module";
import { PostsUserModel } from "@modules/posts/infra/database/models/UserModel.model";
import { PostModel } from "@modules/posts/infra/database/models/Post.model";
import { CommentsModel } from "@modules/posts/infra/database/models/comments.model";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_DEFAULT_DRIVER as any,
      host: process.env.DB_DEFAULT_HOST,
      port: process.env.DB_DEFAULT_PORT as any,
      database: process.env.DB_DEFAULT_NAME,
      username: process.env.DB_DEFAULT_USENAME,
      schema: process.env.DB_DEFAULT_SCHEMA ?? "public",
      password: process.env.DB_DEFAULT_PASSWORD,
      entities: [UserModel, profileUserModel, PostsUserModel, PostModel, CommentsModel],
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RABBITMQ_URL,
    }),
    AuthModule,
    ProfileModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
