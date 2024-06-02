import { UserEntity } from "./user.entity";

export type contactProps = {
  uuid: string;
  firstUser: UserEntity;
  secondUser: UserEntity;
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
}
