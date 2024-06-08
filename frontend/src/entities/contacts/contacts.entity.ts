import { MessageEntity } from "./messageEntity.entity";
import { UserEntity } from "./user.entity";

export type contactProps = {
  uuid: string;
  firstUser: UserEntity;
  secondUser: UserEntity;
  messages?: MessageEntity[];
};
export class ContactEntity {
  constructor(readonly props: contactProps) {}

  uuid(): string {
    return this.props.uuid;
  }

  firstUser(): UserEntity {
    return this.props.firstUser;
  }

  secondUser(): UserEntity {
    return this.props.secondUser;
  }
  messages(): MessageEntity[] {
    return this.props.messages as MessageEntity[];
  }
  addMessages(value: MessageEntity) {
    if (this.props.messages){
      this.props.messages.push(value);
    }
  }
  setMessages(messages: MessageEntity[]) {
    this.props.messages = messages;
  }
  updateFirstUser(newFirstUser: UserEntity): ContactEntity {
    return new ContactEntity({
      ...this.props,
      firstUser: newFirstUser,
    });
  }

  updateSecondUser(newSecondUser: UserEntity): ContactEntity {
    return new ContactEntity({
      ...this.props,
      secondUser: newSecondUser,
    });
  }

  toOutput() {
    return {
      messages: this.messages().map((message) => {
        return message.toOutput();
      }),
      firstUser: this.firstUser().props,
      secondUser: this.secondUser().props,
      uuid: this.uuid(),
    };
  }
}
