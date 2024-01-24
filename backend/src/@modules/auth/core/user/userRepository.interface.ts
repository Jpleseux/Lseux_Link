import { UserEntity } from "./entities/user.entity";

export interface UserRepositoryInterface {
    saveUser(): Promise<UserEntity>; 
}