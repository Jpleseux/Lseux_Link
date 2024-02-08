export type userProps = {
    email: string;
    userName: string;
    phone_number?: string;
    avatar?: string;
    password: string;
  };
  
  export class UserEntity {
    constructor(readonly props: userProps) {}
    email(): string {
      return this.props.email;
    }
    avatar(): string | undefined{
      return this.props.avatar;
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
  }
  