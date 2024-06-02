import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("blog_notifications")
export class NotificationsModel {
  @PrimaryColumn("uuid")
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;
  @Column()
  from: string;
  @Column()
  type: string;
  @Column({
    type: !!process.env.JEST_WORKER_ID ? "simple-json" : "jsonb",
    nullable: false,
    default: !!process.env.JEST_WORKER_ID ? "{}" : {},
  })
  to: string[];
  @Column()
  message: string;
  @Column()
  is_readed: boolean;
  @Column()
  is_invite: boolean;
}
