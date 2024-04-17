export type PostEntityProps = {
  uuid: string;
  title: string;
  text: string;
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
  userUuid(): string {
    return this.props.userUuid;
  }
  images(): string[] {
    return this.props.images;
  }
  addImages(img: string): void {
    if (this.props.images && this.props.images.length > 0) {
      this.props.images.push(img);
    }
    this.props.images = [img];
  }
}
