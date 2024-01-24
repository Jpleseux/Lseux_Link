import { UserEntity } from "./entities/user.entity";

export interface RegisterGatewayInterface {
  validateEmail(email: string): Promise<string | boolean>;
  encryptPassword(password: string): Promise<string>;
  tokenGenerate(input: UserEntity): Promise<string>;
  tokenDecoding(token: string): Promise<any>;
}
