import { MessageEntity } from "./messageEntity.entity";
import { UserEntity } from "./user.entity";

export type contactProps = {
  uuid: string;
  firstUser: UserEntity;
  secondUser: UserEntity;
  messages?: MessageEntity[];
  blocked?: boolean;
};
export class ContactEntity {
  constructor(private readonly props: contactProps) {}

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
    return this.props.messages;
  }
  addMessages(value: MessageEntity) {
    this.props.messages.push(value);
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
