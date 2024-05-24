import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";
import { PostEntity } from "../entities/postEntity.entity";
import { isUUID } from "class-validator";

export class GetPostsByUuidUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(uuid: string): Promise<PostEntity> {
    if (!isUUID(uuid)) {
      throw new apiError("Nenhum post encontrado", 404, "not found");
    }
    const post = await this.repo.findPostByUuid(uuid);
    if (!post) {
      throw new apiError("Nenhum post encontrado", 404, "not found");
    }
    post.setAWsUrls();
    return post;
  }
}
