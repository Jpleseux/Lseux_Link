import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { UserEntity } from "./user.entity";

export type ChatEntityProps = {
  uuid: string;
  name: string;
  type: string;
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
  users(): UserEntity[] {
    return this.props.users;
  }
  verifyUser(user: UserEntity): boolean {
    return this.props.users.some((u) => u.uuid() === user.uuid());
  }
  addUser(user: UserEntity) {
    if (this.props.type === "personal") {
      throw new apiError("Um chat pessoal com um contato não pode adicionar mais usuarios", 400, "invalid");
    } else {
      this.props.users.push(user);
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
    };
  }
}
