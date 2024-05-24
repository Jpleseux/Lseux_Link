import { PostsRepositoryTypeOrm } from "@modules/posts/infra/repository/postsRepository.typeOrm";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SavePostUsecase } from "@modules/posts/core/usecase/savePost.usecase";
import { GetPostsByUuidUsecase } from "@modules/posts/core/usecase/getPostByUuid.usecase";
import { FindPostsByUserUuidUsecase } from "@modules/posts/core/usecase/findPostsByUserUuid.usecase";
import { FinPostsCreatedAtTodayUsecase } from "@modules/posts/core/usecase/findPostsCreatedAtToday.usecase";
import { UpdatePostInputDto } from "./dto/updatePosts.request.dto";
import { updatePostUsecase } from "@modules/posts/core/usecase/updatePost.usecase";
import { DeletePostUsecase } from "@modules/posts/core/usecase/DeletePost.usecase";
import { SaveNewReactioRequestDto } from "./dto/saveNewReaction.request.dto";
import { AddReactionToPostUsecase } from "@modules/posts/core/usecase/addReactionToPost.usecase";
import { SaveCommentInPostUsecase } from "@modules/posts/core/usecase/saveCommentInPost.usecase";
import { SaveCommentInputDto } from "./dto/saveComment.request.dto";
import multerConfig from "@modules/shared/multer/multerConfig";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadImageStorageAws } from "@modules/posts/infra/storage/uploadImageStorage.aws";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(
    readonly repo: PostsRepositoryTypeOrm,
    readonly storage: UploadImageStorageAws,
  ) {}
  @UseInterceptors(FilesInterceptor("images", 4, multerConfig))
  @Post()
  async savePost(@Res() res, @Req() req, @Body() body: any, @UploadedFiles() images: Express.Multer.File[]) {
    console.log(req);
    const tokenDecoded = req["tokenPayload"];

    const action = new SavePostUsecase(this.repo, this.storage);
    const post = await action.execute({ text: body.text, title: body.title, userUuid: tokenDecoded.uuid, images: images });
    res.status(HttpStatus.OK).send({
      message: "Postagem salva com sucesso",
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
  @Patch("reaction/:uuid")
  async setNewReaction(@Param("uuid") uuid: string, @Res() res, @Req() req, @Body() body: SaveNewReactioRequestDto) {
    const tokenDecoded = req["tokenPayload"];
    const action = new AddReactionToPostUsecase(this.repo);
    await action.execute({ ...body, postUuid: uuid, userUuid: tokenDecoded.uuid });
    res.status(HttpStatus.OK).send({
      message: "Postagem atualizada com sucesso",
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
  @Post("save/comments")
  async saveComment(@Res() res, @Req() req, @Body() body: SaveCommentInputDto) {
    const uuid = req["tokenPayload"]["uuid"];
    const action = new SaveCommentInPostUsecase(this.repo);
    const comment = await action.execute({ ...body, userUuid: uuid });
    res.status(HttpStatus.OK).send({
      message: "Comentario salvo com sucesso",
      comment: comment.props,
    });
  }
}
