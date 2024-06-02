require("dotenv").config();
import { Global, Module } from "@nestjs/common";
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
import { ChatsModule } from "./chats/chats.module";
import { SocketConnection } from "@modules/shared/socket/socketConnection";
import { ChatsModel } from "@modules/chats/infra/database/models/chats.model";
import { MessageModel } from "@modules/messages/infra/database/models/MessageModel.model";
import { MessagesUserModel } from "@modules/messages/infra/database/models/UserModel.model";
import { ChatsMessageModel } from "@modules/chats/infra/database/models/MessageModel.model";
import { ChatsUserModel } from "@modules/chats/infra/database/models/UserModel.model";
@Global()
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
      entities: [
        UserModel,
        profileUserModel,
        PostsUserModel,
        PostModel,
        CommentsModel,
        ChatsModel,
        MessageModel,
        MessagesUserModel,
        ChatsMessageModel,
        ChatsUserModel,
      ],
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RABBITMQ_URL,
    }),
    AuthModule,
    ProfileModule,
    PostsModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: SocketConnection,
      useFactory: () => {
        return new SocketConnection();
      },
      inject: [],
    },
  ],
  exports: [SocketConnection],
})
export class AppModule {}
