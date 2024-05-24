import { CommentEntity } from "../../../entities/posts/comment.entity";
import { PostEntity } from "../../../entities/posts/postEntity.entity";
import { UserEntity } from "../../../entities/posts/User.entity";
import httpClient from "../../../http/httpClient";
import { outputManyPost, outputPost, postsGatewayInterface, SaveCommentInput, SaveCommentUtput, saveReactioInput } from "../../interfaces/posts/postsGateway.interface";

export class HttpPostGatewayLocal implements postsGatewayInterface {
    constructor(private httpClient: httpClient) {}
    async save(post: any): Promise<outputPost> {

        const response = await this.httpClient.post("posts", post, true);
        const data = response.data;
        if (response.status <= 300) {
            const postOut = new PostEntity({
                images: data.post.images,
                text: data.post.text,
                title: data.post.title,
                comments: data.post.comments.map((comment: any) => {
                    return new CommentEntity({...comment, createdAt: new Date(comment.createdAt)});
                }),
                user: new UserEntity(data.post.user),
                like: data.post.like,
                createdAt: new Date(data.post.createdAt),
                desLike: data.post.desLike,
                userUuid: data.post.userUuid,
                uuid: data.post.uuid,
            })
            return {
                message: data.message,
                post: postOut,
                status: response.status,
            }
        }
        return {
            status: response.status,
            message: data.message,
        }
    }
    async findPostsCreatedToday(): Promise<outputManyPost> {
        const response = await this.httpClient.get("posts/user/today");
        const data = response.data;
        if (response.status <= 300) {
            const postOutList = [];
            for (const post  of data.posts) {
                postOutList.push(
                    new PostEntity({
                        images: post.images,
                        text: post.text,
                        comments: post.comments.map((comment: any) => {
                            return new CommentEntity({...comment, createdAt: new Date(comment.createdAt)});
                        }),
                        title: post.title,
                        like: post.like,
                        createdAt: new Date(post.createdAt),
                        desLike: post.desLike,
                        user: new UserEntity(post.user),
                        userUuid: post.userUuid,
                        uuid: post.uuid,
                    })
                )
            }
            return {
                message: data.message,
                posts: postOutList,
                status: response.status,
            }
        }
        return {
            status: response.status,
            message: data.message,
        }
    }
    async setNewReaction(input: saveReactioInput): Promise<outputPost> {
        const response = await this.httpClient.patch(`posts/reaction/${input.uuid}`, input);
        const data = response.data;
        if (response.status <= 300) {

            return {
                message: data.message,
                status: response.status,
            }
        }
        return {
            status: response.status,
            message: data.message,
        }
    }
    async saveComment(comment: SaveCommentInput): Promise<SaveCommentUtput> {
       const response = await this.httpClient.post("posts/save/comments", comment);
       const data = response.data;
        const commentRes = data.comment;
       if (response.status <= 300) {
            const commentOut = new CommentEntity({
                comment: commentRes.comment,
                user: new UserEntity(commentRes.user.props),
                createdAt: new Date(commentRes.createdAt),
                userUuid: commentRes.userUuid,
                posterUuid:  commentRes.posterUuid,
                uuid: commentRes.uuid,
            })
            return {
                message: data.message,
                comment: commentOut,
                status: response.status,
            }
       }
       return {
        status: response.status,
        message: data.message,
    }
    }
}