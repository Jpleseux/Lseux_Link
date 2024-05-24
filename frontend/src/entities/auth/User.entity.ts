export type userProps = {
    email: string;
    userName: string;
    phone_number?: string;
    avatar?: string;
    password: string;
    token?: string;
    uuid?: string;
  };
  
  export class UserEntity {
    constructor(readonly props: userProps) {}
    email(): string {
      return this.props.email;
    }
    uuid(): string | undefined{
      return this.props.uuid;
    }
    avatar(): string | undefined{
      return this.props.avatar;
    }
    token(): string | undefined{
      return this.props.token;
    }
    userName(): string {
      return this.props.userName;
    }
    password(): string {
      return this.props.password;
    }
    setUserName(userName: string) {
      this.props.userName = userName;
    }
    setPassword(password: string) {
      this.props.password = password;
    }
    setEmail(email: string) {
      this.props.email = email;
    }
    setToken(token: string) {
      this.props.token = token;
    }
  }
  