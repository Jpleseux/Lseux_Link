import { PostEntity } from "@modules/posts/core/entities/postEntity.entity";
import { PostsRepositoryInterface } from "@modules/posts/core/postsRepository.interface";
import { DataSource } from "typeorm";
import { PostModel } from "../database/models/Post.model";
import { UserEntity } from "@modules/posts/core/entities/user.entity";
import { PostsUserModel } from "../database/models/UserModel.model";
import { updatePostInput } from "@modules/posts/core/usecase/updatePost.usecase";
import { CommentEntity } from "@modules/posts/core/entities/comment.entity";
import { CommentsModel } from "../database/models/comments.model";

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
          des_like: post.desLike(),
          like: post.like(),
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
    const user = new UserEntity(userDb);
    user.setAvatar(process.env.STORAGE_BASE_URL + userDb.avatar);
    return user;
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
      comments: await this.findCommentsByPostUuid(postDB.uuid),
      uuid: postDB.uuid,
      desLike: postDB.des_like,
      createdAt: postDB.created_at,
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
          comments: await this.findCommentsByPostUuid(postDB.uuid),
          desLike: postDB.des_like,
          like: postDB.like,
          createdAt: postDB.created_at,
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
      .orderBy("created_at", "DESC")
      .getMany();
    if (!postsDB || postsDB.length === 0) {
      return [];
    }
    for (const postDB of postsDB) {
      posts.push(
        new PostEntity({
          images: postDB.images,
          comments: await this.findCommentsByPostUuid(postDB.uuid),
          title: postDB.title,
          text: postDB.text,
          user: await this.findUserByUuid(postDB.user_uuid),
          uuid: postDB.uuid,
          desLike: postDB.des_like,
          like: postDB.like,
          createdAt: postDB.created_at,
          userUuid: postDB.user_uuid,
        }),
      );
    }
    return posts;
  }
  async updatePost(uuid: string, input: Partial<updatePostInput>): Promise<void> {
    await this.dataSource
      .getRepository(PostModel)
      .createQueryBuilder()
      .update(PostModel)
      .set(input)
      .where("uuid = :uuid ", { uuid: uuid })
      .execute();
  }
  async setNewReactions(newPost: PostEntity, type: string): Promise<void> {
    if (type === "like") {
      await this.dataSource
        .getRepository(PostModel)
        .createQueryBuilder()
        .update(PostModel)
        .set({ like: newPost.like(), des_like: newPost.desLike() })
        .where("uuid = :uuid ", { uuid: newPost.uuid() })
        .execute();
    } else if (type === "desLike") {
      await this.dataSource
        .getRepository(PostModel)
        .createQueryBuilder()
        .update(PostModel)
        .set({ like: newPost.like(), des_like: newPost.desLike() })
        .where("uuid = :uuid ", { uuid: newPost.uuid() })
        .execute();
    }
  }
  async saveComment(comment: CommentEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(CommentsModel)
      .values([
        {
          created_at: comment.createdAt(),
          comment: comment.comment(),
          post_uuid: comment.posterUuid(),
          user_uuid: comment.userUuid(),
          uuid: comment.uuid(),
        },
      ])
      .execute();
  }
  async findCommentsByPostUuid(uuid: string): Promise<CommentEntity[]> {
    const commentsDb = await this.dataSource
      .getRepository(CommentsModel)
      .createQueryBuilder()
      .where("post_uuid = :uuid", { uuid: uuid })
      .orderBy("created_at", "DESC")
      .getMany();
    if (!commentsDb || (commentsDb && commentsDb.length === 0)) {
      return;
    }
    return await Promise.all(
      commentsDb.map(async (comment) => {
        return new CommentEntity({
          comment: comment.comment,
          createdAt: comment.created_at,
          posterUuid: comment.post_uuid,
          userUuid: comment.user_uuid,
          uuid: comment.uuid,
          user: await this.findUserByUuid(comment.user_uuid),
        });
      }),
    );
  }
}
