import { MessageEntity } from "./messageEntity.entity";
import { UserEntity } from "./user.entity";

export type ChatEntityProps = {
  uuid: string;
  name: string;
  type: string;
  messages: MessageEntity[];
  users: UserEntity[];
};
export class ChatEntity {
  constructor(readonly props: ChatEntityProps) {}
  uuid(): string {
    return this.props.uuid;
  }
  type(): string {
    return this.props.type;
  }
  name(): string {
    return this.props.name;
  }
  messages(): MessageEntity[] {
    return this.props.messages;
  }
  users(): UserEntity[] {
    return this.props.users;
  }
  verifyUser(user: UserEntity): boolean {
    return this.props.users.some((u) => u.uuid() === user.uuid());
  }
  addUser(user: UserEntity) {
    if (this.props.type === "personal") {
      return false;
    } else {
      this.props.users.push(user);
      return true;
    }
  }
  toOutput() {
    return {
      uuid: this.props.uuid,
      name: this.props.name,
      type: this.props.type,
      users: this.users().map((user) => {
        return user.props;
      }),
      messages: this.messages().map((message) => {
        return message.toOutput();
      }),
    };
  }
}
