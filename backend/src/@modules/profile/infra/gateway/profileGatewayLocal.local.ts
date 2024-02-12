import { ProfileGatewayInterface } from "@modules/profile/core/profileGatewayInterface.interface";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { UserEntity } from "@modules/profile/core/entities/user.entity";
import { DataSource } from "typeorm";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
const segredo = "3cba50ad-324e-4f26-9bb9-3304bfc2c30e";

export class ProfileGatewayLocal implements ProfileGatewayInterface {
  constructor(readonly datasorce: DataSource) {}
  async validateEmail(email: string): Promise<string | boolean> {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      ? email
      : false;
  }
  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }
  async tokenGenerate(input: UserEntity): Promise<string> {
    const token = jwt.sign(input.payloadToken(), segredo);
    return token;
  }
  async tokenDecoding(token: string): Promise<any> {
    try {
      const payload = jwt.verify(token, segredo);
      return payload;
    } catch (error) {
      throw new apiError("Token inválido", 401, "not_authorized");
    }
  }
}
