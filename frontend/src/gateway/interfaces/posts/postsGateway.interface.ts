import { CommentEntity } from "../../../entities/posts/comment.entity";
import { PostEntity } from "../../../entities/posts/postEntity.entity";
export type outputPost = {
    post?: PostEntity;
    message: string;
    status: number;
}
export type outputManyPost = {
    posts?: PostEntity[];
    message: string;
    status: number;
}
export type saveReactioInput = {
    uuid: string;
    type: string;
}
export type SaveCommentUtput = {
    comment?: CommentEntity;
    message: string;
    status: number;
}
export type SaveCommentInput = {
    comment: string;
    posterUuid: string;
}
export interface postsGatewayInterface {
    save(post: any): Promise<outputPost>;
    setNewReaction(input: saveReactioInput): Promise<outputPost>;
    findPostsCreatedToday(): Promise<outputManyPost>;
    saveComment(comment: SaveCommentInput): Promise<SaveCommentUtput>;
}