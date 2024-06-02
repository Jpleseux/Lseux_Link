import { UserEntity } from "./user.entity";

export type NotificationProps = {
  uuid: string;
  to: UserEntity[];
  message: string;
  type: "system" | "personal" | "group";
  isReaded: boolean;
  isInvite: boolean;
  from?: UserEntity;
};
export class NotificationEntity {
  constructor(readonly props: NotificationProps) {}
  Uuid(): string {
    return this.props.uuid;
  }
  Message(): string {
    return this.props.message;
  }
  Type(): string {
    return this.props.type;
  }
  To(): UserEntity[] {
    return this.props.to;
  }
  From(): UserEntity {
    return this.props.from;
  }
  IsInvite(): boolean {
    return this.props.isInvite;
  }
  IsReaded(): boolean {
    return this.props.isReaded;
  }
  removeTo(uuid: string) {
    this.props.to = this.props.to.filter((user) => user.uuid() !== uuid);
  }
  setFrom(user: UserEntity) {
    this.props.from = user;
  }
}
