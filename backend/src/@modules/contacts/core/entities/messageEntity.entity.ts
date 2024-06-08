import { UserEntity } from "@modules/chats/core/entity/user.entity";

export type MessageProps = {
  uuid: string;
  chatUuid: string;
  text: string;
  sender: UserEntity;
};
export class MessageEntity {
  constructor(readonly props: MessageProps) {}
  uuid(): string {
    return this.props.uuid;
  }
  text(): string {
    return this.props.text;
  }
  chatUuid(): string {
    return this.props.chatUuid;
  }
  sender(): UserEntity {
    return this.props.sender;
  }
  toOutput(): object {
    return { sender: this.sender().props, text: this.text(), chatUuid: this.chatUuid(), uuid: this.uuid() };
  }
}
