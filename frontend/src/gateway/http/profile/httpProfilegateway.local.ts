import { UserEntity } from "../../../entities/auth/User.entity";
import httpClient from "../../../http/httpClient";
import { Output, changeUserInput, profileGateway } from "../../interfaces/profile/profileGateway";

export class HttpProfileGateway implements profileGateway {
  constructor(readonly httpClient: httpClient) {}

  async changeAvatar(image: File): Promise<Output> {
    const formData = new FormData();
    formData.append('file', image);

    const response = await this.httpClient.patch("profile/update/avatar", formData, true);
    if (response && response.status < 300) {
      const userRes = new UserEntity({
        email: response.data.user.email,
        userName: response.data.user.userName,
        phone_number: response.data.user.phone_number,
        password: response.data.user.password,
        avatar: response.data.user.avatar,
        uuid: response.data.user.avatar,
      });
      return {
        token: response.data.token,
        status: response.status,
        user: userRes,
        message: response.data.message,
      };
    }
    return {
      status: response.status,
      message: response.data.message,
    };
  }

  async findUserByEmail(): Promise<Output> {
    const response = await this.httpClient.get("profile/user/email");
    if (response && response.status < 300) {
      const userRes = new UserEntity({
        uuid: response.data.user.uuid,
        avatar: response.data.user.avatar,
        email: response.data.user.email,
        userName: response.data.user.userName,
        phone_number: response.data.user.phone_number,
        password: response.data.user.password,
      });
      return {
        token: response.data.token,
        status: response.status,
        user: userRes,
        message: response.data.message,
      };
    }
    return {
      status: response.status,
      message: response.data.message,
    };
  }

  async changeUser(user: changeUserInput): Promise<Output> {
    const response = await this.httpClient.patch("profile/update/user", user);
    if (response && response.status < 300) {
      const userRes = new UserEntity({
        avatar: response.data.user.avatar,
        email: response.data.user.email,
        userName: response.data.user.userName,
        phone_number: response.data.user.phone_number,
        password: response.data.user.password,
      });
      return {
        token: response.data.token,
        status: response.status,
        user: userRes,
        message: response.data.message,
      };
    }
    return {
      status: response.status,
      message: response.data.message,
    };
  }

  async changePassword(newPassword: string): Promise<Output> {
    const response = await this.httpClient.post("auth/protected/recovery/password", { password: newPassword });
    if (response && response.status < 300) {
      const userRes = new UserEntity({
        avatar: response.data.user.avatar,
        email: response.data.user.email,
        userName: response.data.user.userName,
        phone_number: response.data.user.phone_number,
        password: response.data.user.password,
      });
      return {
        token: response.data.token,
        status: response.status,
        user: userRes,
        message: response.data.message,
      };
    }
    return {
      status: response.status,
      message: response.data.message,
    };
  }
}
