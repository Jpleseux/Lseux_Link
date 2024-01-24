import { UserEntity } from "../entities/user.entity";
import { UserRepositoryInterface } from "../registerRepository.interface";
export type userInput = {
  email: string;
  password: string;
  userName: string;
  phone_number?: string;
  isVerify?: boolean;
};
export class saveUserUsecase {
  constructor(readonly repo: UserRepositoryInterface) {}
  public async execute(user: userInput): Promise<UserEntity> {
    
  }
}
