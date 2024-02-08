export type userProps = {
  uuid: string;
  email: string;
  password: string;
  userName: string;
  phone_number?: string;
  avatar?: string;
  is_verify?: boolean;
};

export class UserEntity {
  constructor(readonly props: userProps) {}
  email(): string {
    return this.props.email;
  }
  avatar(): string {
    return this.props.avatar;
  }
  uuid(): string {
    return this.props.uuid;
  }
  password(): string {
    return this.props.password;
  }
  userName(): string {
    return this.props.userName;
  }
  is_verify(): boolean {
    return this.props.is_verify;
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
  setIs_verify(is_verify: boolean) {
    this.props.is_verify = is_verify;
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
