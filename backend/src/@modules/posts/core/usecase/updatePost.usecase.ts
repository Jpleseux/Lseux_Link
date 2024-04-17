import { PostEntity } from "../entities/postEntity.entity";
import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export type updatePostInput = {
  title: string;
  text: string;
  images: string[];
};
export class updatePostUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(uuid: string, input: Partial<updatePostInput>): Promise<PostEntity> {
    const post = await this.repo.findPostByUuid(uuid);
    if (!post) {
      throw new apiError("Nenhum Post encontrado", 404, "NOT_FOUND");
    }
    if (input.images && input.images.length > 0) {
      if (post.images() && post.images().length > 0) {
        post.images().forEach((image) => {
          input.images.push(image);
        });
      }
    }
    
  }
}
