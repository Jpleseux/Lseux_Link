import { UserEntity } from "./user.entity";

export type commentProps = {
  uuid: string;
  comment: string;
  userUuid: string;
  user?: UserEntity;
  posterUuid: string;
  createdAt: Date;
};
export class CommentEntity {
  constructor(readonly props: commentProps) {}
  uuid(): string {
    return this.props.uuid;
  }
  comment(): string {
    return this.props.comment;
  }
  userUuid(): string {
    return this.props.userUuid;
  }
  posterUuid(): string {
    return this.props.posterUuid;
  }
  createdAt(): Date {
    return this.props.createdAt;
  }
}
