export type userProps = {
    email: string;
    userName: string;
    phone_number?: string;
    avatar?: string;
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
    setUserName(userName: string) {
      this.props.userName = userName;
    }
    setEmail(email: string) {
      this.props.email = email;
    }
    payloadToken() {
      const payload: any = {
        name: this.props.userName,
        email: this.props.email,
      };
      return payload;
    }
  }
  