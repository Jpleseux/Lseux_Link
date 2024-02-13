import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";
import { RegisterEmailQueue } from "@modules/auth/infra/register/queue/registerEmailQueue.rabbitmq";
import * as amqplib from "amqplib";
import { rejects } from "assert";
import { ConsumeEmailService } from "./consumerEmailService.service";
import { LoginRepositoryTypeorm } from "@modules/auth/infra/login/repository/loginRepositoryTypeOrm.orm";
import { LoginGatewayLocal } from "@modules/auth/infra/login/gateway/loginGatewayLocal.local";
import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";
import { AuthorizationMiddleware } from "../middlewares/autorization.middleware";
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: RegisterRepositoryTypeOrm,
      useFactory: (dataSource: DataSource) => {
        return new RegisterRepositoryTypeOrm(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: RegisterGatewayLocal,
      useFactory: (dataSource: DataSource) => {
        return new RegisterGatewayLocal(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: LoginGatewayLocal,
      useFactory: (dataSource: DataSource) => {
        return new LoginGatewayLocal(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: LoginRepositoryTypeorm,
      useFactory: (dataSource: DataSource) => {
        return new LoginRepositoryTypeorm(dataSource);
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
      provide: RegisterEmailQueue,
      useFactory: async (repo: RegisterRepositoryTypeOrm) => {
        const connection = await amqplib.connect("amqp://admin:admin@rabbitmq:5672");
        connection.once("error", (error) => {
          console.log("Deu Erro - connection", error);
        });
        const channel = await connection.createChannel();
        channel.on("error", (error) => {
          console.log("Deu Erro - channel", error);
          rejects(error);
        });
        channel.prefetch(1);
        const queue = new RegisterEmailQueue(channel, repo);
        return queue;
      },
      inject: [RegisterRepositoryTypeOrm],
    },
    ConsumeEmailService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes("auth/protected");
  }
}
