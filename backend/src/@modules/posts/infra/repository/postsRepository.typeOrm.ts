import { PostEntity } from "@modules/posts/core/entities/postEntity.entity";
import { PostsRepositoryInterface } from "@modules/posts/core/postsRepository.interface";
import { DataSource } from "typeorm";
import { PostModel } from "../database/models/Post.model";
import { UserEntity } from "@modules/posts/core/entities/user.entity";
import { PostsUserModel } from "../database/models/UserModel.model";
import { updatePostInput } from "@modules/posts/core/usecase/updatePost.usecase";

export class PostsRepositoryTypeOrm implements PostsRepositoryInterface {
  constructor(private dataSource: DataSource) {}
  async save(post: PostEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values([
        {
          images: post.images(),
          text: post.text(),
          title: post.title(),
          user_uuid: post.userUuid(),
          uuid: post.uuid(),
        },
      ])
      .execute();
  }
  async findUserByUuid(uuid: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(PostsUserModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!userDb) {
      return;
    }
    return new UserEntity(userDb);
  }
  async findPostByUuid(uuid: string): Promise<PostEntity> {
    const postDB = await this.dataSource
      .getRepository(PostModel)
      .createQueryBuilder()
      .where("uuid = :uuid", { uuid: uuid })
      .getOne();
    if (!postDB) {
      return;
    }
    return new PostEntity({
      images: postDB.images,
      title: postDB.title,
      text: postDB.text,
      uuid: postDB.uuid,
      desLike: postDB.des_like,
      like: postDB.like,
      user: await this.findUserByUuid(postDB.user_uuid),
      userUuid: postDB.user_uuid,
    });
  }
  async DeletePostByUuid(uuid: string): Promise<void> {
    await this.dataSource.createQueryBuilder().delete().from(PostModel).where("uuid = :uuid", { uuid: uuid }).execute();
  }
  async findPostsByUserUuid(uuid: string): Promise<PostEntity[]> {
    const posts: PostEntity[] = [];
    const postsDB = await this.dataSource
      .getRepository(PostModel)
      .createQueryBuilder()
      .where("user_uuid = :user_uuid", { user_uuid: uuid })
      .getMany();
    if (!postsDB || postsDB.length === 0) {
      return [];
    }
    for (const postDB of postsDB) {
      posts.push(
        new PostEntity({
          images: postDB.images,
          title: postDB.title,
          text: postDB.text,
          user: await this.findUserByUuid(postDB.user_uuid),
          uuid: postDB.uuid,
          desLike: postDB.des_like,
          like: postDB.like,
          userUuid: postDB.user_uuid,
        }),
      );
    }
    return posts;
  }
  async findPostsCreatedAtToday(): Promise<PostEntity[]> {
    const posts: PostEntity[] = [];
    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    const postsDB = await this.dataSource
      .getRepository(PostModel)
      .createQueryBuilder()
      .where("created_at >= :today", { today: today })
      .andWhere("created_at < :tomorrow", { tomorrow: new Date(today.getTime() + 24 * 60 * 60 * 1000) })
      .getMany();
    if (!postsDB || postsDB.length === 0) {
      return [];
    }
    for (const postDB of postsDB) {
      posts.push(
        new PostEntity({
          images: postDB.images,
          title: postDB.title,
          text: postDB.text,
          user: await this.findUserByUuid(postDB.user_uuid),
          uuid: postDB.uuid,
          desLike: postDB.des_like,
          like: postDB.like,
          userUuid: postDB.user_uuid,
        }),
      );
    }
    return posts;
  }
  async updatePost(uuid: string, input: Partial<updatePostInput>): Promise<void> {
    await this.dataSource.createQueryBuilder().update(PostModel).set(input).where("uuid = :uuid ", { uuid: uuid }).execute();
  }
}
