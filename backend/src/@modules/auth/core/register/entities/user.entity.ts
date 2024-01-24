export type userProps = {
  uuid: string;
  email: string;
  password: string;
  userName: string;
  phone_number?: string;
  isVerify?: boolean;
};

export class UserEntity {
  constructor(readonly props: userProps) {}
  email(): string {
    return this.props.email;
  }
  uuid(): string {
    return this.props.uuid;
  }
  password(): string {
    return this.props.password;
  }
  isVerify(): boolean {
    return this.props.isVerify;
  }
  phone_number(): string {
    return this.props.phone_number;
  }
  setUserName(userName: string) {
    this.props.userName = userName;
  }
  setEmail(email: string) {
    this.props.email = email;
  }
  setPassword(Password: string) {
    this.props.password = Password;
  }
  setIsVerify(isVerify: boolean) {
    this.props.isVerify = isVerify;
  }
  payloadToken() {
    const payload: any = {
      uuid: this.props.uuid,
      name: this.props.userName,
      email: this.props.email,
    };
    return payload;
  }
}
