import { UserEntity } from "./entities/user.entity";

export interface LoginGatewayInterface {
  userValidatePassword(user: UserEntity, password: string): Promise<boolean>;
  tokenGenerate(user: UserEntity): Promise<string>;
  tokenDecoding(token: string): Promise<any>;
}
