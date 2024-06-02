export type userProps = {
  uuid: string;
  userName: string;
  avatar?: string;
};

export class UserEntity {
  constructor(readonly props: userProps) {}
  avatar(): string {
    return this.props.avatar;
  }
  uuid(): string {
    return this.props.uuid;
  }
  userName(): string {
    return this.props.userName;
  }
  setUserName(userName: string) {
    this.props.userName = userName;
  }
  setAvatar(avatar: string | null) {
    this.props.avatar = avatar;
  }
  payloadToken() {
    const payload: any = {
      uuid: this.props.uuid,
      name: this.props.userName,
    };
    return payload;
  }
}
