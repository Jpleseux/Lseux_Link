import { AddReactionToPostUsecase } from "@modules/posts/core/usecase/addReactionToPost.usecase";
import { PostModel } from "@modules/posts/infra/database/models/Post.model";
import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: PostsRepositoryTypeOrm;

describe("Deve testar o addReactionToPostUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new PostsRepositoryTypeOrm(dataSource);
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve adicionar um like para um post", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values({
        text: "test",
        title: "teste",
        user_uuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
        uuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
        des_like: {
          amount: 0,
          userUuids: [],
        },
        like: {
          amount: 0,
          userUuids: [],
        },
      })
      .execute();
    const action = new AddReactionToPostUsecase(repo);
    const post = await action.execute({
      postUuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
      type: "like",
      userUuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
    });
    expect(post.like().amount).toBe(1);
    expect(post.like().userUuids[0]).toBe(post.userUuid());
    await repo.DeletePostByUuid(post.uuid());
  });
  test("Deve adicionar um Des like para um post", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values({
        text: "test",
        title: "teste",
        user_uuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
        uuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
        des_like: {
          amount: 0,
          userUuids: [],
        },
        like: {
          amount: 0,
          userUuids: [],
        },
      })
      .execute();
    const action = new AddReactionToPostUsecase(repo);
    const post = await action.execute({
      postUuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
      type: "desLike",
      userUuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
    });
    expect(post.desLike().amount).toBe(1);
    expect(post.desLike().userUuids[0]).toBe(post.userUuid());
    await repo.DeletePostByUuid(post.uuid());
  });
  test("Deve remover um like para um post", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values({
        text: "test",
        title: "teste",
        user_uuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
        uuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
        des_like: {
          amount: 0,
          userUuids: [],
        },
        like: {
          amount: 1,
          userUuids: ["e3034bba-ff39-4e38-ba59-a77dd913f5c2"],
        },
      })
      .execute();
    const action = new AddReactionToPostUsecase(repo);
    const post = await action.execute({
      postUuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
      type: "like",
      userUuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
    });
    expect(post.like().amount).toBe(0);
    expect(post.like().userUuids.length).toBe(0);
    await repo.DeletePostByUuid(post.uuid());
  });
  test("Deve remover um deslike para um post", async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(PostModel)
      .values({
        text: "test",
        title: "teste",
        user_uuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
        uuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
        des_like: {
          amount: 1,
          userUuids: ["e3034bba-ff39-4e38-ba59-a77dd913f5c2"],
        },
        like: {
          amount: 0,
          userUuids: [],
        },
      })
      .execute();
    const action = new AddReactionToPostUsecase(repo);
    const post = await action.execute({
      postUuid: "44d360e1-2d23-4e1a-a2f9-59d6fa3ea6bb",
      type: "desLike",
      userUuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
    });
    expect(post.desLike().amount).toBe(0);
    expect(post.desLike().userUuids.length).toBe(0);
    await repo.DeletePostByUuid(post.uuid());
  });
});
