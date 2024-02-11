import { UserEntity } from "../../../entities/auth/User.entity";
import { Output, signUpOutput } from "../../http/auth/httpUserGateway.local";

export interface userGateway {
    signUp(user: UserEntity): Promise<signUpOutput>;
    ResendEmailVerifyAccountToUser(email: string): Promise<Output>;
}