import { PostEntity } from "../entities/postEntity.entity";
import { PostsRepositoryInterface } from "../postsRepository.interface";

export class FinPostsCreatedAtTodayUsecase {
  constructor(readonly repo: PostsRepositoryInterface) {}
  public async execute(): Promise<PostEntity[]> {
    const posts = await this.repo.findPostsCreatedAtToday();
    if (!posts || posts.length === 0) {
      return [];
    }
    posts.map((post) => {
      post.setAWsUrls();
    });
    return posts;
  }
}
