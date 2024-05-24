import { PostEntity } from "../entities/postEntity.entity";
import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class FindPostsByUserUuidUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(uuid: string): Promise<PostEntity[]> {
    const posts = await this.repo.findPostsByUserUuid(uuid);
    if (!posts || posts.length === 0) {
      throw new apiError("Nenhum post encontrado", 404, "NOT_FOUND");
    }
    posts.map((post) => {
      post.setAWsUrls();
    });
    return posts;
  }
}
