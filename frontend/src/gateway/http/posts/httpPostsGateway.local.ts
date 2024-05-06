import { PostEntity } from "../../../entities/posts/postEntity.entity";
import { UserEntity } from "../../../entities/posts/User.entity";
import httpClient from "../../../http/httpClient";
import { outputManyPost, outputPost, postsGatewayInterface } from "../../interfaces/posts/postsGateway.interface";

export class HttpPostGatewayLocal implements postsGatewayInterface {
    constructor(private httpClient: httpClient) {}
    async save(post: PostEntity): Promise<outputPost> {
        const response = await this.httpClient.post("posts", post.props);
        const data = response.data;
        if (response.status <= 300) {
            const postOut = new PostEntity({
                images: data.images,
                text: data.text,
                title: data.title,
                user: new UserEntity(data.user),
                like: data.like,
                desLike: data.desLike,
                userUuid: data.userUuid,
                uuid: data.uuid,
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
                        title: post.title,
                        like: post.like,
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
}