import { UserEntity } from "./User.entity";

export interface PostEntityProps {
  uuid: string;
  title: string;
  text: string;
  like?: number;
  desLike?: number;
  user?: UserEntity;
  images: string[];
  userUuid: string;
}

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

  like(): number | undefined {
    return this.props.like;
  }

  desLike(): number | undefined {
    return this.props.desLike;
  }

  user(): UserEntity | undefined {
    return this.props.user;
  }

  userUuid(): string {
    return this.props.userUuid;
  }

  images(): string[] {
    return this.props.images;
  }

  addImages(img: string): void {
    if (this.props.images && this.props.images.length > 0) {
      this.props.images.push(img);
    } else {
      this.props.images = [img];
    }
  }

  toOutput(): Record<string, any> {
    return {
      uuid: this.props.uuid,
      title: this.props.title,
      text: this.props.text,
      like: this.props.like,
      desLike: this.props.desLike,
      user: this.props.user ? this.props.user.props : undefined,
      images: this.images(),
      userUuid: this.userUuid(),
    };
  }
}
