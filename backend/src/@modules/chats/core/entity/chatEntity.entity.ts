import { MessageEntity } from "@modules/messages/core/entities/messageEntity.entity";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
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
      throw new apiError("Um chat pessoal com um contato não pode adicionar mais usuarios", 400, "invalid");
    } else {
      this.props.users.push(user);
    }
  }
  removeUser(user: UserEntity) {
    if (this.props.type === "personal") {
      throw new apiError("Um chat pessoal com um contato não pode remover usuarios", 400, "invalid");
    }
    const userIndex = this.props.users.findIndex((u) => u.uuid() === user.uuid());

    if (userIndex === -1) {
      throw new apiError("Usuário não encontrado no chat", 404, "not_found");
    }
    this.props.users.splice(userIndex, 1);
  }

  toOutput() {
    return {
      uuid: this.props.uuid,
      name: this.props.name,
      type: this.props.type,
      users: this.users().map((user) => {
        return user.props;
      }),
      messages:
        this.messages() && this.messages().length === 0
          ? []
          : this.messages().map((message) => {
              return message.toOutput();
            }),
    };
  }
}
