import { reaction } from "@modules/posts/infra/database/models/Post.model";
import { UserEntity } from "./user.entity";
import { CommentEntity } from "./comment.entity";

export type PostEntityProps = {
  uuid: string;
  title: string;
  text: string;
  like: reaction;
  desLike: reaction;
  comments?: CommentEntity[];
  user?: UserEntity;
  images: string[];
  createdAt?: Date;
  userUuid: string;
};
export class PostEntity {
  constructor(readonly props: PostEntityProps) {}
  uuid(): string {
    return this.props.uuid;
  }
  title(): string {
    return this.props.title;
  }
  text(): string {
    return this.props.text;
  }
  createdAt(): Date {
    return this.props.createdAt;
  }
  comments(): CommentEntity[] {
    return this.props.comments;
  }
  like(): reaction {
    return this.props.like;
  }
  desLike(): reaction {
    return this.props.desLike;
  }
  user(): UserEntity {
    return this.props.user;
  }
  userUuid(): string {
    return this.props.userUuid;
  }
  images(): string[] {
    return this.props.images;
  }
  addLike(userUuid: string) {
    if (this.props.like.userUuids.includes(userUuid)) {
      if (this.props.desLike.amount > 0) {
        this.removeDesLike(userUuid);
      } else {
        this.removeLike(userUuid);
      }
    } else {
      if (this.props.desLike.userUuids.includes(userUuid) && this.props.desLike.amount > 0) {
        this.removeDesLike(userUuid);
      }
      this.props.like.amount += 1;
      this.props.like.userUuids.push(userUuid);
    }
  }
  removeLike(userUuid: string) {
    this.props.like.amount -= 1;
    const index = this.props.like.userUuids.indexOf(userUuid);
    if (index !== -1) {
      this.props.like.userUuids.splice(index, 1);
    }
  }
  addDesLike(userUuid: string) {
    if (this.props.desLike.userUuids.includes(userUuid)) {
      if (this.props.like.amount > 0) {
        this.removeLike(userUuid);
      } else {
        this.removeDesLike(userUuid);
      }
    } else {
      if (this.props.like.userUuids.includes(userUuid) && this.props.like.amount > 0) {
        this.removeLike(userUuid);
      }
      this.props.desLike.amount += 1;
      this.props.desLike.userUuids.push(userUuid);
    }
  }
  removeDesLike(userUuid: string) {
    this.props.desLike.amount -= 1;
    const index = this.props.desLike.userUuids.indexOf(userUuid);
    if (index !== -1) {
      this.props.desLike.userUuids.splice(index, 1);
    }
  }
  addImages(img: string): void {
    if (this.props.images && this.props.images.length > 0) {
      this.props.images.push(img);
    } else {
      this.props.images = [img];
    }
  }
  setAWsUrls() {
    if (this.props.images && this.props.images.length > 0) {
      for (let i = 0; i < this.props.images.length; i++) {
        this.props.images[i] = process.env.STORAGE_BASE_URL + this.props.images[i];
      }
    }
  }
  toOutput(): object {
    return {
      uuid: this.props.uuid,
      title: this.props.title,
      createdAt: this.createdAt(),
      text: this.props.text,
      like: this.props.like !== undefined ? this.props.like : 0,
      desLike: this.props.desLike !== undefined ? this.props.desLike : 0,
      user: this.props.user ? this.props.user.props : undefined,
      images: this.props.images !== undefined ? this.props.images : [],
      comments:
        this.comments() && this.comments().length > 0
          ? this.comments().map((comment) => {
              return comment.props;
            })
          : [],
      userUuid: this.userUuid(),
    };
  }
}
