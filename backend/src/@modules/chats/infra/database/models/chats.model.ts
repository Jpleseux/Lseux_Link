import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("blog_chats")
export class ChatsModel {
  @PrimaryColumn("uuid")
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;
  @Column()
  name: string;
  @Column()
  type: string;
  @Column({
    type: !!process.env.JEST_WORKER_ID ? "simple-json" : "jsonb",
    nullable: false,
    default: !!process.env.JEST_WORKER_ID ? "{}" : {},
  })
  user_uuids: string[];
}
