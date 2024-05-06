import { PostEntity } from "../entities/postEntity.entity";
import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { randomUUID } from "crypto";
export type savePostInput = {
  title: string;
  text: string;
  images: string[];
  userUuid: string;
};
export class SavePostUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(input: savePostInput): Promise<PostEntity> {
    const user = await this.repo.findUserByUuid(input.userUuid);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "not_found");
    }
    const post = new PostEntity({
      images: input.images,
      text: input.text,
      userUuid: input.userUuid,
      title: input.title,
      user: user,
      uuid: randomUUID(),
    });
    await this.repo.save(post);
    return post;
  }
}
