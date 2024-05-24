import { UserEntity } from "../../../entities/auth/User.entity";
export type Output = {
    status: number,
    user?: UserEntity,
    message: string,
    token?: string
}
export type changeUserInput = {
    email: string;
    userName: string;
    avatar: string;
    phone_number: string;
    password: string;
}
export interface profileGateway {
    changeAvatar(image: any): Promise<Output>;
    findUserByEmail(): Promise<Output>;
    changeUser(user: changeUserInput): Promise<Output>;
    changePassword(newPassword: string): Promise<Output>;
}