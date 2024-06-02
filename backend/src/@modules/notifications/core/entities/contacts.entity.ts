import { UserEntity } from "./user.entity";

export type contactProps = {
  uuid: string;
  first_user: UserEntity;
  second_user: UserEntity;
};
