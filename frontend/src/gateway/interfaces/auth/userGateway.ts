import { UserEntity } from "../../../entities/auth/User.entity";
import { signUpOutput } from "../../http/auth/httpUserGateway.local";

export interface userGateway {
    signUp(user: UserEntity): Promise<signUpOutput>;
}