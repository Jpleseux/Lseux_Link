import { CommentEntity } from "./comment.entity";
import { UserEntity } from "./User.entity";
export type reaction = {
  amount: number;
  userUuids: string[];
};
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
    const liked = this.props.like.userUuids.includes(userUuid);
    const disliked = this.props.desLike.userUuids.includes(userUuid);

    if (liked) {
      this.removeLike(userUuid);
    } else {
      if (disliked) {
        this.removeDesLike(userUuid);
      }
      this.props.like.amount += 1;
      this.props.like.userUuids.push(userUuid);
    }
  }

  removeLike(userUuid: string) {
    const index = this.props.like.userUuids.indexOf(userUuid);
    if (index !== -1) {
      this.props.like.amount -= 1;
      this.props.like.userUuids.splice(index, 1);
    }
  }

  addDesLike(userUuid: string) {
    const disliked = this.props.desLike.userUuids.includes(userUuid);
    const liked = this.props.like.userUuids.includes(userUuid);

    if (disliked) {
      this.removeDesLike(userUuid);
    } else {
      if (liked) {
        this.removeLike(userUuid);
      }
      this.props.desLike.amount += 1;
      this.props.desLike.userUuids.push(userUuid);
    }
  }

  removeDesLike(userUuid: string) {
    const index = this.props.desLike.userUuids.indexOf(userUuid);
    if (index !== -1) {
      this.props.desLike.amount -= 1;
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
    for (let i = 0; i < this.props.images.length; i++) {
      this.props.images[i] = process.env.STORAGE_BASE_URL + this.props.images[i];
    }
  }
  addComment(comment: CommentEntity) {
    if (!this.props.comments || (this.props.comments && this.props.comments.length === 0 )) {
      this.props.comments = [comment];
    } else {
      this.props.comments.push(comment);
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
