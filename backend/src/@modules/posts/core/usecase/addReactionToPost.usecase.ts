import { PostEntity } from "../entities/postEntity.entity";
import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export type addReactionToPostInput = {
  userUuid: string;
  postUuid: string;
  type: string;
};
export class AddReactionToPostUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(input: addReactionToPostInput): Promise<PostEntity> {
    const post = await this.repo.findPostByUuid(input.postUuid);
    if (!post) {
      throw new apiError("Postagem não encontrada", 404, "NOT_FOUND");
    }
    if (input.type === "like") {
      post.addLike(input.userUuid);
    } else if (input.type === "desLike") {
      post.addDesLike(input.userUuid);
    } else {
      throw new apiError("Padrão inválido", 400, "NOT_FOUND");
    }
    await this.repo.setNewReactions(post, input.type);
    post.setAWsUrls();
    return post;
  }
}
