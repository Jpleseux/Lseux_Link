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
export interface postsGatewayInterface {
    save(post: PostEntity): Promise<outputPost>;
    findPostsCreatedToday(): Promise<outputManyPost>;
}