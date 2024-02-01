import { UserEntity } from "../../../entities/auth/User.entity";

export interface userGateway {
    signUp(user: UserEntity): Promise<UserEntity>;
}