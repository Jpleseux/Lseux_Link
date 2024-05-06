import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("auth_users")
export class PostsUserModel {
  @PrimaryColumn("uuid")
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;

  @Column()
  userName: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  phone_number: string;
  @Column()
  avatar: string;
  @Column({ default: false })
  is_verify?: boolean;
}
