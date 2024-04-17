import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export class DeletePostUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(uuid: string, userUuid: string): Promise<void> {
    const post = await this.repo.findPostByUuid(uuid);
    if (!post) {
      throw new apiError("Nenhum post encontrado", 404, "NOT_FOUND");
    } else if (post.userUuid() !== userUuid) {
      throw new apiError("Você não pode deletar esse post", 401, "UNAUTHORIZED");
    }
    await this.repo.DeletePostByUuid(post.uuid());
  }
}
