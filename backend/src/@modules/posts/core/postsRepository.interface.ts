import { PostEntity } from "./entities/postEntity.entity";
import { UserEntity } from "./entities/user.entity";
import { updatePostInput } from "./usecase/updatePost.usecase";

export interface PostsRepositoryInterface {
  save(post: PostEntity): Promise<void>;
  findUserByUuid(uuid: string): Promise<UserEntity>;
  findPostByUuid(uuid: string): Promise<PostEntity>;
  DeletePostByUuid(uuid: string): Promise<void>;
  findPostsByUserUuid(uuid: string): Promise<PostEntity[]>;
  findPostsCreatedAtToday(): Promise<PostEntity[]>;
  updatePost(uuid: string, input: Partial<updatePostInput>): Promise<void>;
}
