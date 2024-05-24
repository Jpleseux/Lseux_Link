import { CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, DeleteDateColumn, Column } from "typeorm";

@Entity("blog_comments")
export class CommentsModel {
  @PrimaryColumn("uuid")
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;
  @Column()
  comment: string;
  @Column()
  post_uuid: string;
  @Column()
  user_uuid: string;
}
