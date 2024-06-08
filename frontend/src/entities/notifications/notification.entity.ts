import { UserEntity } from "./User.entity";

export type NotificationProps = {
  to: UserEntity[];
  message: string;
  type: "system" | "personal" | "group";
  isReaded: boolean;
  isInvite: boolean;
  uuid?: string;
  from?: UserEntity;
};
export class NotificationEntity {
  constructor(readonly props: NotificationProps) {}
  Uuid(): string {
    return this.props.uuid as string;
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
    return this.props.from as UserEntity;
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
  toOutput(): object {
    return {
      uuid: this.Uuid(),
      to: this.To().map((user) => user.props),
      message: this.Message(),
      type: this.Type(),
      isReaded: this.IsReaded(),
      isInvite: this.IsInvite(),
      from: this.From() ? this.From().props : null,
    };
  }
}
