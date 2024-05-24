import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
export type reaction = {
  amount: number;
  userUuids: string[];
};
@Entity("blog_posts")
export class PostModel {
  @PrimaryColumn("uuid")
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;
  @Column()
  title: string;
  @Column()
  text: string;
  @Column({
    type: !!process.env.JEST_WORKER_ID ? "simple-json" : "jsonb",
    nullable: false,
    default: !!process.env.JEST_WORKER_ID ? "{}" : {},
  })
  images?: string[];
  @Column()
  user_uuid: string;
  @Column({
    type: !!process.env.JEST_WORKER_ID ? "simple-json" : "jsonb",
    nullable: false,
    default: !!process.env.JEST_WORKER_ID ? "{}" : {},
  })
  like: reaction;
  @Column({
    type: !!process.env.JEST_WORKER_ID ? "simple-json" : "jsonb",
    nullable: false,
    default: !!process.env.JEST_WORKER_ID ? "{}" : {},
  })
  des_like: reaction;
}
