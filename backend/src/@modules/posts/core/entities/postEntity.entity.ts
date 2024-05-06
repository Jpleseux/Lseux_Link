import { UserEntity } from "./user.entity";

export type PostEntityProps = {
  uuid: string;
  title: string;
  text: string;
  like?: number;
  desLike?: number;
  user?: UserEntity;
  images: string[];
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
  like(): number {
    return this.props.like;
  }
  desLike(): number {
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
  addImages(img: string): void {
    if (this.props.images && this.props.images.length > 0) {
      this.props.images.push(img);
    } else {
      this.props.images = [img];
    }
  }
  toOutput(): object {
    return {
      uuid: this.props.uuid,
      title: this.props.title,
      text: this.props.text,
      like: this.props.like !== undefined ? this.props.like : 0,
      desLike: this.props.desLike !== undefined ? this.props.desLike : 0,
      user: this.props.user ? this.props.user.props : undefined,
      images: this.props.images !== undefined ? this.props.images : [],
      userUuid: this.userUuid(),
    };
  }
}
