import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SavePostInputDto } from "./dto/savePosts.request.dto";
import { SavePostUsecase } from "@modules/posts/core/usecase/savePost.usecase";
import { GetPostsByUuidUsecase } from "@modules/posts/core/usecase/getPostByUuid.usecase";
import { FindPostsByUserUuidUsecase } from "@modules/posts/core/usecase/findPostsByUserUuid.usecase";
import { FinPostsCreatedAtTodayUsecase } from "@modules/posts/core/usecase/findPostsCreatedAtToday.usecase";
import { UpdatePostInputDto } from "./dto/updatePosts.request.dto";
import { updatePostUsecase } from "@modules/posts/core/usecase/updatePost.usecase";
import { DeletePostUsecase } from "@modules/posts/core/usecase/DeletePost.usecase";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(readonly repo: PostsRepositoryTypeOrm) {}
  @Post()
  async savePost(@Res() res, @Req() req, @Body() body: SavePostInputDto) {
    const tokenDecoded = req["tokenPayload"];
    const action = new SavePostUsecase(this.repo);
    const post = await action.execute({ ...body, userUuid: tokenDecoded.uuid });
    res.status(HttpStatus.OK).send({
      message: "Postagem salvo com sucesso",
      post: post.toOutput(),
    });
  }
  @Get(":uuid")
  async getPostByUuid(@Param("uuid") uuid: string, @Res() res) {
    const action = new GetPostsByUuidUsecase(this.repo);
    const post = await action.execute(uuid);
    res.status(HttpStatus.OK).send({
      post: post.toOutput(),
    });
  }
  @Get("user/uuid")
  async getPostByUserUuid(@Res() res, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    const action = new FindPostsByUserUuidUsecase(this.repo);
    const posts = await action.execute(tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      posts: posts.map((post) => {
        return post.toOutput();
      }),
    });
  }
  @Get("user/today")
  async getPostCreatedToday(@Res() res) {
    const action = new FinPostsCreatedAtTodayUsecase(this.repo);
    const posts = await action.execute();
    res.status(HttpStatus.OK).send({
      posts: posts.map((post) => {
        return post.toOutput();
      }),
    });
  }
  @Patch(":uuid")
  async updatePost(@Param("uuid") uuid: string, @Res() res, @Req() req, @Body() body: UpdatePostInputDto) {
    const tokenDecoded = req["tokenPayload"];
    const action = new updatePostUsecase(this.repo);
    const post = await action.execute(uuid, body, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Postagem atualizada com sucesso",
      post: post.toOutput(),
    });
  }
  @Delete(":uuid")
  async deletePost(@Param("uuid") uuid: string, @Res() res, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    const action = new DeletePostUsecase(this.repo);
    await action.execute(uuid, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Postagem deletado com sucesso",
    });
  }
}
