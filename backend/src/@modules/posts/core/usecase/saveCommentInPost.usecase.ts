import { randomUUID } from "crypto";
import { CommentEntity } from "../entities/comment.entity";
import { PostsRepositoryInterface } from "../postsRepository.interface";
import { apiError } from "../../../../http/nestjs/helpers/api-Error.helper";

export type SaveCommentInput = {
  comment: string;
  userUuid: string;
  posterUuid: string;
};
export class SaveCommentInPostUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(input: SaveCommentInput): Promise<CommentEntity> {
    const post = await this.repo.findPostByUuid(input.posterUuid);
    const user = await this.repo.findUserByUuid(input.userUuid);
    if (!post) {
      throw new apiError("Postagem não encontrado", 404, "NOT_FOUND");
    }
    const comment = new CommentEntity({
      comment: input.comment,
      createdAt: new Date(Date.now()),
      posterUuid: input.posterUuid,
      userUuid: input.userUuid,
      user: user,
      uuid: randomUUID(),
    });
    await this.repo.saveComment(comment);
    return comment;
  }
}
