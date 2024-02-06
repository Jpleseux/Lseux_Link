import { UserEntity } from "../../../entities/auth/User.entity";
import httpClient from "../../../http/httpClient";
import { userGateway } from "../../interfaces/auth/userGateway";
export type signUpOutput = {
    status: number,
    user?: UserEntity,
    message: string,
}
export class HttpUserGateway implements userGateway {
    constructor(readonly httpClient: httpClient) {}
    async signUp(user: UserEntity): Promise<signUpOutput> {
        const response = await this.httpClient.post("auth/save/user", user.props);
        if (response.status < 300) {
            const userRes =  new UserEntity({
                email: response.data.user.email,
                userName: response.data.user.userName,
                phone_number: response.data.user.phone_number,
            })
            return {
                status: response.status,
                user: userRes,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
}