import * as jwt from "jsonwebtoken";
import * as bcryptjs from "bcryptjs";
import { DataSource } from "typeorm";
import { LoginGatewayInterface } from "../../../core/login/loginGateway.interface";
import { UserEntity } from "@modules/auth/core/register/entities/user.entity";
import { UserModel } from "../../database/models/UserModel.model";
import { HttpException, HttpStatus } from "@nestjs/common";
import * as bcrypt from "bcrypt";
const segredo = "3cba50ad-324e-4f26-9bb9-3304bfc2c30e";

export class LoginGatewayLocal implements LoginGatewayInterface {
  constructor(readonly datasorce: DataSource) {}

  async userValidatePassword(user: UserEntity, password: string): Promise<boolean> {
    const userModel = await this.datasorce
      .getRepository(UserModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: user.uuid() })
      .getOne();
    return await bcryptjs.compare(password, userModel.password);
  }

  async tokenGenerate(user: UserEntity): Promise<string> {
    const token = jwt.sign(user.payloadToken(), segredo);
    return token;
  }

  async tokenDecoding(token: string): Promise<any> {
    try {
      const payload = jwt.verify(token, segredo);
      return payload;
    } catch (error) {
      throw new HttpException({ message: "Unauthorized" }, HttpStatus.UNAUTHORIZED);
    }
  }
  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }
}
