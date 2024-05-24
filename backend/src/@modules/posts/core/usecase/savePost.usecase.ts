import { PostEntity } from "../entities/postEntity.entity";
import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { randomUUID } from "crypto";
import { UploadImageStorageInterface } from "../storage.interface";
export type savePostInput = {
  title: string;
  text: string;
  images: Express.Multer.File[];
  userUuid: string;
};
export class SavePostUsecase {
  constructor(
    readonly repo: PostsRepositoryInterface,
    readonly storage: UploadImageStorageInterface,
  ) {}
  public async execute(input: savePostInput): Promise<PostEntity> {
    const user = await this.repo.findUserByUuid(input.userUuid);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "not_found");
    }
    const post = new PostEntity({
      images: await Promise.all(
        input.images.map(async (img) => {
          return await this.storage.save(img);
        }),
      ),
      text: input.text,
      userUuid: input.userUuid,
      title: input.title,
      user: user,
      desLike: {
        amount: 0,
        userUuids: [],
      },
      like: {
        amount: 0,
        userUuids: [],
      },
      uuid: randomUUID(),
    });
    await this.repo.save(post);
    post.setAWsUrls();
    return post;
  }
}
