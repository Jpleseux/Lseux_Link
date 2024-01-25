import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { RegisterRepositoryTypeOrm } from "@modules/auth/infra/register/repository/registerRepository.typeorm";
import { DataSource } from "typeorm";
import { getDataSourceToken } from "@nestjs/typeorm";
import { RegisterGatewayLocal } from "@modules/auth/infra/register/gateway/registerGateway.local";

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
  ],
})
export class AuthModule {}
