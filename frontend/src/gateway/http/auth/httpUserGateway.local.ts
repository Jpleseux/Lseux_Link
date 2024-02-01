import { UserEntity } from "../../../entities/auth/User.entity";
import httpClient from "../../../http/httpClient";
import { userGateway } from "../../interfaces/auth/userGateway";

export class HttpUserGateway implements userGateway {
    constructor(readonly httpClient: httpClient) {}
    async signUp(user: UserEntity): Promise<UserEntity> {
        const response = await this.httpClient.post("auth/save/user", user);
        return new UserEntity({
            avatar: response.avatar,
            email: response.email,
            userName: response.userName,
            phone_number: response.phone_number,
        })
    }
}